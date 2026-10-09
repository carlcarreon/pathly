import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { CreatePathForm, CreatePathPanel } from '@/components/paths';
import { useLearningPathGeneration } from '@/hooks/use-learning-path-generation';
import paths from '@/routes/paths';
import type { CreatePathInput } from '@/types/paths';

const initialInput: CreatePathInput = {
    topic: 'Japanese Language',
    level: 'beginner',
    duration: '8',
    preferences: {
        practical: true,
        resources: false,
        exercises: false,
    },
};

export default function CreatePathIndex() {
    const [input, setInput] = useState(initialInput);
    const generation = useLearningPathGeneration();

    return (
        <>
            <Head title="Create Path" />
            <div className="mx-auto w-full max-w-[1500px] p-4 md:p-7">
                <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
                    <CreatePathForm
                        input={input}
                        isGenerating={generation.isGenerating}
                        message={generation.message}
                        onChange={setInput}
                        onGenerate={() => generation.generate(input)}
                    />
                    <CreatePathPanel
                        error={generation.error}
                        generatedPath={generation.generatedPath}
                        isGenerating={generation.isGenerating}
                        isUploading={generation.isUploading}
                        message={generation.message}
                        progress={generation.progress}
                        onEdit={() => generation.setGeneratedPath(null)}
                        onGenerate={() => generation.generate(input)}
                        onRetry={generation.retry}
                        onUpload={generation.uploadResource}
                        uploadedResources={generation.uploadedResources}
                    />
                </div>
            </div>
        </>
    );
}

CreatePathIndex.layout = {
    breadcrumbs: [{ title: 'Create Path', href: paths.create() }],
};
