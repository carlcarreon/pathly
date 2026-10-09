<?php

namespace App\Http\Resources;

use App\Models\LearningPathResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin LearningPathResource */
class LearningPathFileResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'url' => $this->url,
            'mime_type' => $this->mime_type,
        ];
    }
}
