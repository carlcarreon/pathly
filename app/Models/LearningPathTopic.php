<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['position', 'title', 'description', 'content', 'content_type', 'lesson_status'])]
class LearningPathTopic extends Model
{
    public function milestone(): BelongsTo
    {
        return $this->belongsTo(LearningPathMilestone::class, 'learning_path_milestone_id');
    }

    public function resources(): HasMany
    {
        return $this->hasMany(LearningPathResource::class);
    }
}
