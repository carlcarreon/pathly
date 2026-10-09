<?php

namespace App\Http\Controllers;

use App\Http\Requests\GenerateLearningPathRequest;
use App\Jobs\GenerateLearningPathRoadmap;
use App\Jobs\GenerateLearningPathTopicLesson;
use App\Models\LearningPath;
use App\Models\LearningPathMilestone;
use App\Models\LearningPathTopic;
use App\Models\User;
use App\Services\OpenRouterLearningPathGenerator;
use Illuminate\Bus\Batch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;
use Throwable;

/** @phpstan-import-type LearningPathInput from OpenRouterLearningPathGenerator */
class LearningPathGenerationController extends Controller
{
    public function store(GenerateLearningPathRequest $request): JsonResponse
    {
        /** @var LearningPathInput $input */
        $input = $request->validated();
        $user = $request->user();
        abort_unless($user instanceof User, 403);
        $path = $user->learningPaths()->create([
            'title' => $input['topic'],
            'description' => 'Your learning path is being prepared.',
            'level' => $input['level'],
            'duration_weeks' => $input['duration'],
            'preferences' => $input['preferences'],
            'generation_source' => 'openrouter',
            'generation_status' => 'queued',
            'is_public' => false,
        ]);
        $batch = $this->dispatchBatch($path, [new GenerateLearningPathRoadmap($path->id, $input)]);

        return response()->json([
            'path_id' => $path->id,
            'batch_id' => $batch->id,
            'status' => $path->generation_status,
        ], 202);
    }

    public function status(Request $request, LearningPath $learningPath): JsonResponse
    {
        $this->authorizeOwner($request, $learningPath);
        /** @var LearningPath $path */
        $path = LearningPath::query()
            ->with(['milestones.topics', 'resources'])
            ->findOrFail($learningPath->id);
        $topics = $path->milestones->flatMap(
            fn (LearningPathMilestone $milestone) => $milestone->topics,
        );
        $batch = $path->generation_batch_id ? Bus::findBatch($path->generation_batch_id) : null;

        return response()->json([
            'path' => $this->pathData($path),
            'status' => $path->generation_status,
            'topics' => [
                'total' => $topics->count(),
                'completed' => $topics->where('lesson_status', 'completed')->count(),
                'failed' => $topics->where('lesson_status', 'failed')->count(),
            ],
            'batch' => $batch ? [
                'id' => $batch->id,
                'total_jobs' => $batch->totalJobs,
                'pending_jobs' => $batch->pendingJobs,
                'failed_jobs' => $batch->failedJobs,
                'progress' => $batch->progress(),
                'finished_at' => $batch->finishedAt?->toAtomString(),
            ] : null,
        ]);
    }

    public function retry(Request $request, LearningPath $learningPath): JsonResponse
    {
        $this->authorizeOwner($request, $learningPath);
        $topicIds = $learningPath->milestones()->with('topics')->get()
            ->flatMap(fn (LearningPathMilestone $milestone) => $milestone->topics)
            ->filter(fn (LearningPathTopic $topic) => $topic->lesson_status !== 'completed' || blank($topic->content))
            ->pluck('id')
            ->map(fn (string $topicId): string => $topicId)
            ->all();

        abort_if($topicIds === [], 422, 'There are no incomplete lessons to retry.');
        $learningPath->update(['generation_status' => 'generating_lessons', 'is_public' => false]);
        $batch = $this->dispatchBatch($learningPath, array_map(
            fn (string $topicId) => new GenerateLearningPathTopicLesson($topicId),
            $topicIds,
        ));

        return response()->json(['path_id' => $learningPath->id, 'batch_id' => $batch->id], 202);
    }

    public function cancel(Request $request, LearningPath $learningPath): JsonResponse
    {
        $this->authorizeOwner($request, $learningPath);
        abort_if(
            in_array($learningPath->generation_status, ['completed', 'cancelled'], true),
            422,
            'This learning path is no longer being generated.',
        );

        if ($learningPath->generation_batch_id) {
            Bus::findBatch($learningPath->generation_batch_id)?->cancel();
        }

        $learningPath->update([
            'generation_status' => 'cancelled',
            'is_public' => false,
            'metadata' => [
                ...(is_array($learningPath->metadata) ? $learningPath->metadata : []),
                'cancelled_at' => now()->toAtomString(),
            ],
        ]);

        return response()->json([
            'path_id' => $learningPath->id,
            'status' => $learningPath->generation_status,
        ]);
    }

    /**
     * @param  array<int, GenerateLearningPathRoadmap|GenerateLearningPathTopicLesson>  $jobs
     */
    private function dispatchBatch(LearningPath $path, array $jobs): Batch
    {
        $pathId = $path->id;
        $batch = Bus::batch($jobs)
            ->name("Learning path {$pathId}")
            ->onQueue('learning-generation')
            ->then(function (Batch $batch) use ($pathId): void {
                if ($batch->cancelled()) {
                    return;
                }

                LearningPath::query()->whereKey($pathId)->update([
                    'generation_status' => 'completed',
                    'is_public' => true,
                ]);
            })
            ->catch(function (Batch $batch, Throwable $exception) use ($pathId): void {
                if ($batch->cancelled()) {
                    return;
                }

                $path = LearningPath::query()->find($pathId);
                if ($path) {
                    $path->update([
                        'generation_status' => 'failed',
                        'is_public' => false,
                        'metadata' => [
                            ...(is_array($path->metadata) ? $path->metadata : []),
                            'last_error' => 'Lesson generation failed. Retry to continue.',
                        ],
                    ]);
                }
            })
            ->dispatch();
        $path->update(['generation_batch_id' => $batch->id]);

        return $batch;
    }

    private function authorizeOwner(Request $request, LearningPath $learningPath): void
    {
        abort_unless($learningPath->user_id === $request->user()->id, 403);
    }

    /**
     * @return array<string, mixed>
     */
    private function pathData(LearningPath $path): array
    {
        return [
            'id' => $path->id,
            'title' => $path->title,
            'description' => $path->description,
            'level' => $path->level,
            'duration_weeks' => $path->duration_weeks,
            'generation_status' => $path->generation_status,
            'milestones' => $path->milestones->map(fn (LearningPathMilestone $milestone) => [
                'id' => $milestone->id,
                'position' => $milestone->position,
                'title' => $milestone->title,
                'description' => $milestone->description,
                'topics' => $milestone->topics->map(fn (LearningPathTopic $topic) => [
                    'id' => $topic->id,
                    'title' => $topic->title,
                    'description' => $topic->description,
                    'content_type' => $topic->content_type,
                    'content' => $topic->content,
                    'lesson_status' => $topic->lesson_status,
                ])->values(),
            ])->values(),
        ];
    }
}
