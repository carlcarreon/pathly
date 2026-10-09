import { Head, usePage } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    BriefcaseBusiness,
    Clock3,
    Globe2,
    Heart,
    Layers3,
    Leaf,
    Sparkles,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MetricCard } from '@/components/metric-card';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/empty-state';

type DatabasePath = {
    id: number;
    title: string;
    category: string | null;
    level: string;
    duration_weeks: number;
    topics_count: number;
    generation_source: string | null;
};

type AdminPathDisplay = [
    title: string,
    category: string,
    source: string,
    learners: string,
    tone: string,
];

const fallbackPaths: AdminPathDisplay[] = [
    [
        'Japanese Language for Beginners',
        'Language',
        'AI Generated',
        '24k learners',
        'from-sky-200 to-orange-300',
    ],
    [
        'Learn Laravel',
        'Technology',
        'AI Generated',
        '18k learners',
        'from-red-400 to-red-800',
    ],
    [
        'UI/UX Design Basics',
        'Design',
        'Community',
        '12k learners',
        'from-indigo-500 to-purple-950',
    ],
    [
        'Photography Fundamentals',
        'Lifestyle',
        'AI Generated',
        '11k learners',
        'from-orange-200 to-slate-800',
    ],
    [
        'Data Science Foundations',
        'Technology',
        'Community',
        '12k learners',
        'from-cyan-400 to-blue-950',
    ],
    [
        'Cooking Essentials',
        'Lifestyle',
        'AI Generated',
        '9k learners',
        'from-amber-200 to-red-900',
    ],
    [
        'Personal Finance Basics',
        'Business',
        'AI Generated',
        '8k learners',
        'from-lime-200 to-amber-800',
    ],
    [
        'Public Speaking Foundations',
        'Personal Growth',
        'Community',
        '7k learners',
        'from-slate-500 to-purple-950',
    ],
] as const;
const iconMap = {
    Language: Globe2,
    Technology: Layers3,
    Design: Sparkles,
    Lifestyle: Leaf,
    Business: BriefcaseBusiness,
    'Personal Growth': BarChart3,
};

