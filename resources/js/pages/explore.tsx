import { Head, usePage } from '@inertiajs/react';
import {
    BarChart3,
    BriefcaseBusiness,
    Clock3,
    Code2,
    Globe2,
    Heart,
    Leaf,
    Monitor,
    Palette,
    Sparkles,
    TrendingUp,
    Users,
    Utensils,
    Video,
    Wifi,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/empty-state';

const categories = [
    'All',
    'Technology',
    'Design',
    'Language',
    'Business',
    'Lifestyle',
    'Personal Growth',
];
type DatabasePath = {
    id: number;
    title: string;
    description: string;
    category: string | null;
    level: string;
    duration_weeks: number;
    topics_count: number;
};

type CatalogPath = {
    title: string;
    kind: string;
    description: string;
    level: string;
    duration: string;
    topics: string;
    tone: string;
    Icon: typeof Globe2;
};

const fallbackPaths = [
    [
        'Japanese Language for Beginners',
        'Language',
        'A practical 8-week roadmap to help you build a solid foundation in Japanese.',
        'Beginner',
        '8 weeks',
        '24 topics',
        'from-sky-200 via-pink-200 to-orange-300',
        Globe2,
    ],
    [
        'Learn Laravel',
        'Technology',
        'Master Laravel from basics to building real-world web applications.',
        'Beginner',
        '12 weeks',
        '36 topics',
        'from-red-400 via-red-600 to-orange-700',
        Code2,
    ],
    [
        'UI/UX Design Basics',
        'Design',
        'Learn the fundamentals of UI/UX design and create beautiful, user-centered products.',
        'Beginner',
        '10 weeks',
        '28 topics',
        'from-indigo-500 via-purple-900 to-slate-950',
        Palette,
    ],
    [
        'Photography Fundamentals',
        'Lifestyle',
        'Learn camera basics, composition, and editing to capture stunning photos.',
        'Beginner',
        '8 weeks',
        '18 topics',
        'from-orange-200 via-slate-700 to-slate-950',
        Video,
    ],
    [
        'Data Science Foundations',
        'Technology',
        'Build a strong foundation in data science with Python, statistics, and real projects.',
        'Intermediate',
        '12 weeks',
        '32 topics',
        'from-cyan-400 via-blue-950 to-slate-950',
        BarChart3,
    ],
    [
        'Cooking Essentials',
        'Lifestyle',
        'Learn essential cooking skills, techniques, and recipes for everyday meals.',
        'Beginner',
        '6 weeks',
        '20 topics',
        'from-amber-200 via-orange-700 to-red-950',
        Utensils,
    ],
    [
        'Personal Finance Basics',
        'Business',
        'Learn how to manage money, budget effectively, and build a secure financial future.',
        'Beginner',
        '8 weeks',
        '22 topics',
        'from-lime-200 via-amber-700 to-slate-900',
        BriefcaseBusiness,
    ],
    [
        'Public Speaking Foundations',
        'Personal Growth',
        'Build confidence and master the art of effective communication.',
        'Beginner',
        '6 weeks',
        '16 topics',
        'from-slate-500 via-purple-950 to-slate-950',
        Users,
    ],
] as const;

const iconMap = {
    Technology: Monitor,
    Design: Palette,
    Language: Globe2,
    Business: BriefcaseBusiness,
    Lifestyle: Leaf,
    'Personal Growth': BarChart3,
};

export default function Explore() {
    const [category, setCategory] = useState('All');
    const { paths: databasePaths = [] } = usePage().props as unknown as {
        paths?: DatabasePath[];
    };
    const catalogPaths: CatalogPath[] = databasePaths.map((path) => ({
              title: path.title,
              kind: path.category ?? 'General',
              description: path.description,
              level: path.level,
              duration: `${path.duration_weeks} weeks`,
              topics: `${path.topics_count} topics`,
              tone: 'from-emerald-300/30 via-slate-700 to-slate-950',
              Icon: iconMap[path.category as keyof typeof iconMap] ?? Sparkles,
          }));
    const visible = catalogPaths.filter(
        (path) => category === 'All' || path.kind === category,
    );
    return (
        <>
            <Head title="Explore Paths" />
            <div className="mx-auto w-full max-w-[1500px] p-4 md:p-7">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <main className="min-w-0">
                        <header>
                            <h1 className="text-4xl font-bold tracking-tight">
                                Explore Paths
                            </h1>
                            <p className="mt-2 text-lg text-muted-foreground">
                                Discover new learning paths and find your next
                                journey.
                            </p>
                        </header>
                        <div className="mt-6 flex flex-wrap items-center gap-2">
                            {categories.map((item) => (
                                <Button
                                    key={item}
                                    variant={
                                        category === item
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() => setCategory(item)}
                                    className={cn(
                                        category === item &&
                                            'bg-emerald-300 text-emerald-950 hover:bg-emerald-200',
                                    )}
                                >
                                    {item}
                                </Button>
                            ))}
                            <div className="ml-auto flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    Sort by
                                </span>
                                <Button variant="outline">Most Popular</Button>
                            </div>
                        </div>
                        {visible.length > 0 ? (
                            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {visible.map((path) => (
                                    <PathCard key={path.title} {...path} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState className="mt-4 p-12" icon={Sparkles} title="No public learning paths yet" description="Completed public paths will appear here." />
                        )}
                    </main>
                    <aside className="space-y-4">
                        <SideCard title="Recommended for You" icon={Sparkles}>
                            <EmptyState icon={Sparkles} description="Recommendations will appear as you build your learning history." />
                        </SideCard>
                        <SideCard title="Trending Categories" icon={TrendingUp}>
                            {databasePaths.length > 0 ? categories.slice(1).map((item, index) => {
                                const Icon =
                                    iconMap[item as keyof typeof iconMap];
                                return (
                                    <div
                                        key={item}
                                        className="flex items-center gap-3 border-b border-border/50 py-3 last:border-0"
                                    >
                                        <span className="flex size-8 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                                            <Icon size={16} />
                                        </span>
                                        <span className="flex-1 text-sm">
                                            {item}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {120 - index * 15}+ paths
                                        </span>
                                    </div>
                                );
                            }) : <EmptyState icon={TrendingUp} description="Trending categories will appear when paths are available." />}
                        </SideCard>
                        <SideCard title="Popular This Week" icon={BarChart3}>
                            <EmptyState icon={BarChart3} description="Popularity data will appear as more paths are completed." />
                        </SideCard>
                    </aside>
                </div>
            </div>
        </>
    );
}

function PathCard({
    title,
    kind,
    description,
    level,
    duration,
    topics,
    tone,
    Icon,
}: {
    title: string;
    kind: string;
    description: string;
    level: string;
    duration: string;
    topics: string;
    tone: string;
    Icon: typeof Globe2;
}) {
    return (
        <Card className="overflow-hidden border-border/70 bg-card/60 shadow-none">
            <CardContent className="p-3">
                <div
                    className={cn(
                        'relative flex h-32 items-center justify-center rounded-lg bg-gradient-to-br',
                        tone,
                    )}
                >
                    <Icon className="size-12 text-white/80" />
                    <button
                        type="button"
                        className="absolute top-2 right-2 rounded-full bg-black/30 p-2 text-white"
                    >
                        <Heart size={16} />
                    </button>
                </div>
                <h2 className="mt-3 truncate font-semibold">{title}</h2>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-emerald-300">{kind}</span>
                </p>
                <p className="mt-3 min-h-12 text-sm leading-5 text-muted-foreground">
                    {description}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <BarChart3 size={14} />
                    {level}
                    <Clock3 size={14} />
                    {duration}
                    <Wifi size={14} />
                    {topics}
                </div>
                <Button className="mt-4 w-full bg-emerald-300 text-emerald-950 hover:bg-emerald-200">
                    View Path <ChevronRightIcon />
                </Button>
            </CardContent>
        </Card>
    );
}
function ChevronRightIcon() {
    return <span aria-hidden="true">→</span>;
}
function SideCard({
    title,
    icon: Icon,
    children,
}: {
    title: string;
    icon: typeof Sparkles;
    children: React.ReactNode;
}) {
    return (
        <Card className="border-border/70 bg-card/60 shadow-none">
            <CardContent className="p-4">
                <div className="flex items-center gap-2">
                    <Icon className="size-5 text-emerald-300" />
                    <h2 className="font-semibold">{title}</h2>
                    <Button variant="link" className="ml-auto text-emerald-300">
                        View all
                    </Button>
                </div>
                <div className="mt-3">{children}</div>
            </CardContent>
        </Card>
    );
}
function MiniPath({
    title,
    kind,
    detail,
    tone,
}: {
    title: string;
    kind: string;
    detail: string;
    tone: string;
}) {
    return (
        <div className="flex items-center gap-3 border-b border-border/50 py-3 last:border-0">
            <span
                className={cn(
                    'flex size-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br',
                    tone,
                )}
            >
                <Sparkles className="size-5 text-white/80" />
            </span>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{kind}</p>
                <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
            </div>
            <span className="text-muted-foreground">›</span>
        </div>
    );
}
