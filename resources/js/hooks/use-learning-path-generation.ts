import { createContext, useContext } from 'react';
import type {
    CreatePathInput,
    GeneratedPath,
    UploadedResource,
} from '@/types/paths';

export type GenerationPhase =
    | 'prepare'
    | 'roadmap'
    | 'lessons'
    | 'publish'
    | null;

export type GenerationTopicProgress = {
    completed: number;
    failed: number;
    total: number;
};

export type LearningPathGeneration = {
    cancel: () => Promise<void>;
    error: string | null;
    generate: (input: CreatePathInput) => Promise<void>;
    generatedPath: GeneratedPath | null;
    isGenerating: boolean;
    isUploading: boolean;
    message: string;
    phase: GenerationPhase;
    progress: number;
    retry: () => Promise<void>;
    setGeneratedPath: (path: GeneratedPath | null) => void;
    status: string | null;
    topics: GenerationTopicProgress;
    uploadResource: (file: File) => Promise<void>;
    uploadedResources: UploadedResource[];
};

export const LearningPathGenerationContext =
    createContext<LearningPathGeneration | null>(null);

export function useLearningPathGeneration(): LearningPathGeneration {
    const generation = useContext(LearningPathGenerationContext);

    if (!generation) {
        throw new Error(
            'useLearningPathGeneration must be used within LearningPathGenerationProvider.',
        );
    }

    return generation;
}
