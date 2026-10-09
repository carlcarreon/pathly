import { Head, router, usePage } from '@inertiajs/react';
import { PanelLeft } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyLearningState } from '@/components/learning/empty-learning-state';
import { LearningPathList } from '@/components/learning/learning-path-list';
import { LearningPathReader } from '@/components/learning/learning-path-reader';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { learning } from '@/routes';
import type { LearningPath } from '@/types/learning';

export default function LearningIndex() {
    const { paths = [] } = usePage().props as unknown as {
        paths?: LearningPath[];
    };
    const [selectedPathId, setSelectedPathId] = useState<number | null>(
        paths[0]?.id ?? null,
    );
    const [isPathListOpen, setIsPathListOpen] = useState(false);
    const selectedPath = useMemo(
        () => paths.find((path) => path.id === selectedPathId) ?? paths[0],
        [paths, selectedPathId],
    );

    const selectPath = (id: number) => {
        setSelectedPathId(id);
        setIsPathListOpen(false);
    };

    const retryGeneration = async (pathId: number) => {
        await fetch(`/paths/${pathId}/generation-retry`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'X-CSRF-TOKEN':
                    document.querySelector<HTMLMetaElement>(
                        'meta[name="csrf-token"]',
                    )?.content ?? '',
            },
        });
        router.reload({ only: ['paths'] });
    };

    return (
        <>
            <Head title="My Learnings" />
            <div className="mx-auto w-full max-w-[1500px] p-4 py-0">
                <header className="mb-5 flex justify-end">
                    <Button
                        variant="outline"
                        className="lg:hidden"
                        onClick={() => setIsPathListOpen(true)}
                    >
                        <PanelLeft />
                        Learning paths
                    </Button>
                </header>

                {selectedPath ? (
                    <div className="grid min-h-[calc(100vh-13rem)] overflow-hidden rounded-xl border border-border/70 bg-card/35 lg:grid-cols-[310px_minmax(0,1fr)]">
                        <aside className="hidden min-h-0 border-r border-border/70 lg:flex lg:flex-col">
                            <LearningPathList
                                paths={paths}
                                selectedPathId={selectedPath.id}
                                onSelect={selectPath}
                            />
                        </aside>
                        <LearningPathReader
                            path={selectedPath}
                            onRetry={retryGeneration}
                        />
                    </div>
                ) : (
                    <EmptyLearningState />
                )}
            </div>

            <Sheet open={isPathListOpen} onOpenChange={setIsPathListOpen}>
                <SheetContent side="left" className="w-[88%] p-0 sm:max-w-sm">
                    <SheetHeader className="border-b border-border/70 pr-12">
                        <SheetTitle>Learning paths</SheetTitle>
                        <SheetDescription>
                            Select a path to continue learning.
                        </SheetDescription>
                    </SheetHeader>
                    <LearningPathList
                        paths={paths}
                        selectedPathId={selectedPath?.id ?? null}
                        onSelect={selectPath}
                    />
                </SheetContent>
            </Sheet>
        </>
    );
}

LearningIndex.layout = {
    breadcrumbs: [{ title: 'My Learnings', href: learning() }],
};
