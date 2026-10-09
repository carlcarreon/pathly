<?php

namespace App\Http\Resources;

use App\Models\LearningPath;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin LearningPath */
class LearningPathResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $milestones = $this->relationLoaded('milestones') ? $this->milestones : collect();
        $resources = $this->relationLoaded('resources') ? $this->resources->whereNull('learning_path_topic_id') : collect();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'level' => $this->level,
            'duration_weeks' => $this->duration_weeks,
            'generation_source' => $this->generation_source,
            'generation_status' => $this->generation_status,
            'topics_count' => $milestones->sum(
                fn ($milestone) => $milestone->relationLoaded('topics') ? $milestone->topics->count() : 0,
            ),
            'owner' => $this->relationLoaded('user') ? $this->user?->only(['id', 'name']) : null,
            'resources' => LearningPathFileResource::collection($resources)->resolve($request),
            'milestones' => LearningPathMilestoneResource::collection($milestones)->resolve($request),
        ];
    }
}
