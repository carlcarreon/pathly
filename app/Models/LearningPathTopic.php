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
 * @property int $learning_path_milestone_id
 * @property int $position
 * @property string $title
 * @property string|null $description
 * @property string|null $content
 * @property string $content_type
 * @property string $lesson_status
 * @property-read LearningPathMilestone $milestone
 * @property-read Collection<int, LearningPathResource> $resources
 */
#[Fillable(['position', 'title', 'description', 'content', 'content_type', 'lesson_status'])]
class LearningPathTopic extends Model
{
    use HasUuids;
    /** @return BelongsTo<LearningPathMilestone, $this> */
    public function milestone(): BelongsTo
    {
        return $this->belongsTo(LearningPathMilestone::class, 'learning_path_milestone_id');
    }

    /** @return HasMany<LearningPathResource, $this> */
    public function resources(): HasMany
    {
        return $this->hasMany(LearningPathResource::class);
    }
}
