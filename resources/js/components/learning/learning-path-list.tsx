import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LearningPath } from '@/types/learning';
import { topicCount } from './utils';

export function LearningPathList({
    paths,
    selectedPathId,
    onSelect,
}: {
    paths: LearningPath[];
    selectedPathId: string | null;
    onSelect: (id: string) => void;
}) {
    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="border-b border-border/70 p-4">
                <h2 className="font-semibold">Your paths</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {paths.length} active{' '}
                    {paths.length === 1 ? 'path' : 'paths'}
                </p>
            </div>
            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
                {paths.map((path) => {
                    const selected = path.id === selectedPathId;
                    const totalTopics = path.topics_count || topicCount(path);

                    return (
                        <button
                            type="button"
                            key={path.id}
                            onClick={() => onSelect(path.id)}
                            className={cn(
                                'w-full rounded-lg border p-3 text-left transition focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none',
                                selected
                                    ? 'border-emerald-300/40 bg-emerald-400/10'
                                    : 'border-transparent hover:border-border hover:bg-muted/40',
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <span
                                    className={cn(
                                        'flex size-10 shrink-0 items-center justify-center rounded-lg',
                                        selected
                                            ? 'bg-emerald-300 text-emerald-950'
                                            : 'bg-emerald-400/10 text-emerald-300',
                                    )}
                                >
                                    <BookOpen size={19} />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-semibold">
                                        {path.title}
                                    </span>
                                    <span className="mt-1 block text-xs text-muted-foreground">
                                        {path.category ?? 'General'} ·{' '}
                                        {path.duration_weeks} weeks
                                    </span>
                                    <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-muted">
                                        <span
                                            className={cn(
                                                'block h-full rounded-full',
                                                selected
                                                    ? 'w-1/2 bg-emerald-300'
                                                    : 'w-1/5 bg-emerald-400/50',
                                            )}
                                        />
                                    </span>
                                    <span className="mt-1 block text-xs text-muted-foreground">
                                        {totalTopics} topics
                                    </span>
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
