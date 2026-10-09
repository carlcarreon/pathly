<?php

namespace App\Http\Controllers;

use App\Models\LearningPath;
use App\Models\LearningPathTopic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LearningPathResourceController extends Controller
{
    public function store(Request $request, LearningPath $learningPath)
    {
        abort_unless($learningPath->user_id === $request->user()->id, 403);
        $data = $request->validate(['file' => ['required', 'file', 'max:20480', 'mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,png,jpg,jpeg,webp'], 'topic_id' => ['nullable', 'integer']]);
        $topic = isset($data['topic_id']) ? LearningPathTopic::findOrFail($data['topic_id']) : null;
        abort_if($topic && $topic->milestone->learning_path_id !== $learningPath->id, 422);
        $file = $data['file'];
        $path = $file->storePubliclyAs('learning-paths/'.$learningPath->id.'/resources', Str::uuid().'.'.$file->extension(), 's3');

        return response()->json($learningPath->resources()->create(['learning_path_topic_id' => $topic?->id, 'name' => $file->getClientOriginalName(), 'disk' => 's3', 'path' => $path, 'url' => Storage::disk('s3')->url($path), 'mime_type' => $file->getMimeType(), 'size' => $file->getSize()]), 201);
    }
}
