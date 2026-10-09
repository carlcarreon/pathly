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
                'max_tokens' => (int) config(
                    'services.openrouter.lesson_max_tokens',
                ),
                'temperature' => 0.2,
                'messages' => [
                    ['role' => 'system', 'content' => 'You write concise, accurate learning summaries. Return Markdown only. Do not use raw HTML.'],
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
Write a concise, self-contained learning summary in Markdown for the topic "{$topic->title}" in the learning path "{$pathTitle}".
Topic type: {$topic->content_type}.
Topic overview: {$topic->description}

Target 150-220 words and never exceed 280 words. Include only: a short overview, 3 key points, one small practical example when relevant (a fenced code block only for technical topics), and 2 key takeaways. Be accurate, beginner-friendly, and avoid raw HTML, filler, resource lists, and repeated explanations.
PROMPT;
    }
}
