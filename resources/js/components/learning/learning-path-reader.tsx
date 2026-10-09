import {
    CalendarDays,
    Check,
    ChevronDown,
    ChevronUp,
    FileText,
    Layers3,
    ListTree,
    Paperclip,
    Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Badge } from '@/components/ui/badge';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type {
    LearningMilestone,
    LearningPath,
    LearningResource,
} from '@/types/learning';
import { topicCount } from './utils';

export function LearningPathReader({
    path,
    onRetry,
}: {
    path: LearningPath;
    onRetry: (pathId: number) => void;
}) {
    const [openMilestone, setOpenMilestone] = useState(
        path.milestones[0]?.id ?? null,
    );

    return (
        <main className="flex min-h-0 min-w-0 flex-col">
            <header className="flex h-16 shrink-0 items-center border-b border-border/70 px-4 md:px-6">
                <Breadcrumb>
                    <BreadcrumbList className="min-w-0 flex-nowrap">
                        <BreadcrumbItem className="min-w-0 truncate">
                            <span className="truncate text-muted-foreground">
                                {path.title}
                            </span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Summary</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
                {path.generation_status !== 'completed' && (
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-emerald-400/25 bg-emerald-400/5 p-4 text-sm">
                        <span>
                            {path.generation_status === 'failed'
                                ? 'Lesson generation failed. Your path remains private.'
                                : 'Your lessons are being prepared. They will appear here as they complete.'}
                        </span>
                        {path.generation_status === 'failed' && (
                            <Button size="sm" onClick={() => onRetry(path.id)}>
                                Retry lessons
                            </Button>
                        )}
                    </div>
                )}
                <Card className="border-border/70 bg-card/60 shadow-none">
                    <CardContent className="p-4 md:p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 text-emerald-300">
                                    <Sparkles size={16} />
                                    <span className="text-xs font-semibold tracking-widest uppercase">
                                        Learning path
                                    </span>
                                </div>
                                <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
                                    {path.title}
                                </h2>
                                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                                    {path.description}
                                </p>
                            </div>
                            <Badge className="h-fit w-fit bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/10">
                                {path.level}
                            </Badge>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <Metadata icon={CalendarDays}>
                                {path.duration_weeks} weeks
                            </Metadata>
                            <Metadata icon={ListTree}>
                                {path.milestones.length} weeks
                            </Metadata>
                            <Metadata icon={Layers3}>
                                {topicCount(path)} topics
                            </Metadata>
                        </div>
                        {path.resources.length > 0 && (
                            <ResourceLinks
                                className="mt-5 border-t border-border/70 pt-4"
                                resources={path.resources}
                                label="Path resources"
                            />
                        )}
                    </CardContent>
                </Card>

                <div className="mt-4 space-y-2">
                    {path.milestones.map((milestone) => (
                        <MilestoneReader
                            key={milestone.id}
                            milestone={milestone}
                            open={openMilestone === milestone.id}
                            onOpenChange={(open) =>
                                setOpenMilestone(open ? milestone.id : null)
                            }
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}

function MilestoneReader({
    milestone,
    open,
    onOpenChange,
}: {
    milestone: LearningMilestone;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <Card className="overflow-hidden border-border/70 bg-card/55 py-0 shadow-none">
            <Collapsible open={open} onOpenChange={onOpenChange}>
                <CollapsibleTrigger asChild>
                    <button
                        type="button"
                        className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-muted/30"
                    >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-sm font-bold text-emerald-950">
                            {milestone.position}
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-xs text-muted-foreground">
                                Week {milestone.position}
                            </span>
                            <span className="block truncate font-semibold">
                                {milestone.title}
                            </span>
                        </span>
                        <Badge
                            variant="secondary"
                            className="hidden sm:inline-flex"
                        >
                            {milestone.topics.length} topics
                        </Badge>
                        {open ? (
                            <ChevronUp className="size-4 text-emerald-300" />
                        ) : (
                            <ChevronDown className="size-4 text-emerald-300" />
                        )}
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="border-t border-border/70 p-4">
                        {milestone.description && (
                            <p className="mb-4 text-sm leading-6 text-muted-foreground">
                                {milestone.description}
                            </p>
                        )}
                        <div className="space-y-3">
                            {milestone.topics.map((topic) => (
                                <TopicLesson key={topic.id} topic={topic} />
                            ))}
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}

function TopicLesson({
    topic,
}: {
    topic: LearningMilestone['topics'][number];
}) {
    const [open, setOpen] = useState(false);
    const ready = topic.lesson_status === 'completed' && topic.content;

    return (
        <article className="rounded-lg border border-border/70 bg-background/25 p-4">
            <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-emerald-300/50 text-emerald-300">
                    <Check size={13} />
                </span>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-medium">{topic.title}</h4>
                        <Badge
                            variant="outline"
                            className="border-emerald-400/30 text-emerald-300"
                        >
                            {topic.content_type}
                        </Badge>
                        {topic.lesson_status !== 'completed' && (
                            <Badge variant="secondary">
                                {topic.lesson_status === 'failed'
                                    ? 'Lesson failed'
                                    : 'Preparing lesson'}
                            </Badge>
                        )}
                    </div>
                    {topic.description && (
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {topic.description}
                        </p>
                    )}
                    {ready && (
                        <Button
                            variant="link"
                            size="sm"
                            className="mt-2 h-auto px-0 text-emerald-300"
                            onClick={() => setOpen((value) => !value)}
                        >
                            {open ? 'Hide lesson' : 'Read lesson'}
                        </Button>
                    )}
                    {open && ready && (
                        <div className="prose prose-invert prose-emerald mt-4 max-w-none text-sm">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {topic.content}
                            </ReactMarkdown>
                        </div>
                    )}
                    {topic.resources.length > 0 && (
                        <ResourceLinks
                            className="mt-3"
                            resources={topic.resources}
                            label="Resources"
                        />
                    )}
                </div>
            </div>
        </article>
    );
}

function ResourceLinks({
    resources,
    label,
    className,
}: {
    resources: LearningResource[];
    label: string;
    className?: string;
}) {
    return (
        <div className={className}>
            <p className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Paperclip size={14} />
                {label}
            </p>
            <div className="flex flex-wrap gap-2">
                {resources.map((resource) => (
                    <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-md border border-border/70 px-2.5 py-1.5 text-xs text-emerald-300 transition hover:border-emerald-300/60 hover:bg-emerald-400/10"
                    >
                        <FileText size={14} />
                        {resource.name}
                    </a>
                ))}
            </div>
        </div>
    );
}

function Metadata({
    icon: Icon,
    children,
}: {
    icon: typeof CalendarDays;
    children: React.ReactNode;
}) {
    return (
        <Badge variant="secondary" className="gap-1.5">
            <Icon size={14} />
            {children}
        </Badge>
    );
}
