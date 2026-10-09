<?php

namespace App\Jobs;

use App\Models\LearningPathTopic;
use App\Services\OpenRouterTopicLessonGenerator;
use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

class GenerateLearningPathTopicLesson implements ShouldQueue
{
    use Batchable, Queueable;

    public int $tries = 3;

    public array $backoff = [10, 30, 120];

    public int $timeout = 150;

    public function __construct(public int $topicId) {}

    public function handle(OpenRouterTopicLessonGenerator $generator): void
    {
        if ($this->batch()?->cancelled()) {
            return;
        }

        $topic = LearningPathTopic::query()->with('milestone.learningPath')->findOrFail($this->topicId);
        $topic->update(['lesson_status' => 'generating']);
        $topic->update([
            'content' => $generator->generate($topic),
            'lesson_status' => 'completed',
        ]);
    }

    public function failed(Throwable $exception): void
    {
        LearningPathTopic::query()->whereKey($this->topicId)->update(['lesson_status' => 'failed']);
    }
}
