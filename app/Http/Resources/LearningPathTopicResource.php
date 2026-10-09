<?php

namespace App\Http\Resources;

use App\Models\LearningPathTopic;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin LearningPathTopic */
class LearningPathTopicResource extends JsonResource
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
            'content_type' => $this->content_type,
            'content' => $this->content,
            'lesson_status' => $this->lesson_status,
            'resources' => LearningPathFileResource::collection(
                $this->relationLoaded('resources') ? $this->resources : collect(),
            )->resolve($request),
        ];
    }
}
