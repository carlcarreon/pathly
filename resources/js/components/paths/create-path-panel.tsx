import {
    ArrowLeft,
    BarChart3,
    CalendarDays,
    Check,
    ChevronDown,
    ChevronUp,
    Edit3,
    LoaderCircle,
    NotebookTabs,
    Save,
    Sparkles,
    Target,
    Upload,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type {
    GenerationPhase,
    GenerationTopicProgress,
} from '@/hooks/use-learning-path-generation';
import { cn } from '@/lib/utils';
import type {
    GeneratedPath,
    GeneratedTopic,
    UploadedResource,
} from '@/types/paths';

export function CreatePathPanel({
    status,
    error,
    generatedPath,
    isGenerating,
    isUploading,
    message,
    phase,
    progress,
    onEdit,
    onCancel,
    onGenerate,
    onRetry,
    onUpload,
    topics,
    uploadedResources,
}: {
    status: string | null;
    error: string | null;
    generatedPath: GeneratedPath | null;
    isGenerating: boolean;
    isUploading: boolean;
    message: string;
    phase: GenerationPhase;
    progress: number;
    onEdit: () => void;
    onCancel: () => void;
    onGenerate: () => void;
    onRetry: () => void;
    onUpload: (file: File) => void;
    topics: GenerationTopicProgress;
    uploadedResources: UploadedResource[];
}) {
    const [openWeek, setOpenWeek] = useState(0);

    if (isGenerating)
        return (
            <GenerationProgress
                message={message}
                onCancel={onCancel}
                phase={phase}
                progress={progress}
                topics={topics}
            />
        );

    if (status === 'cancelled') {
        return (
            <PanelState
                title="Generation canceled"
                description="This learning path was kept private and no further AI requests will be made."
                action="Create another path"
                onAction={onEdit}
            />
        );
    }

    if (generatedPath?.generation_status === 'failed') {
        return (
            <PanelState
                title="Lesson generation failed"
                description={
                    error ??
                    'Some lessons could not be prepared. Retry the incomplete lessons to continue.'
                }
                action="Retry lessons"
                onAction={onRetry}
            />
        );
    }

    if (generatedPath) {
        return (
            <section className="h-full">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onEdit}
                            aria-label="Back to form"
                        >
                            <ArrowLeft />
                        </Button>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            AI-Generated Learning Path
                        </h1>
                        <Badge className="bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/10">
                            Preview
                        </Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onEdit}>
                            <Edit3 />
                            Edit
                        </Button>
                        <Button
                            className="bg-emerald-300 text-emerald-950 hover:bg-emerald-200"
                            disabled
                        >
                            <Save />
                            Saved
                        </Button>
                    </div>
                </div>
                <Card className="mb-3 border-border/70 bg-card/70 shadow-none">
                    <CardContent className="flex flex-col gap-5 px-4 py-2 md:flex-row">
                        <div className="flex size-24 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-300/30 via-emerald-900/50 to-background text-emerald-200">
                            <CompassArt />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs tracking-wider text-muted-foreground uppercase">
                                {generatedPath.duration_weeks}-week learning
                                path
                            </p>
                            <h2 className="mt-1 text-2xl font-bold">
                                {generatedPath.title}
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {generatedPath.description}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <Badge variant="secondary">
                                    <BarChart3 />
                                    {generatedPath.level}
                                </Badge>
                                <Badge variant="secondary">
                                    <CalendarDays />
                                    {generatedPath.duration_weeks} weeks
                                </Badge>
                                <Badge variant="secondary">
                                    <Target />
                                    {generatedPath.milestones.length} milestones
                                </Badge>
                                <Badge variant="secondary">
                                    <NotebookTabs />
                                    {generatedPath.milestones.reduce(
                                        (total, milestone) =>
                                            total + milestone.topics.length,
                                        0,
                                    )}{' '}
                                    topics
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <ResourceUploader
                    isUploading={isUploading}
                    onUpload={onUpload}
                    resources={uploadedResources}
                />
                <div className="space-y-2">
                    {generatedPath.milestones.map((milestone, index) => (
                        <CollapsibleWeek
                            key={milestone.id}
                            index={index}
                            title={milestone.title}
                            description={milestone.description ?? ''}
                            topics={milestone.topics}
                            open={openWeek === index}
                            onOpenChange={(open) =>
                                setOpenWeek(open ? index : -1)
                            }
                        />
                    ))}
                </div>
            </section>
        );
    }

    if (error)
        return (
            <PanelState
                title="Generation failed"
                description={error}
                action="Try again"
                onAction={onGenerate}
            />
        );
    return (
        <PanelState
            title="Your learning path will appear here"
            description="Complete the details on the left and generate a personalized roadmap to preview it here."
        />
    );
}

function ResourceUploader({
    isUploading,
    onUpload,
    resources,
}: {
    isUploading: boolean;
    onUpload: (file: File) => void;
    resources: UploadedResource[];
}) {
    return (
        <div className="mb-3 flex flex-wrap items-center gap-3 rounded-xl border border-border/70 bg-card/50 px-4 py-3">
            <input
                id="path-resource"
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) onUpload(file);
                    event.currentTarget.value = '';
                }}
            />
            <Button
                variant="outline"
                size="sm"
                disabled={isUploading}
                onClick={() =>
                    document.getElementById('path-resource')?.click()
                }
            >
                <Upload />
                {isUploading ? 'Uploading…' : 'Upload resource'}
            </Button>
            {resources.map((resource) => (
                <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-emerald-300 underline-offset-4 hover:underline"
                >
                    {resource.name}
                </a>
            ))}
        </div>
    );
}

