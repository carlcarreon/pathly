<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $users = User::query()->withCount('learningPaths')->latest()->get();

        return Inertia::render('admin/users', [
            'stats' => [
                ['label' => 'Total Users', 'value' => (string) $users->count()],
                ['label' => 'Active This Week', 'value' => (string) $users->where('updated_at', '>=', now()->subWeek())->count()],
                ['label' => 'Path Creators', 'value' => (string) $users->where('learning_paths_count', '>', 0)->count()],
                ['label' => 'Top Streak', 'value' => '0 days'],
            ],
            'users' => $users->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'paths_count' => $user->learning_paths_count,
                'joined_at' => $user->created_at?->toDateString(),
            ])->values(),
        ]);
    }
}
