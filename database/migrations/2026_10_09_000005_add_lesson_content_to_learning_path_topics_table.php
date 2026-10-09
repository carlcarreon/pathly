<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('learning_path_topics', function (Blueprint $table) {
            $table->longText('content')->nullable()->after('description');
            $table->string('lesson_status')->default('queued')->after('content')->index();
        });
    }

    public function down(): void
    {
        Schema::table('learning_path_topics', function (Blueprint $table) {
            $table->dropColumn(['content', 'lesson_status']);
        });
    }
};
