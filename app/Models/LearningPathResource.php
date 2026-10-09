<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['learning_path_id', 'learning_path_topic_id', 'name', 'disk', 'path', 'url', 'mime_type', 'size'])]
class LearningPathResource extends Model
{
    public function learningPath(): BelongsTo
    {
        return $this->belongsTo(LearningPath::class);
    }

    public function topic(): BelongsTo
    {
        return $this->belongsTo(LearningPathTopic::class, 'learning_path_topic_id');
    }
}
