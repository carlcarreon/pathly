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

    /** @var list<int> */
    public array $backoff = [10, 30, 120];

    public int $timeout = 150;

    public function __construct(public string $topicId) {}

    public function handle(OpenRouterTopicLessonGenerator $generator): void
    {
        if ($this->batch()?->cancelled()) {
            return;
        }

        /** @var LearningPathTopic $topic */
        $topic = LearningPathTopic::query()->with('milestone.learningPath')->findOrFail($this->topicId);
        $topic->update(['lesson_status' => 'generating']);
        $content = $generator->generate($topic);

        if ($this->batch()?->cancelled()) {
            return;
        }

        $topic->update([
            'content' => $content,
            'lesson_status' => 'completed',
        ]);
    }

    public function failed(Throwable $exception): void
    {
        LearningPathTopic::query()->whereKey($this->topicId)->update(['lesson_status' => 'failed']);
    }
}
