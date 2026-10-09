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
 * @property int $user_id
 * @property string $title
 * @property string $description
 * @property string|null $category
 * @property string $level
 * @property int $duration_weeks
 * @property string $generation_source
 * @property string $generation_status
 * @property string|null $generation_batch_id
 * @property bool $is_public
 * @property array<string, bool>|null $preferences
 * @property array<string, mixed>|null $metadata
 * @property-read User $user
 * @property-read Collection<int, LearningPathMilestone> $milestones
 * @property-read Collection<int, LearningPathResource> $resources
 */
#[Fillable(['user_id', 'title', 'description', 'category', 'level', 'duration_weeks', 'generation_source', 'generation_status', 'generation_batch_id', 'is_public', 'preferences', 'metadata'])]
class LearningPath extends Model
{
    use HasUuids;
    protected function casts(): array
    {
        return ['is_public' => 'boolean', 'preferences' => 'array', 'metadata' => 'array'];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<LearningPathMilestone, $this> */
    public function milestones(): HasMany
    {
        return $this->hasMany(LearningPathMilestone::class)->orderBy('position');
    }

    /** @return HasMany<LearningPathResource, $this> */
    public function resources(): HasMany
    {
        return $this->hasMany(LearningPathResource::class);
    }
}
