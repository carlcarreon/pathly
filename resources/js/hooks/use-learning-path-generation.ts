import { useEffect, useRef, useState } from 'react';
import type {
    CreatePathInput,
    GeneratedPath,
    UploadedResource,
} from '@/types/paths';

type GenerationStatus = {
    path: GeneratedPath;
    status: string;
    topics: { total: number; completed: number; failed: number };
    batch: { progress: number } | null;
};

function csrfToken() {
    return (
        document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
            ?.content ?? ''
    );
}

function wait(milliseconds: number) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export function useLearningPathGeneration() {
    const [generatedPath, setGeneratedPath] = useState<GeneratedPath | null>(
        null,
    );
    const [uploadedResources, setUploadedResources] = useState<
        UploadedResource[]
    >([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const activePathId = useRef<number | null>(null);
    const activeBatchId = useRef<string | null>(null);
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const poll = async (pathId: number) => {
        while (true) {
            const response = await fetch(`/paths/${pathId}/generation-status`, {
                credentials: 'same-origin',
                headers: { Accept: 'application/json' },
            });
            if (!response.ok)
                throw new Error('Unable to check generation progress.');

            const status = (await response.json()) as GenerationStatus;
            if (!isMounted.current) return;

            setGeneratedPath(status.path);
            const { completed, total } = status.topics;

            if (status.status === 'completed') {
                setMessage('Your learning path is ready.');
                setProgress(100);
                return;
            }
            if (status.status === 'failed') {
                setError(
                    'Lesson generation failed. Retry the incomplete lessons to continue.',
                );
                return;
            }
            if (total === 0) {
                setMessage('Designing your roadmap…');
                setProgress(20);
            } else {
                setMessage(`Writing lessons: ${completed} of ${total}`);
                setProgress(
                    Math.max(30, Math.round(30 + (completed / total) * 65)),
                );
            }
            await wait(2000);
        }
    };

    const generate = async (input: CreatePathInput) => {
        setIsGenerating(true);
        setError(null);
        setGeneratedPath(null);
        setUploadedResources([]);
        setMessage('Queueing your learning path…');
        setProgress(5);

        try {
            const response = await fetch('/paths/generate', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken(),
                },
                body: JSON.stringify({
                    ...input,
                    duration: Number(input.duration),
                }),
            });
            if (!response.ok) throw new Error('Unable to queue generation.');

            const { path_id: pathId, batch_id: batchId } =
                (await response.json()) as {
                    path_id: number;
                    batch_id: string;
                };
            activePathId.current = pathId;
            activeBatchId.current = batchId;
            await poll(pathId);
        } catch (caughtError) {
            setError(
                caughtError instanceof Error
                    ? caughtError.message
                    : 'Generation failed.',
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const retry = async () => {
        if (!activePathId.current || isGenerating) return;

        setIsGenerating(true);
        setError(null);
        setMessage('Queueing incomplete lessons…');
        setProgress(30);

        try {
            const response = await fetch(
                `/paths/${activePathId.current}/generation-retry`,
                {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': csrfToken(),
                    },
                },
            );
            if (!response.ok)
                throw new Error('Unable to retry lesson generation.');

            const { batch_id: batchId } = (await response.json()) as {
                batch_id: string;
            };
            activeBatchId.current = batchId;
            await poll(activePathId.current);
        } catch (caughtError) {
            setError(
                caughtError instanceof Error
                    ? caughtError.message
                    : 'Unable to retry lesson generation.',
            );
        } finally {
            if (isMounted.current) setIsGenerating(false);
        }
    };

    const uploadResource = async (file: File) => {
        if (!generatedPath) return;
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch(
                `/paths/${generatedPath.id}/resources`,
                {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': csrfToken(),
                    },
                    body: formData,
                },
            );
            if (!response.ok) throw new Error('Upload failed.');
            const resource = (await response.json()) as UploadedResource;
            setUploadedResources((items) => [...items, resource]);
        } catch (caughtError) {
            setError(
                caughtError instanceof Error
                    ? caughtError.message
                    : 'Upload failed.',
            );
        } finally {
            setIsUploading(false);
        }
    };

    return {
        error,
        generate,
        generatedPath,
        isGenerating,
        isUploading,
        message,
        progress,
        retry,
        setGeneratedPath,
        uploadResource,
        uploadedResources,
    };
}
