<?php

use App\Jobs\GenerateLearningPathRoadmap;
use App\Jobs\GenerateLearningPathTopicLesson;
use App\Models\LearningPath;
use App\Models\User;
use App\Services\OpenRouterLearningPathGenerator;
use App\Services\OpenRouterTopicLessonGenerator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use RuntimeException;

function generationInput(array $overrides = []): array
{
    return array_replace_recursive([
        'topic' => 'PHP',
        'level' => 'beginner',
        'duration' => 4,
        'preferences' => [
            'practical' => true,
            'resources' => false,
            'exercises' => true,
        ],
    ], $overrides);
}

function learningPathFor(User $user, array $attributes = []): LearningPath
{
    return $user->learningPaths()->create(array_merge([
        'title' => 'PHP for Beginners',
        'description' => 'A practical PHP foundation.',
        'level' => 'beginner',
        'duration_weeks' => 4,
        'generation_status' => 'generating_lessons',
        'is_public' => false,
    ], $attributes));
}

it('validates learning path generation input', function () {
    $this->actingAs(User::factory()->create())
        ->postJson(route('paths.generate'), [
            'topic' => '',
            'level' => 'expert',
            'duration' => 2,
            'preferences' => [],
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['topic', 'level', 'duration']);
});

it('rejects non-boolean learning path preferences', function () {
    $this->actingAs(User::factory()->create())
        ->postJson(route('paths.generate'), generationInput([
            'preferences' => [
                'practical' => 'sometimes',
                'resources' => false,
                'exercises' => true,
            ],
        ]))
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['preferences.practical']);
});

it('queues a private learning path and its roadmap batch', function () {
    Bus::fake();
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson(route('paths.generate'), generationInput());

    $response->assertAccepted()->assertJsonPath('status', 'queued');
    $path = LearningPath::query()->sole();

    expect($path)
        ->user_id->toBe($user->id)
        ->generation_status->toBe('queued')
        ->is_public->toBeFalse()
        ->generation_batch_id->not->toBeNull();

    Bus::assertBatched([
        fn (GenerateLearningPathRoadmap $job) => $job->learningPathId === $path->id,
    ]);
});

it('publishes the path only after its batch completes', function () {
    Bus::fake();
    $user = User::factory()->create();

    $this->actingAs($user)->postJson(route('paths.generate'), generationInput())
        ->assertAccepted();
    $path = LearningPath::query()->sole();
    $pendingBatch = Bus::batched(
        fn ($batch) => $batch->hasJobs([GenerateLearningPathRoadmap::class]),
    )->sole();
    $batch = Bus::findBatch($path->generation_batch_id);

    $pendingBatch->thenCallbacks()[0]($batch);

    expect($path->refresh())
        ->generation_status->toBe('completed')
        ->is_public->toBeTrue();
});

it('keeps the path private when its batch fails', function () {
    Bus::fake();
    $user = User::factory()->create();

    $this->actingAs($user)->postJson(route('paths.generate'), generationInput())
        ->assertAccepted();
    $path = LearningPath::query()->sole();
    $pendingBatch = Bus::batched(
        fn ($batch) => $batch->hasJobs([GenerateLearningPathRoadmap::class]),
    )->sole();
    $batch = Bus::findBatch($path->generation_batch_id);

    $pendingBatch->catchCallbacks()[0]($batch, new RuntimeException('Provider error'));

    expect($path->refresh())
        ->generation_status->toBe('failed')
        ->is_public->toBeFalse()
        ->metadata->toMatchArray([
            'last_error' => 'Lesson generation failed. Retry to continue.',
        ]);
});

it('persists a roadmap and adds one lesson job for every topic', function () {
    $user = User::factory()->create();
    $path = learningPathFor($user, ['generation_status' => 'queued']);
    $roadmap = [
        'title' => 'PHP for Beginners',
        'description' => 'A practical PHP foundation.',
        'category' => 'Technology',
        'milestones' => collect(range(1, 4))->map(fn (int $week) => [
            'title' => "Week {$week}",
            'description' => 'A practical weekly milestone.',
            'topics' => [
                [
                    'title' => 'Variables',
                    'description' => 'Learn variables.',
                    'content_type' => 'reading',
                ],
                [
                    'title' => 'Practice variables',
                    'description' => 'Use variables.',
                    'content_type' => 'practice',
                ],
            ],
        ])->all(),
    ];
    $this->mock(OpenRouterLearningPathGenerator::class, function ($mock) use ($roadmap) {
        $mock->shouldReceive('generate')->once()->andReturn($roadmap);
    });
    [$job, $batch] = (new GenerateLearningPathRoadmap($path->id, generationInput()))
        ->withFakeBatch();

    $job->handle(app(OpenRouterLearningPathGenerator::class));

    $path->refresh();
    expect($path)
        ->generation_status->toBe('generating_lessons')
        ->title->toBe('PHP for Beginners');
    $this->assertDatabaseCount('learning_path_milestones', 4);
    $this->assertDatabaseCount('learning_path_topics', 8);
    expect($batch->added)->toHaveCount(8);
    expect($batch->added)->each->toBeInstanceOf(GenerateLearningPathTopicLesson::class);
});

