<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateLearningPathRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'topic' => ['required', 'string', 'max:160'],
            'level' => ['required', 'in:beginner,intermediate,advanced'],
            'duration' => ['required', 'integer', 'in:4,8,12'],
            'preferences' => ['required', 'array'],
            'preferences.practical' => ['required', 'boolean'],
            'preferences.resources' => ['required', 'boolean'],
            'preferences.exercises' => ['required', 'boolean'],
        ];
    }
}
