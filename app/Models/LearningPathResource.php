<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $learning_path_id
 * @property int|null $learning_path_topic_id
 * @property string $name
 * @property string $disk
 * @property string $path
 * @property string $url
 * @property string $mime_type
 * @property int $size
 * @property-read LearningPath $learningPath
 * @property-read LearningPathTopic|null $topic
 */
#[Fillable(['learning_path_id', 'learning_path_topic_id', 'name', 'disk', 'path', 'url', 'mime_type', 'size'])]
class LearningPathResource extends Model
{
    use HasUuids;
    /** @return BelongsTo<LearningPath, $this> */
    public function learningPath(): BelongsTo
    {
        return $this->belongsTo(LearningPath::class);
    }

    /** @return BelongsTo<LearningPathTopic, $this> */
    public function topic(): BelongsTo
    {
        return $this->belongsTo(LearningPathTopic::class, 'learning_path_topic_id');
    }
}
