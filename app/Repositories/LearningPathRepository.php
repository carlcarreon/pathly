<?php

namespace App\Repositories;

use App\Models\LearningPath;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\Relation;

class LearningPathRepository
{
    /**
     * @return Collection<int, LearningPath>
     */
    public function explore(): Collection
    {
        return $this->getPaths(
            LearningPath::query()
                ->where('is_public', true)
                ->where('generation_status', 'completed'),
        );
    }

    /**
     * @return Collection<int, LearningPath>
     */
    public function forUser(User $user): Collection
    {
        return $this->getPaths($user->learningPaths());
    }

    /**
     * @return Collection<int, LearningPath>
     */
    public function all(): Collection
    {
        return $this->getPaths(LearningPath::query());
    }

    /**
     * The complete relation graph required by the learning-path reader.
     *
     * @param  Builder<LearningPath>|Relation<LearningPath, LearningPath>  $query
     * @return Collection<int, LearningPath>
     */
    private function getPaths(Builder|Relation $query): Collection
    {
        return $query
            ->with(['user:id,name', 'resources', 'milestones.topics.resources'])
            ->latest()
            ->get();
    }
}
