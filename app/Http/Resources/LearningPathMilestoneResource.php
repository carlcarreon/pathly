<?php

namespace App\Http\Resources;

use App\Models\LearningPathMilestone;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin LearningPathMilestone */
class LearningPathMilestoneResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'position' => $this->position,
            'title' => $this->title,
            'description' => $this->description,
            'topics' => LearningPathTopicResource::collection(
                $this->relationLoaded('topics') ? $this->topics : collect(),
            )->resolve($request),
        ];
    }
}
