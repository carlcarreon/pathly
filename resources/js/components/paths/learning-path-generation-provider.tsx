import { router } from '@inertiajs/react';
import {
    type PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { toast } from 'sonner';
import {
    LearningPathGenerationContext,
    type GenerationPhase,
    type GenerationTopicProgress,
} from '@/hooks/use-learning-path-generation';
import { learning } from '@/routes';
import paths from '@/routes/paths';
import type {
    CreatePathInput,
    GeneratedPath,
    UploadedResource,
} from '@/types/paths';

const SESSION_STORAGE_KEY = 'pathly.active-learning-generation';
const GENERATION_TOAST_ID = 'learning-path-generation';
const POLL_INTERVAL = 2_000;
const emptyTopics: GenerationTopicProgress = {
    completed: 0,
    failed: 0,
    total: 0,
};

type GenerationStatus = {
    path: GeneratedPath;
    status: string;
    topics: GenerationTopicProgress;
};

function csrfToken(): string {
    return (
        document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
            ?.content ?? ''
    );
}

function storedPathId(): string | null {
    if (typeof window === 'undefined') return null;

    const pathId = window.sessionStorage.getItem(SESSION_STORAGE_KEY);

    return pathId && pathId.length > 0 ? pathId : null;
}

function phaseForStatus(status: string | null): GenerationPhase {
    switch (status) {
        case 'generating_roadmap':
            return 'roadmap';
        case 'generating_lessons':
            return 'lessons';
        case 'completed':
            return 'publish';
        case 'queued':
        default:
            return 'prepare';
    }
}

function detailsForStatus(
    status: string | null,
    topics: GenerationTopicProgress,
): { message: string; progress: number } {
    switch (status) {
        case 'generating_roadmap':
            return { message: 'Designing your roadmap…', progress: 25 };
        case 'generating_lessons': {
            const lessonProgress =
                topics.total === 0
                    ? 35
                    : Math.round(35 + (topics.completed / topics.total) * 60);

            return {
                message:
                    topics.total === 0
                        ? 'Preparing lesson content…'
                        : `Generating lessons: ${topics.completed} of ${topics.total}`,
                progress: Math.max(35, lessonProgress),
            };
        }
        case 'completed':
            return { message: 'Your learning path is ready.', progress: 100 };
        case 'failed':
            return {
                message: 'Lesson generation needs your attention.',
                progress: 0,
            };
        case 'queued':
        default:
            return { message: 'Preparing your request…', progress: 10 };
    }
}

export function LearningPathGenerationProvider({
    children,
}: PropsWithChildren) {
    const [activePathId, setActivePathId] = useState<string | null>(
        storedPathId,
    );
    const [generatedPath, setGeneratedPath] = useState<GeneratedPath | null>(
        null,
    );
    const [uploadedResources, setUploadedResources] = useState<
        UploadedResource[]
    >([]);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<string | null>(
        activePathId ? 'queued' : null,
    );
    const [topics, setTopics] = useState<GenerationTopicProgress>(emptyTopics);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const activePathIdRef = useRef<string | null>(activePathId);
    const isSubmittingRef = useRef(false);

    const isGenerating =
        isSubmitting ||
        (activePathId !== null &&
            status !== 'completed' &&
            status !== 'failed' &&
            status !== 'cancelled');
    const { message, progress } = detailsForStatus(status, topics);
    const phase = phaseForStatus(status);

    const clearActiveTracking = useCallback(() => {
        activePathIdRef.current = null;
        setActivePathId(null);
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }, []);

    const trackPath = useCallback((pathId: string, nextStatus = 'queued') => {
        activePathIdRef.current = pathId;
        setActivePathId(pathId);
        setStatus(nextStatus);
        setError(null);
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, String(pathId));
    }, []);

    useEffect(() => {
        if (!activePathId) return;

        let cancelled = false;
        let timer: number | undefined;

        const poll = async () => {
            try {
                const response = await fetch(
                    paths.generationStatus.url(activePathId),
                    {
                        credentials: 'same-origin',
                        headers: { Accept: 'application/json' },
                    },
                );

                if ([401, 403, 404].includes(response.status)) {
                    if (!cancelled) {
                        clearActiveTracking();
                        setStatus(null);
                        setError(null);
                        toast.dismiss(GENERATION_TOAST_ID);
                    }

                    return;
                }

                if (!response.ok) {
                    throw new Error('Unable to check generation progress.');
                }

                const nextStatus = (await response.json()) as GenerationStatus;

                if (cancelled) return;

                setGeneratedPath(nextStatus.path);
                setStatus(nextStatus.status);
                setTopics(nextStatus.topics);
                setError(
                    nextStatus.status === 'failed'
                        ? 'Lesson generation failed. Retry the incomplete lessons to continue.'
                        : null,
                );

                if (
                    nextStatus.status === 'completed' ||
                    nextStatus.status === 'failed' ||
                    nextStatus.status === 'cancelled'
                ) {
                    clearActiveTracking();
                    return;
                }
            } catch {
                if (cancelled) return;

                setError('Unable to update generation progress. Retrying…');
            }

            if (!cancelled) {
                timer = window.setTimeout(poll, POLL_INTERVAL);
            }
        };

        void poll();

        return () => {
            cancelled = true;
            if (timer) window.clearTimeout(timer);
        };
    }, [activePathId, clearActiveTracking]);

    useEffect(() => {
        if (!status) return;

        if (status === 'completed') {
            toast.success('Your learning path is ready.', {
                id: GENERATION_TOAST_ID,
                position: 'top-center',
                description: 'Open My Learnings to read your new lessons.',
                duration: 8_000,
                action: {
                    label: 'View My Learnings',
                    onClick: () => router.visit(learning.url()),
                },
            });
            return;
        }

        if (status === 'failed') {
            toast.error('Lesson generation failed.', {
                id: GENERATION_TOAST_ID,
                position: 'top-center',
                description:
                    'Open Create Path to retry the lessons that did not finish.',
                duration: Number.POSITIVE_INFINITY,
                action: {
                    label: 'Open Create Path',
                    onClick: () => router.visit(paths.create.url()),
                },
            });
            return;
        }

        if (status === 'cancelled') {
            toast.info('Generation canceled.', {
                id: GENERATION_TOAST_ID,
                position: 'top-center',
                description:
                    'No further AI requests will be made for this path.',
                duration: 5_000,
            });
            return;
        }

        const title =
            status === 'generating_lessons'
                ? 'Generating lesson content'
                : status === 'generating_roadmap'
                  ? 'Generating your learning path'
                  : 'Preparing your learning path';

        toast.loading(title, {
            id: GENERATION_TOAST_ID,
            position: 'top-center',
            description: message,
            duration: Number.POSITIVE_INFINITY,
        });
    }, [message, status]);

    const generate = useCallback(
        async (input: CreatePathInput) => {
            if (activePathIdRef.current || isSubmittingRef.current) return;

            isSubmittingRef.current = true;
            setIsSubmitting(true);
            setError(null);
            setGeneratedPath(null);
            setUploadedResources([]);
            setTopics(emptyTopics);
            setStatus('queued');

            try {
                const response = await fetch(paths.generate.url(), {
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

                if (!response.ok) {
                    throw new Error('Unable to queue generation.');
                }

                const { path_id: pathId } = (await response.json()) as {
                    path_id: string;
                };

                trackPath(pathId);
            } catch (caughtError) {
                setStatus(null);
                toast.dismiss(GENERATION_TOAST_ID);
                setError(
                    caughtError instanceof Error
                        ? caughtError.message
                        : 'Generation failed.',
                );
            } finally {
                isSubmittingRef.current = false;
                setIsSubmitting(false);
            }
        },
        [trackPath],
    );

    const retry = useCallback(async () => {
        const pathId = generatedPath?.id;
        if (!pathId || activePathIdRef.current || isSubmittingRef.current)
            return;

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setError(null);
        setStatus('generating_lessons');

        try {
            const response = await fetch(paths.generationRetry.url(pathId), {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken(),
                },
            });

            if (!response.ok) {
                throw new Error('Unable to retry lesson generation.');
            }

            trackPath(pathId, 'generating_lessons');
        } catch (caughtError) {
            setStatus('failed');
            setError(
                caughtError instanceof Error
                    ? caughtError.message
                    : 'Unable to retry lesson generation.',
            );
        } finally {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
        }
    }, [generatedPath?.id, trackPath]);

    const cancel = useCallback(async () => {
        const pathId = activePathIdRef.current;
        if (!pathId || isSubmittingRef.current) return;

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(paths.generationCancel.url(pathId), {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken(),
                },
            });

            if (!response.ok) {
                throw new Error('Unable to cancel generation.');
            }

            setGeneratedPath((path) =>
                path ? { ...path, generation_status: 'cancelled' } : path,
            );
            setStatus('cancelled');
            clearActiveTracking();
        } catch (caughtError) {
            setError(
                caughtError instanceof Error
                    ? caughtError.message
                    : 'Unable to cancel generation.',
            );
        } finally {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
        }
    }, [clearActiveTracking]);

    const uploadResource = useCallback(
        async (file: File) => {
            if (!generatedPath) return;

            setIsUploading(true);

            try {
                const formData = new FormData();
                formData.append('file', file);
                const response = await fetch(
                    paths.resources.store.url(generatedPath.id),
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
        },
        [generatedPath],
    );

    const value = useMemo(
        () => ({
            cancel,
            error,
            generate,
            generatedPath,
            isGenerating,
            isUploading,
            message,
            phase,
            progress,
            retry,
            setGeneratedPath,
            status,
            topics,
            uploadResource,
            uploadedResources,
        }),
        [
            cancel,
            error,
            generate,
            generatedPath,
            isGenerating,
            isUploading,
            message,
            phase,
            progress,
            retry,
            status,
            topics,
            uploadResource,
            uploadedResources,
        ],
    );

    return (
        <LearningPathGenerationContext.Provider value={value}>
            {children}
        </LearningPathGenerationContext.Provider>
    );
}
