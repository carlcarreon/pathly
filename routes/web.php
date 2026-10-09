<?php

use App\Http\Controllers\LearningPathBrowseController;
use App\Http\Controllers\LearningPathGenerationController;
use App\Http\Controllers\LearningPathResourceController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('paths/create', 'paths/create/index')->name('paths.create');
    Route::get('learning', [LearningPathBrowseController::class, 'learning'])->name('learning');
    Route::get('explore', [LearningPathBrowseController::class, 'explore'])->name('explore');
    Route::inertia('admin/users', 'admin/users')->name('admin.users');
    Route::get('admin/paths', [LearningPathBrowseController::class, 'administrator'])->name('admin.paths');
    Route::post('paths/generate', [LearningPathGenerationController::class, 'store'])->name('paths.generate');
    Route::get('paths/{learningPath}/generation-status', [LearningPathGenerationController::class, 'status'])->name('paths.generation-status');
    Route::post('paths/{learningPath}/generation-retry', [LearningPathGenerationController::class, 'retry'])->name('paths.generation-retry');
    Route::post('paths/{learningPath}/resources', [LearningPathResourceController::class, 'store'])->name('paths.resources.store');
});

require __DIR__.'/settings.php';
