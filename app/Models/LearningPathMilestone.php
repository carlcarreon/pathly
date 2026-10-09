<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['position', 'title', 'description'])]
class LearningPathMilestone extends Model
{
    public function learningPath(): BelongsTo
    {
        return $this->belongsTo(LearningPath::class);
    }

    public function topics(): HasMany
    {
        return $this->hasMany(LearningPathTopic::class)->orderBy('position');
    }
}
