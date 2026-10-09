<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $learning_path_id
 * @property int $position
 * @property string $title
 * @property string|null $description
 * @property-read LearningPath $learningPath
 * @property-read Collection<int, LearningPathTopic> $topics
 */
#[Fillable(['position', 'title', 'description'])]
class LearningPathMilestone extends Model
{
    use HasUuids;
    /** @return BelongsTo<LearningPath, $this> */
    public function learningPath(): BelongsTo
    {
        return $this->belongsTo(LearningPath::class);
    }

    /** @return HasMany<LearningPathTopic, $this> */
    public function topics(): HasMany
    {
        return $this->hasMany(LearningPathTopic::class)->orderBy('position');
    }
}
