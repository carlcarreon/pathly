<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learning_path_milestones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('learning_path_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('position');
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->unique(['learning_path_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_path_milestones');
    }
};
