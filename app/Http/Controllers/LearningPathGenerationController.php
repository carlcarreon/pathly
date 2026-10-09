<?php

namespace App\Http\Controllers;

use App\Http\Requests\GenerateLearningPathRequest;
use App\Jobs\GenerateLearningPathRoadmap;
use App\Jobs\GenerateLearningPathTopicLesson;
use App\Models\LearningPath;
use Illuminate\Bus\Batch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;
use Throwable;

class LearningPathGenerationController extends Controller
{
    public function store(GenerateLearningPathRequest $request): JsonResponse
    {
        $input = $request->validated();
        $path = $request->user()->learningPaths()->create([
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
        $path = $learningPath->fresh(['milestones.topics', 'resources']);
        $topics = $path->milestones->flatMap->topics;
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
            ->flatMap->topics
            ->filter(fn ($topic) => $topic->lesson_status !== 'completed' || blank($topic->content))
            ->pluck('id')
            ->all();

        abort_if($topicIds === [], 422, 'There are no incomplete lessons to retry.');
        $learningPath->update(['generation_status' => 'generating_lessons', 'is_public' => false]);
        $batch = $this->dispatchBatch($learningPath, array_map(
            fn (int $topicId) => new GenerateLearningPathTopicLesson($topicId),
            $topicIds,
        ));

        return response()->json(['path_id' => $learningPath->id, 'batch_id' => $batch->id], 202);
    }

    private function dispatchBatch(LearningPath $path, array $jobs): Batch
    {
        $pathId = $path->id;
        $batch = Bus::batch($jobs)
            ->name("Learning path {$pathId}")
            ->onQueue('learning-generation')
            ->then(function (Batch $batch) use ($pathId): void {
                LearningPath::query()->whereKey($pathId)->update([
                    'generation_status' => 'completed',
                    'is_public' => true,
                ]);
            })
            ->catch(function (Batch $batch, Throwable $exception) use ($pathId): void {
                $path = LearningPath::query()->find($pathId);
                if ($path) {
                    $path->update([
                        'generation_status' => 'failed',
                        'is_public' => false,
                        'metadata' => [...($path->metadata ?? []), 'last_error' => 'Lesson generation failed. Retry to continue.'],
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

    private function pathData(LearningPath $path): array
    {
        return [
            'id' => $path->id,
            'title' => $path->title,
            'description' => $path->description,
            'level' => $path->level,
            'duration_weeks' => $path->duration_weeks,
            'generation_status' => $path->generation_status,
            'milestones' => $path->milestones->map(fn ($milestone) => [
                'id' => $milestone->id,
                'position' => $milestone->position,
                'title' => $milestone->title,
                'description' => $milestone->description,
                'topics' => $milestone->topics->map(fn ($topic) => [
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
