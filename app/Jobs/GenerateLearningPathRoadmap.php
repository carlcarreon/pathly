<?php

namespace App\Jobs;

use App\Models\LearningPath;
use App\Services\OpenRouterLearningPathGenerator;
use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;

class GenerateLearningPathRoadmap implements ShouldQueue
{
    use Batchable, Queueable;

    public int $tries = 3;

    public array $backoff = [10, 30, 120];

    public int $timeout = 150;

    public function __construct(public int $learningPathId, public array $input) {}

    public function handle(OpenRouterLearningPathGenerator $generator): void
    {
        if ($this->batch()?->cancelled()) {
            return;
        }

        $path = LearningPath::query()->findOrFail($this->learningPathId);
        $path->update(['generation_status' => 'generating_roadmap']);
        $generated = $generator->generate($this->input);

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

        $this->batch()?->add(array_map(
            fn (int $topicId) => (new GenerateLearningPathTopicLesson($topicId))->onQueue('learning-generation'),
            $topicIds,
        ));
    }
}
