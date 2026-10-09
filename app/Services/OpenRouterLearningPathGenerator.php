<?php

namespace App\Services;

use Generator;
use GuzzleHttp\Client;
use Illuminate\Support\Arr;
use RuntimeException;

/**
 * @phpstan-type LearningPathInput array{
 *     topic: string,
 *     level: 'beginner'|'intermediate'|'advanced',
 *     duration: int,
 *     preferences: array{practical: bool, resources: bool, exercises: bool}
 * }
 * @phpstan-type GeneratedTopic array{
 *     title: string,
 *     description: string,
 *     content_type: 'reading'|'practice'|'conversation'|'exercise'
 * }
 * @phpstan-type GeneratedMilestone array{
 *     title: string,
 *     description: string,
 *     topics: list<GeneratedTopic>
 * }
 * @phpstan-type GeneratedLearningPath array{
 *     title: string,
 *     description: string,
 *     category?: string,
 *     milestones: list<GeneratedMilestone>
 * }
 */
class OpenRouterLearningPathGenerator
{
    /**
     * @param  LearningPathInput  $input
     * @return GeneratedLearningPath
     */
    public function generate(array $input): array
    {
        foreach ($this->stream($input) as $event) {
            if ($event['type'] === 'result') {
                return $event['path'];
            }
        }

        throw new RuntimeException('The AI provider returned no learning path.');
    }

    /**
     * @param  LearningPathInput  $input
     * @return Generator<int, array{type: 'delta', content: string}|array{type: 'result', path: GeneratedLearningPath}>
     */
    public function stream(array $input): Generator
    {
        $client = new Client(['base_uri' => rtrim((string) config('services.openrouter.base_url'), '/').'/', 'timeout' => 90]);
        $response = $client->request('POST', 'chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer '.config('services.openrouter.key'),
                'Content-Type' => 'application/json',
                'HTTP-Referer' => config('app.url'),
                'X-Title' => config('app.name'),
            ],
            'json' => [
                'model' => config('services.openrouter.model'),
                'stream' => true,
                'max_tokens' => (int) config(
                    'services.openrouter.roadmap_max_tokens',
                ),
                'temperature' => 0.2,
                'messages' => [
                    ['role' => 'system', 'content' => 'You create concise learning roadmaps. Return only valid JSON, never markdown or commentary.'],
                    ['role' => 'user', 'content' => $this->prompt($input)],
                ],
            ],
            'stream' => true,
        ]);

        $buffer = '';
        $content = '';
        $body = $response->getBody();
        while (! $body->eof()) {
            $buffer .= $body->read(8192);
            while (($offset = strpos($buffer, "\n")) !== false) {
                $line = trim(substr($buffer, 0, $offset));
                $buffer = substr($buffer, $offset + 1);
                if (! str_starts_with($line, 'data: ')) {
                    continue;
                }
                $data = substr($line, 6);
                if ($data === '[DONE]') {
                    break 2;
                }
                $chunk = json_decode($data, true);
                $delta = Arr::get($chunk, 'choices.0.delta.content', '');
                if ($delta !== '') {
                    $content .= $delta;
                    yield ['type' => 'delta', 'content' => $delta];
                }
            }
        }

        if ($content === '') {
            throw new RuntimeException('The AI provider returned no learning path.');
        }
        yield ['type' => 'result', 'path' => $this->decode($content, (int) $input['duration'])];
    }

    /** @param LearningPathInput $input */
    private function prompt(array $input): string
    {
        return <<<PROMPT
Generate a {$input['duration']}-week {$input['level']} learning path for "{$input['topic']}".
Preferences: practical skills {$this->bool($input['preferences']['practical'] ?? false)}, include resources {$this->bool($input['preferences']['resources'] ?? false)}, include exercises {$this->bool($input['preferences']['exercises'] ?? false)}.
Return exactly this JSON object: {"title":"string","description":"string","category":"string","milestones":[{"title":"string","description":"string","topics":[{"title":"string","description":"string","content_type":"reading|practice|conversation|exercise"}]}]}. Include exactly {$input['duration']} milestones and exactly 2 topics per milestone. Keep every description to one concise sentence of at most 18 words.
PROMPT;
    }

    private function bool(bool $value): string
    {
        return $value ? 'yes' : 'no';
    }

    /** @return GeneratedLearningPath */
    private function decode(string $content, int $duration): array
    {
        $content = preg_replace('/^```(?:json)?\s*|\s*```$/', '', trim($content));
        $path = json_decode($content, true, flags: JSON_THROW_ON_ERROR);

        if (! is_array($path)
            || ! is_string($path['title'] ?? null)
            || ! is_string($path['description'] ?? null)
            || (isset($path['category']) && ! is_string($path['category']))
            || ! is_array($path['milestones'] ?? null)
            || count($path['milestones']) !== $duration) {
            throw new RuntimeException('The AI provider returned an invalid learning path format.');
        }

        foreach ($path['milestones'] as $milestone) {
            if (! is_array($milestone)
                || ! is_string($milestone['title'] ?? null)
                || ! is_string($milestone['description'] ?? null)
                || ! is_array($milestone['topics'] ?? null)
                || count($milestone['topics']) < 2
                || count($milestone['topics']) > 5) {
                throw new RuntimeException('The AI provider returned invalid learning path milestones.');
            }

            foreach ($milestone['topics'] as $topic) {
                if (! is_array($topic)
                    || ! is_string($topic['title'] ?? null)
                    || ! is_string($topic['description'] ?? null)
                    || ! in_array($topic['content_type'] ?? null, ['reading', 'practice', 'conversation', 'exercise'], true)) {
                    throw new RuntimeException('The AI provider returned invalid learning path topics.');
                }
            }
        }

        /** @var GeneratedLearningPath $path */
        return $path;
    }
}