it('stores generated Markdown and completes the topic lesson', function () {
    $user = User::factory()->create();
    $path = learningPathFor($user);
    $milestone = $path->milestones()->create([
        'position' => 1,
        'title' => 'Week 1',
    ]);
    $topic = $milestone->topics()->create([
        'position' => 1,
        'title' => 'Introduction to PHP',
        'description' => 'Learn the fundamentals.',
        'content_type' => 'reading',
        'lesson_status' => 'queued',
    ]);
    $this->mock(OpenRouterTopicLessonGenerator::class, function ($mock) {
        $mock->shouldReceive('generate')
            ->once()
            ->andReturn("# Introduction to PHP\n\n## Key takeaways");
    });

    (new GenerateLearningPathTopicLesson($topic->id))
        ->handle(app(OpenRouterTopicLessonGenerator::class));

    expect($topic->refresh())
        ->lesson_status->toBe('completed')
        ->content->toContain('Key takeaways');
});

it('marks a topic lesson as failed when all retries are exhausted', function () {
    $user = User::factory()->create();
    $path = learningPathFor($user);
    $milestone = $path->milestones()->create(['position' => 1, 'title' => 'Week 1']);
    $topic = $milestone->topics()->create([
        'position' => 1,
        'title' => 'Introduction to PHP',
        'content_type' => 'reading',
    ]);

    (new GenerateLearningPathTopicLesson($topic->id))
        ->failed(new RuntimeException('Provider error'));

    expect($topic->refresh()->lesson_status)->toBe('failed');
});

it('only lets the owner poll generation status and retry incomplete lessons', function () {
    Bus::fake();
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $path = learningPathFor($owner, ['generation_status' => 'failed']);
    $milestone = $path->milestones()->create(['position' => 1, 'title' => 'Week 1']);
    $topic = $milestone->topics()->create([
        'position' => 1,
        'title' => 'Introduction to PHP',
        'content_type' => 'reading',
        'lesson_status' => 'failed',
    ]);

    $this->actingAs($otherUser)
        ->getJson(route('paths.generation-status', $path))
        ->assertForbidden();
    $this->actingAs($otherUser)
        ->postJson(route('paths.generation-retry', $path))
        ->assertForbidden();

    $this->actingAs($owner)
        ->getJson(route('paths.generation-status', $path))
        ->assertOk()
        ->assertJsonPath('topics.total', 1)
        ->assertJsonPath('topics.failed', 1);
    $this->actingAs($owner)
        ->postJson(route('paths.generation-retry', $path))
        ->assertAccepted();

    expect($path->refresh())
        ->generation_status->toBe('generating_lessons')
        ->is_public->toBeFalse();
    Bus::assertBatched([
        fn (GenerateLearningPathTopicLesson $job) => $job->topicId === $topic->id,
    ]);
});

it('provides the My Learnings payload through learning path resources', function () {
    $user = User::factory()->create();
    $path = learningPathFor($user, ['generation_status' => 'completed']);
    $milestone = $path->milestones()->create(['position' => 1, 'title' => 'Week 1']);
    $topic = $milestone->topics()->create([
        'position' => 1,
        'title' => 'Introduction to PHP',
        'content_type' => 'reading',
        'lesson_status' => 'completed',
        'content' => '# Introduction to PHP',
    ]);
    $topic->resources()->create([
        'learning_path_id' => $path->id,
        'name' => 'PHP guide',
        'disk' => 's3',
        'path' => 'learning-paths/php-guide.pdf',
        'url' => 'https://example.test/php-guide.pdf',
        'mime_type' => 'application/pdf',
        'size' => 1024,
    ]);

    $this->actingAs($user)
        ->get(route('learning'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('learning/index')
            ->where('paths.0.id', $path->id)
            ->where('paths.0.generation_status', 'completed')
            ->where('paths.0.topics_count', 1)
            ->where('paths.0.milestones.0.topics.0.content', '# Introduction to PHP')
            ->where('paths.0.milestones.0.topics.0.resources.0.name', 'PHP guide')
        );
});

it('uploads a public s3 resource for the owning user', function () {
    Storage::fake('s3');
    $user = User::factory()->create();
    $path = learningPathFor($user);

    $this->actingAs($user)->post(route('paths.resources.store', $path), [
        'file' => UploadedFile::fake()->create('guide.pdf', 100, 'application/pdf'),
    ])->assertCreated();

    $resource = $path->resources()->firstOrFail();
    Storage::disk('s3')->assertExists($resource->path);
});
