<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'title', 'description', 'category', 'level', 'duration_weeks', 'generation_source', 'generation_status', 'generation_batch_id', 'is_public', 'preferences', 'metadata'])]
class LearningPath extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return ['is_public' => 'boolean', 'preferences' => 'array', 'metadata' => 'array'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(LearningPathMilestone::class)->orderBy('position');
    }

    public function resources(): HasMany
    {
        return $this->hasMany(LearningPathResource::class);
    }
}
