import { Head, router, usePage } from '@inertiajs/react';
import { PenLine, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { AiGenerate, ManualCreate } from '@/components/paths';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import paths from '@/routes/paths';

export default function CreatePathIndex() {
    const { url } = usePage();
    const initialMode = url.includes('/paths/create/manual-create')
        ? 'manual'
        : url.includes('/paths/create/generate-with-ai')
            ? 'ai'
            : null;
    const [mode, setMode] = useState<'manual' | 'ai' | null>(initialMode);

    const selectMode = (nextMode: 'manual' | 'ai') => {
        setMode(nextMode);
        router.visit(nextMode === 'manual' ? '/paths/create/manual-create' : '/paths/create/generate-with-ai', {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const chooseAnotherMethod = () => {
        setMode(null);
        router.visit(paths.create().url, {
            preserveState: true,
            preserveScroll: true,
        });
    };
    return (
        <>
            <Head title="Create Path" />
            <div className="mx-auto w-full max-w-7xl p-4 md:p-7">
                {!mode && (
                    <div className="min-h-[calc(100vh-12rem)] w-full">
                        <div className="w-full">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                                Create a learning path
                            </h1>
                            <p className="mt-2 text-muted-foreground">
                                Choose how you want to build your roadmap.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Card className="min-h-[calc(100vh-14rem)] min-w-[240px] flex-1 border-border/70 bg-card/70 shadow-none">
                                <CardContent className="flex h-full flex-col p-6">
                                    <PenLine className="size-8 text-emerald-300" />
                                    <h2 className="mt-4 text-xl font-semibold">Manual Create</h2>
                                    <p className="mt-2 min-h-12 text-sm text-muted-foreground">
                                        Build your own milestones and topics from scratch.
                                    </p>
                                    <ol className="mt-8 space-y-4 text-sm text-muted-foreground">
                                        <li className="flex gap-3">
                                            <span className="text-emerald-300">01</span>
                                            <span><strong className="font-medium text-foreground">Add a title</strong><br />Name your learning path and describe what you want to achieve.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-emerald-300">02</span>
                                            <span><strong className="font-medium text-foreground">Create your first milestone</strong><br />Divide your learning goal into a clear stage or area of focus.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-emerald-300">03</span>
                                            <span><strong className="font-medium text-foreground">Add topics</strong><br />Add the topics you want to learn inside that milestone.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-emerald-300">04</span>
                                            <span><strong className="font-medium text-foreground">Repeat the process</strong><br />Create more milestones and add topics until your roadmap is complete.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-emerald-300">05</span>
                                            <span><strong className="font-medium text-foreground">Review and publish</strong><br />Review your path and publish it when you are satisfied with the roadmap.</span>
                                        </li>
                                    </ol>
                                    <Button className="mt-auto h-14 w-full text-base" variant="outline" onClick={() => selectMode('manual')}>
                                        Create manually
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card className="min-h-[calc(100vh-14rem)] min-w-[240px] flex-1 border-emerald-300/40 bg-card/70 shadow-none">
                                <CardContent className="flex h-full flex-col p-6">
                                    <Sparkles className="size-8 text-emerald-300" />
                                    <h2 className="mt-4 text-xl font-semibold">AI Generated</h2>
                                    <p className="mt-2 min-h-12 text-sm text-muted-foreground">
                                        Let AI create a personalized roadmap for you.
                                    </p>
                                    <ol className="mt-8 space-y-3 text-sm text-muted-foreground">
                                        <li><span className="mr-3 text-emerald-300">01</span>Tell us what you want to learn</li>
                                        <li><span className="mr-3 text-emerald-300">02</span>Customize your level and duration</li>
                                        <li><span className="mr-3 text-emerald-300">03</span>Generate and review your roadmap</li>
                                    </ol>
                                    <Button className="mt-auto h-14 w-full text-base bg-emerald-300 text-emerald-950 hover:bg-emerald-200" onClick={() => selectMode('ai')}>
                                        Generate with AI
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                        </div>
                    </div>
                )}
                {mode === 'manual' && (
                    <ManualCreate onBack={chooseAnotherMethod} />
                )}
                {mode === 'ai' && <AiGenerate onBack={chooseAnotherMethod} />}
            </div>
        </>
    );
}

CreatePathIndex.layout = {
    breadcrumbs: [{ title: 'Create Path', href: paths.create() }],
};
