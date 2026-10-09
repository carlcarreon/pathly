<?php

namespace App\Services;

use App\Models\LearningPathTopic;
use GuzzleHttp\Client;
use RuntimeException;

class OpenRouterTopicLessonGenerator
{
    public function generate(LearningPathTopic $topic): string
    {
        $path = $topic->milestone->learningPath;
        $client = new Client([
            'base_uri' => rtrim((string) config('services.openrouter.base_url'), '/').'/',
            'timeout' => 120,
        ]);
        $response = $client->request('POST', 'chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer '.config('services.openrouter.key'),
                'Content-Type' => 'application/json',
                'HTTP-Referer' => config('app.url'),
                'X-Title' => config('app.name'),
            ],
            'json' => [
                'model' => config('services.openrouter.model'),
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a clear, accurate learning-content writer. Return Markdown only. Do not use raw HTML.'],
                    ['role' => 'user', 'content' => $this->prompt($path->title, $topic)],
                ],
            ],
        ]);
        $body = json_decode((string) $response->getBody(), true);
        $content = trim((string) data_get($body, 'choices.0.message.content'));

        if ($content === '') {
            throw new RuntimeException('The AI provider returned an empty lesson.');
        }

        return $content;
    }

    private function prompt(string $pathTitle, LearningPathTopic $topic): string
    {
        return <<<PROMPT
Write a self-contained structured learning lesson in Markdown for the topic "{$topic->title}" in the learning path "{$pathTitle}".
Topic type: {$topic->content_type}.
Topic overview: {$topic->description}

Include an engaging introduction, clearly headed explanations, practical examples (with fenced code only when relevant), a concise key-takeaways section, and 2-3 suggested next steps or resources. Be accurate, beginner-friendly, and avoid raw HTML.
PROMPT;
    }
}
