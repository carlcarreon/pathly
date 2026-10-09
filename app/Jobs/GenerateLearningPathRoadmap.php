<?php

namespace App\Jobs;

use App\Models\LearningPath;
use App\Services\OpenRouterLearningPathGenerator;
use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;

/** @phpstan-import-type LearningPathInput from OpenRouterLearningPathGenerator */
class GenerateLearningPathRoadmap implements ShouldQueue
{
    use Batchable, Queueable;

    public int $tries = 3;

    /** @var list<int> */
    public array $backoff = [10, 30, 120];

    public int $timeout = 150;

    /** @var LearningPathInput */
    public array $input;

    /**
     * @param  LearningPathInput  $input
     */
    public function __construct(public string $learningPathId, array $input)
    {
        $this->input = $input;
    }

    public function handle(OpenRouterLearningPathGenerator $generator): void
    {
        if ($this->batch()?->cancelled()) {
            return;
        }

        /** @var LearningPath $path */
        $path = LearningPath::query()->findOrFail($this->learningPathId);
        $path->update(['generation_status' => 'generating_roadmap']);
        $generated = $generator->generate($this->input);

        if ($this->batch()?->cancelled()) {
            return;
        }

        /** @var list<string> $topicIds */
        $topicIds = DB::transaction(function () use ($path, $generated): array {
            $path->update([
                'title' => $generated['title'],
                'description' => $generated['description'],
                'category' => $generated['category'] ?? null,
                'generation_status' => 'generating_lessons',
            ]);
            $topicIds = [];

            foreach ($generated['milestones'] as $index => $milestoneData) {
                $milestone = $path->milestones()->create([
                    'position' => $index + 1,
                    'title' => $milestoneData['title'],
                    'description' => $milestoneData['description'] ?? null,
                ]);
                foreach ($milestoneData['topics'] as $topicIndex => $topicData) {
                    $topic = $milestone->topics()->create([
                        'position' => $topicIndex + 1,
                        'title' => $topicData['title'],
                        'description' => $topicData['description'] ?? null,
                        'content_type' => $topicData['content_type'] ?? 'reading',
                        'lesson_status' => 'queued',
                    ]);
                    $topicIds[] = $topic->id;
                }
            }

            return $topicIds;
        });

        if ($this->batch()?->cancelled()) {
            return;
        }

        $this->batch()?->add(array_map(
            fn (string $topicId) => (new GenerateLearningPathTopicLesson($topicId))->onQueue('learning-generation'),
            $topicIds,
        ));
    }
}