function PanelState({
    title,
    description,
    action,
    onAction,
}: {
    title: string;
    description: string;
    action?: string;
    onAction?: () => void;
}) {
    return (
        <Card className="h-full min-h-[420px] border-dashed border-border/70 bg-card/30 shadow-none">
            <CardContent className="flex h-full min-h-[420px] flex-col items-center justify-center p-8 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">
                    <Sparkles size={25} />
                </span>
                <h2 className="mt-5 text-xl font-semibold">{title}</h2>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                    {description}
                </p>
                {action && onAction && (
                    <Button className="mt-5" onClick={onAction}>
                        {action}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

function GenerationProgress({
    message,
    onCancel,
    phase,
    progress,
    topics,
}: {
    message: string;
    onCancel: () => void;
    phase: GenerationPhase;
    progress: number;
    topics: GenerationTopicProgress;
}) {
    const steps = [
        { label: 'Prepare your request', phase: 'prepare' },
        { label: 'Generate your roadmap', phase: 'roadmap' },
        { label: 'Generate lesson content', phase: 'lessons' },
        { label: 'Publish your learning path', phase: 'publish' },
    ] as const;
    const activeStep = Math.max(
        steps.findIndex((step) => step.phase === phase),
        0,
    );
    return (
        <Card className="h-full min-h-[420px] border-emerald-400/20 bg-card/50 shadow-none">
            <CardContent className="flex h-full min-h-[420px] flex-col justify-center p-8">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                    <LoaderCircle className="size-7 animate-spin" />
                </span>
                <p className="mt-6 text-xs font-semibold tracking-widest text-emerald-300 uppercase">
                    Generating your path
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                    Your roadmap is taking shape
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{message}</p>
                <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-emerald-300 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="mt-2 text-right text-xs text-emerald-300">
                    {progress}%
                </p>
                <ol className="mt-5 space-y-3">
                    {steps.map((step, index) => {
                        const complete = index < activeStep;
                        const active = index === activeStep;

                        return (
                            <li
                                key={step.phase}
                                className={cn(
                                    'flex items-center gap-3 text-sm transition-colors',
                                    complete || active
                                        ? 'text-foreground'
                                        : 'text-muted-foreground',
                                )}
                            >
                                <span
                                    className={cn(
                                        'flex size-6 items-center justify-center rounded-full border',
                                        complete
                                            ? 'border-emerald-300 bg-emerald-300 text-emerald-950'
                                            : active
                                              ? 'border-emerald-300 text-emerald-300'
                                              : 'border-border text-muted-foreground',
                                    )}
                                >
                                    {complete ? (
                                        <Check size={14} />
                                    ) : active ? (
                                        <LoaderCircle className="size-3.5 animate-spin" />
                                    ) : (
                                        '•'
                                    )}
                                </span>
                                <span>{step.label}</span>
                                {step.phase === 'lessons' &&
                                    topics.total > 0 && (
                                        <span className="text-xs text-muted-foreground">
                                            {topics.completed} of {topics.total}
                                        </span>
                                    )}
                            </li>
                        );
                    })}
                </ol>
                <Button
                    type="button"
                    variant="outline"
                    className="mt-7 w-fit"
                    onClick={onCancel}
                >
                    <X />
                    Cancel generation
                </Button>
            </CardContent>
        </Card>
    );
}

function CollapsibleWeek({
    index,
    title,
    description,
    topics,
    open,
    onOpenChange,
}: {
    index: number;
    title: string;
    description: string;
    topics: GeneratedTopic[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <Card className="overflow-hidden border-border/70 bg-card/60 py-0 shadow-none">
            <Collapsible open={open} onOpenChange={onOpenChange}>
                <CollapsibleTrigger asChild>
                    <button
                        type="button"
                        className="flex w-full items-center gap-4 p-4 text-left transition hover:bg-muted/30"
                    >
                        <span
                            className={cn(
                                'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                                open
                                    ? 'bg-emerald-300 text-emerald-950'
                                    : 'bg-emerald-400/15 text-emerald-300',
                            )}
                        >
                            {index + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-xs text-muted-foreground">
                                Week {index + 1}
                            </span>
                            <span className="block truncate font-semibold">
                                {title}
                            </span>
                        </span>
                        <Badge
                            variant="secondary"
                            className="hidden sm:inline-flex"
                        >
                            {topics.length} topics
                        </Badge>
                        {open ? (
                            <ChevronUp className="size-4 text-emerald-300" />
                        ) : (
                            <ChevronDown className="size-4 text-emerald-300" />
                        )}
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="border-t border-border/60 px-4 pt-3 pb-5 pl-16">
                        <p className="max-w-2xl text-sm text-muted-foreground">
                            {description}
                        </p>
                        {open && (
                            <div className="mt-4 space-y-3 border-l border-emerald-400/30 pl-5 text-sm">
                                {topics.map((topic) => (
                                    <Topic
                                        key={topic.id}
                                        name={topic.title}
                                        type={topic.content_type}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}

function Topic({ name, type }: { name: string; type: string }) {
    return (
        <div className="flex items-center gap-3">
            <span className="-ml-[1.65rem] flex size-5 items-center justify-center rounded-full border border-emerald-300 bg-background">
                <span className="size-1.5 rounded-full bg-emerald-300" />
            </span>
            <NotebookTabs className="size-4 text-muted-foreground" />
            <span className="flex-1 text-muted-foreground">{name}</span>
            <Badge
                variant="outline"
                className="border-emerald-400/20 text-xs text-emerald-300"
            >
                <Check />
                {type}
            </Badge>
        </div>
    );
}

function CompassArt() {
    return (
        <div className="relative size-14 rounded-full border border-emerald-300/40">
            <div className="absolute inset-3 rotate-45 border-2 border-emerald-300" />
            <div className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300" />
        </div>
    );
}
