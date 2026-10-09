<?php

namespace App\Http\Controllers;

use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $paths = $user->learningPaths()->with('milestones.topics')->latest()->get();
        $topics = $paths->flatMap(fn ($path) => $path->milestones->flatMap->topics);
        $completed = $topics->where('lesson_status', 'completed')->count();
        $weekStart = CarbonImmutable::now()->startOfWeek();
        $activity = collect(range(0, 6))->map(function (int $offset) use ($weekStart, $topics) {
            $date = $weekStart->addDays($offset);

            return [
                'day' => $date->format('D'),
                'topics' => $topics->filter(
                    fn ($topic) => $topic->lesson_status === 'completed'
                        && $topic->updated_at?->isSameDay($date),
                )->count(),
            ];
        })->values();

        return Inertia::render('dashboard', [
            'stats' => [
                ['value' => (string) $paths->where('generation_status', 'completed')->count(), 'label' => 'Active Paths', 'note' => 'From your learning paths'],
                ['value' => (string) $completed, 'label' => 'Topics Completed', 'note' => 'Completed lessons'],
                ['value' => '0h', 'label' => 'Study Time', 'note' => 'Study tracking coming soon'],
                ['value' => '0', 'label' => 'Day Streak', 'note' => 'Start learning today'],
            ],
            'courses' => $paths->take(4)->map(function ($path) {
                $allTopics = $path->milestones->flatMap->topics;
                $completed = $allTopics->where('lesson_status', 'completed')->count();
                $total = $allTopics->count();

                return [
                    'id' => $path->id,
                    'title' => $path->title,
                    'kind' => $path->category ?: 'Learning path',
                    'duration' => $path->duration_weeks.' weeks',
                    'progress' => $total ? (int) round($completed / $total * 100) : 0,
                    'topics' => $completed.' of '.$total.' topics completed',
                    'tone' => 'from-emerald-200 via-teal-300 to-slate-900',
                ];
            })->values(),
            'activity' => $activity,
        ]);
    }
}
