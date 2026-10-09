import { useState } from 'react';
import { CreatePathForm } from './create-path-form';
import { CreatePathPanel } from './create-path-panel';
import { useLearningPathGeneration } from '@/hooks/use-learning-path-generation';
import type { CreatePathInput } from '@/types/paths';
import { Button } from '@/components/ui/button';

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

type AiGenerateProps = {
    onBack: () => void;
};

export function AiGenerate({ onBack }: AiGenerateProps) {
    const [input, setInput] = useState(initialInput);
    const generation = useLearningPathGeneration();

    return (
        <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-2 lg:items-start">
            <div>
                <Button variant="ghost" className="mb-4" onClick={onBack}>
                    ← Choose another method
                </Button>
                <CreatePathForm
                    input={input}
                    isGenerating={generation.isGenerating}
                    message={generation.message}
                    onChange={setInput}
                    onGenerate={() => generation.generate(input)}
                />
            </div>
            <CreatePathPanel
                status={generation.status}
                error={generation.error}
                generatedPath={generation.generatedPath}
                isGenerating={generation.isGenerating}
                isUploading={generation.isUploading}
                message={generation.message}
                phase={generation.phase}
                progress={generation.progress}
                onEdit={() => generation.setGeneratedPath(null)}
                onCancel={generation.cancel}
                onGenerate={() => generation.generate(input)}
                onRetry={generation.retry}
                onUpload={generation.uploadResource}
                topics={generation.topics}
                uploadedResources={generation.uploadedResources}
            />
        </div>
    );
}