export default function AdminPaths() {
    const [filter, setFilter] = useState('All');
    const { paths: databasePaths = [] } = usePage().props as unknown as {
        paths?: DatabasePath[];
    };
    const paths: AdminPathDisplay[] = databasePaths.map((path) => [
              path.title,
              path.category ?? 'General',
              path.generation_source === 'openrouter'
                  ? 'AI Generated'
                  : 'Community',
              `${path.topics_count} topics`,
              'from-emerald-300/30 via-slate-700 to-slate-950',
          ]);
    const metrics = [
        ['Total Paths', String(databasePaths.length), BookOpen],
        ['AI Generated', String(databasePaths.filter((path) => path.generation_source === 'openrouter').length), Sparkles],
        ['Community Created', String(databasePaths.filter((path) => path.generation_source !== 'openrouter').length), Users],
        ['Categories', String(new Set(databasePaths.map((path) => path.category).filter(Boolean)).size), Layers3],
    ] as const;
    const visible = paths.filter(
        (path) => filter === 'All' || path[2] === filter,
    );
    return (
        <>
            <Head title="All Generated Paths" />
            <div className="mx-auto w-full max-w-[1500px] p-4 md:p-7">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <main>
                        <h1 className="text-4xl font-bold">
                            All Generated Paths
                        </h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Browse every generated roadmap and discover new
                            skills to learn.
                        </p>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {metrics.map(([label, value, Icon]) => (
                                <MetricCard key={label as string} label={label as string} value={value as string} note="Real database data" icon={Icon} />
                            ))}
                        </div>
                        <div className="mt-6 flex flex-wrap gap-2">
                            {[
                                'All',
                                'AI Generated',
                                'Community',
                                'Trending',
                                'New',
                                'Saved',
                            ].map((item) => (
                                <Button
                                    key={item}
                                    variant={
                                        filter === item ? 'default' : 'outline'
                                    }
                                    onClick={() => setFilter(item)}
                                    className={cn(
                                        filter === item &&
                                            'bg-emerald-300 text-emerald-950 hover:bg-emerald-200',
                                    )}
                                >
                                    {item}
                                </Button>
                            ))}
                        </div>
                        {visible.length > 0 ? <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {visible.map(
                                ([title, category, source, learners, tone]) => {
                                    const Icon =
                                        iconMap[
                                            category as keyof typeof iconMap
                                        ] ?? Sparkles;
                                    return (
                                        <Card
                                            key={title}
                                            className="overflow-hidden border-border/70 bg-card/60 py-2 shadow-none"
                                        >
                                            <CardContent className="p-3">
                                                <div
                                                    className={cn(
                                                        'relative flex h-32 items-center justify-center rounded-lg bg-gradient-to-br',
                                                        tone,
                                                    )}
                                                >
                                                    <Icon className="size-12 text-white/80" />
                                                    <Heart className="absolute top-2 right-2 size-5 text-white" />
                                                </div>
                                                <h2 className="mt-3 truncate font-semibold">
                                                    {title}
                                                </h2>
                                                <p className="mt-2 flex items-center gap-2 text-sm text-emerald-300">
                                                    {category}
                                                </p>
                                                <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                                                    <BarChart3 size={14} />
                                                    Beginner{' '}
                                                    <Clock3 size={14} />8 weeks{' '}
                                                    <Layers3 size={14} />
                                                    24 topics
                                                </p>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <span className="text-xs text-muted-foreground">
                                                        {source} · {learners}
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        className="bg-emerald-300 text-emerald-950 hover:bg-emerald-200"
                                                    >
                                                        View Path
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                },
                            )}
                        </div> : <div className="mt-4 rounded-xl border border-dashed border-border/70 p-6 text-center">
                            <BookOpen className="mx-auto size-8 text-emerald-300" />
                            <h2 className="mt-3 text-lg font-semibold">No learning paths yet</h2>
                            <p className="mt-2 text-sm text-muted-foreground">Generated paths will appear here when users create them.</p>
                        </div>}
                    </main>
                    <aside className="space-y-4">
                        <Card className="border-border/70 bg-card/60 py-2 shadow-none">
                            <CardContent className="px-4 py-2">
                                <h2 className="font-semibold">
                                    Popular This Week
                                </h2>
                                {paths.length > 0 ? paths.slice(0, 5).map(([title, category, , learners], i) => (
                                        <div
                                            key={title}
                                            className="flex items-center gap-3 border-b border-border/50 py-3 last:border-0"
                                        >
                                            <span className="flex size-7 items-center justify-center rounded-full bg-muted text-xs">
                                                {i + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">
                                                    {title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {category} · {learners}
                                                </p>
                                            </div>
                                        </div>
                                    )) : <EmptyState icon={BarChart3} description="No popular paths yet." />}
                            </CardContent>
                        </Card>
                        <Card className="border-border/70 bg-card/60 py-2 shadow-none">
                            <CardContent className="px-4 py-2">
                                <h2 className="font-semibold">
                                    Top Categories
                                </h2>
                                {Array.from(new Set(databasePaths.map((path) => path.category).filter((category): category is string => Boolean(category)))).length > 0 ? Array.from(new Set(databasePaths.map((path) => path.category).filter((category): category is string => Boolean(category)))).map((category) => (
                                    <div
                                        key={category}
                                        className="flex items-center gap-3 border-b border-border/50 py-3 last:border-0"
                                    >
                                        <span className="flex size-8 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                                            <Layers3 size={16} />
                                        </span>
                                        <span className="flex-1 text-sm">
                                            {category}
                                        </span>
                                    </div>
                                )) : <EmptyState icon={Layers3} description="No categories yet." />}
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </div>
        </>
    );
}
