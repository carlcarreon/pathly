<?php

use App\Http\Controllers\LearningPathBrowseController;
use App\Http\Controllers\LearningPathGenerationController;
use App\Http\Controllers\LearningPathResourceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AdminUserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::inertia('paths/create', 'paths/create/index')->name('paths.create');
    Route::inertia('paths/create/manual-create', 'paths/create/index')->name('paths.create.manual');
    Route::inertia('paths/create/generate-with-ai', 'paths/create/index')->name('paths.create.ai');
    Route::get('learning', [LearningPathBrowseController::class, 'learning'])->name('learning');
    Route::get('explore', [LearningPathBrowseController::class, 'explore'])->name('explore');
    Route::get('admin/users', AdminUserController::class)->name('admin.users');
    Route::get('admin/paths', [LearningPathBrowseController::class, 'administrator'])->name('admin.paths');
    Route::post('paths/generate', [LearningPathGenerationController::class, 'store'])->name('paths.generate');
    Route::get('paths/{learningPath}/generation-status', [LearningPathGenerationController::class, 'status'])->name('paths.generation-status');
    Route::post('paths/{learningPath}/generation-retry', [LearningPathGenerationController::class, 'retry'])->name('paths.generation-retry');
    Route::post('paths/{learningPath}/generation-cancel', [LearningPathGenerationController::class, 'cancel'])->name('paths.generation-cancel');
    Route::post('paths/{learningPath}/resources', [LearningPathResourceController::class, 'store'])->name('paths.resources.store');
});

require __DIR__.'/settings.php';
