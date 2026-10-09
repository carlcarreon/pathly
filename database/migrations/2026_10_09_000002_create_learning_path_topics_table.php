<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learning_path_topics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('learning_path_milestone_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('position');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('content_type')->default('reading');
            $table->timestamps();
            $table->unique(['learning_path_milestone_id', 'position'], 'learning_path_topic_position_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_path_topics');
    }
};
