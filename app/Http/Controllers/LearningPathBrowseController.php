<?php

namespace App\Http\Controllers;

use App\Http\Resources\LearningPathResource;
use App\Models\LearningPath;
use App\Repositories\LearningPathRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LearningPathBrowseController extends Controller
{
    public function __construct(private readonly LearningPathRepository $learningPaths) {}

    public function explore(): Response
    {
        return Inertia::render('explore', [
            'paths' => $this->paths($this->learningPaths->explore()),
        ]);
    }

    public function learning(Request $request): Response
    {
        return Inertia::render('learning/index', [
            'paths' => $this->paths($this->learningPaths->forUser($request->user())),
        ]);
    }

    public function administrator(): Response
    {
        return Inertia::render('admin/paths', [
            'paths' => $this->paths($this->learningPaths->all()),
        ]);
    }

    /**
     * @param  Collection<int, LearningPath>  $paths
     * @return array<int, mixed>
     */
    private function paths(Collection $paths): array
    {
        return LearningPathResource::collection($paths)->resolve(request());
    }
}
