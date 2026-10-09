import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    BookOpen,
    CalendarDays,
    Check,
    ChevronRight,
    Clock3,
    Flame,
    MoreVertical,
    Play,
    Sparkles,
    Target,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ActivityChart } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';

const stats = [
    {
        icon: BookOpen,
        value: '6',
        label: 'Active Paths',
        note: '+2 from last month',
    },
    {
        icon: Check,
        value: '24',
        label: 'Topics Completed',
        note: '+12 this month',
    },
    {
        icon: Clock3,
        value: '18h 32m',
        label: 'Study Time',
        note: '+4h this week',
    },
    { icon: Flame, value: '12', label: 'Day Streak', note: 'Keep it up!' },
];
const courses = [
    {
        title: 'Japanese Language for Beginners',
        kind: 'Language',
        duration: '8 weeks',
        progress: 50,
        topics: '12 of 24 topics completed',
        tone: 'from-sky-200 via-pink-200 to-orange-300',
    },
    {
        title: 'Photography Fundamentals',
        kind: 'Lifestyle',
        duration: '8 weeks',
        progress: 33,
        topics: '6 of 18 topics completed',
        tone: 'from-orange-200 via-slate-600 to-slate-950',
    },
];

export default function Dashboard() {
    const [goals, setGoals] = useState([true, true, false, false, false]);
    const manilaDate = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Manila',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date());
    return (
        <>
            <Head title="Dashboard" />
            <div className="mx-auto w-full max-w-[1500px] p-4 md:p-7">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
                    <main className="min-w-0">
                        <header className="flex items-end justify-between">
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight">
                                    Dashboard
                                </h1>
                                <p className="mt-2 text-lg text-muted-foreground">
                                    Welcome back, Carl! Here's your learning
                                    progress at a glance.
                                </p>
                            </div>
                            <div className="hidden text-right text-sm text-muted-foreground md:block">
                                <p>{manilaDate}</p>
                                <p className="mt-1">
                                    Keep going, great things take time.
                                </p>
                            </div>
                        </header>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {stats.map(({ icon: Icon, value, label, note }) => (
                                <Card
                                    key={label}
                                    className="border-border/70 bg-card/60 py-2 shadow-none"
                                >
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                                            <Icon size={22} />
                                        </span>
                                        <div>
                                            <strong className="block text-2xl">
                                                {value}
                                            </strong>
                                            <p className="text-sm text-muted-foreground">
                                                {label}
                                            </p>
                                            <p className="mt-1 text-xs text-emerald-300">
                                                ↗ {note}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <Card className="mt-4 border-border/70 bg-card/60 py-2 shadow-none">
                            <CardContent className="px-4 py-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="flex items-center gap-2 text-lg font-semibold">
                                            <Flame className="text-emerald-300" />
                                            Continue Learning
                                        </h2>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Pick up where you left off and keep
                                            making progress.
                                        </p>
                                    </div>
                                    <Button
                                        variant="link"
                                        className="text-emerald-300"
                                    >
                                        View all
                                    </Button>
                                </div>
                                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                                    {courses.map((course) => (
                                        <CourseCard
                                            key={course.title}
                                            {...course}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                            <ActivityCard />
                            <SessionsCard />
                        </div>
                    </main>
                    <aside className="space-y-4">
                        <GoalCard goals={goals} setGoals={setGoals} />
                        <Card className="border-border/70 bg-card/60 py-2 shadow-none">
                            <CardContent className="px-4 py-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="flex items-center gap-2 text-lg font-semibold">
                                            <Sparkles className="text-emerald-300" />
                                            Recommended for You
                                        </h2>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Based on your interests and
                                            progress.
                                        </p>
                                    </div>
                                    <Button
                                        variant="link"
                                        className="text-emerald-300"
                                    >
                                        View all
                                    </Button>
                                </div>
                                <div className="mt-3 space-y-2">
                                    {[
                                        'Python for Beginners',
                                        'Mindfulness & Meditation',
                                        'Digital Marketing Basics',
                                    ].map((name, i) => (
                                        <div
                                            key={name}
                                            className="flex items-center gap-3 rounded-xl border border-border/50 p-2"
                                        >
                                            <span
                                                className={cn(
                                                    'flex size-12 items-center justify-center rounded-lg bg-gradient-to-br text-white/80',
                                                    i === 0
                                                        ? 'from-blue-500 to-yellow-300'
                                                        : i === 1
                                                          ? 'from-stone-300 to-amber-800'
                                                          : 'from-slate-300 to-amber-800',
                                                )}
                                            >
                                                <BookOpen size={20} />
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">
                                                    {name}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {i === 0
                                                        ? 'Technology · 12 weeks'
                                                        : i === 1
                                                          ? 'Personal Growth · 4 weeks'
                                                          : 'Business · 8 weeks'}
                                                </p>
                                            </div>
                                            <ChevronRight className="size-4 text-muted-foreground" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </div>
        </>
    );
}

function CourseCard({
    title,
    kind,
    duration,
    progress,
    topics,
    tone,
}: (typeof courses)[number]) {
    return (
        <div className="flex gap-4 rounded-xl border border-border/60 bg-background/30 p-3">
            <div
                className={cn(
                    'flex size-28 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br',
                    tone,
                )}
            >
                <BookOpen className="size-9 text-white/80" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2">
                    <div>
                        <h3 className="leading-5 font-semibold">{title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {kind} <span className="mx-1">·</span> {duration}
                        </p>
                    </div>
                    <MoreVertical className="size-4 text-muted-foreground" />
                </div>
                <div className="mt-4 flex items-center gap-3">
                    <div className="h-2 flex-1 rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-emerald-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="text-xs text-emerald-300">
                        {progress}%
                    </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{topics}</p>
                <Button
                    size="sm"
                    className="mt-3 bg-emerald-300 text-emerald-950 hover:bg-emerald-200"
                >
                    Continue Learning <ArrowRight />
                </Button>
            </div>
        </div>
    );
}
function GoalCard({
    goals,
    setGoals,
}: {
    goals: boolean[];
    setGoals: (goals: boolean[]) => void;
}) {
    const items = [
        'Study for 30 minutes',
        'Complete 2 topics',
        'Take a practice quiz',
        'Make a note or summary',
        'Explore a new learning path',
    ];
    return (
        <Card className="border-border/70 bg-card/60 py-2 shadow-none">
            <CardContent className="px-4 py-2">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="flex items-center gap-2 text-lg font-semibold">
                            <Target className="text-emerald-300" />
                            Today's Goal
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Small steps lead to big results.
                        </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {goals.filter(Boolean).length} of 5 completed
                    </span>
                </div>
                <div className="mt-4 space-y-3">
                    {items.map((item, index) => (
                        <button
                            type="button"
                            key={item}
                            onClick={() =>
                                setGoals(
                                    goals.map((done, i) =>
                                        i === index ? !done : done,
                                    ),
                                )
                            }
                            className="flex w-full items-center gap-3 text-left text-sm"
                        >
                            <span
                                className={cn(
                                    'flex size-6 shrink-0 items-center justify-center rounded-full border',
                                    goals[index]
                                        ? 'border-emerald-300 bg-emerald-300 text-emerald-950'
                                        : 'border-muted-foreground/70',
                                )}
                            >
                                {goals[index] && <Check size={15} />}
                            </span>
                            <span
                                className={cn(
                                    goals[index] &&
                                        'text-muted-foreground line-through',
                                )}
                            >
                                {item}
                            </span>
                        </button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
function ActivityCard() {
    const data = [
        { day: 'Mon', minutes: 132 },
        { day: 'Tue', minutes: 105 },
        { day: 'Wed', minutes: 200 },
        { day: 'Thu', minutes: 130 },
        { day: 'Fri', minutes: 90 },
        { day: 'Sat', minutes: 160 },
        { day: 'Sun', minutes: 75 },
    ];
    return (
        <Card className="border-border/70 bg-card/60 py-2 shadow-none">
            <CardContent className="px-4 py-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="flex items-center gap-2 text-lg font-semibold">
                            <BarChart3 className="text-emerald-300" />
                            Weekly Activity
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Your study time over the last 7 days.
                        </p>
                    </div>
                    <Button variant="outline" size="sm">
                        This week
                    </Button>
                </div>
                <ActivityChart data={data} />
            </CardContent>
        </Card>
    );
}
function SessionsCard() {
    return (
        <Card className="border-border/70 bg-card/60 py-2 shadow-none">
            <CardContent className="px-4 py-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="flex items-center gap-2 text-lg font-semibold">
                            <CalendarDays className="text-emerald-300" />
                            Upcoming Sessions
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Your scheduled learning sessions.
                        </p>
                    </div>
                    <Button variant="link" className="text-emerald-300">
                        View all
                    </Button>
                </div>
                <div className="mt-4 space-y-3">
                    {[
                        [
                            'Today',
                            '10:00 AM',
                            'Hiragana Practice',
                            'Japanese Language for Beginners',
                            Play,
                        ],
                        [
                            'Today',
                            '2:00 PM',
                            'Composition Basics',
                            'Photography Fundamentals',
                            Clock3,
                        ],
                        [
                            'Tomorrow',
                            '10:00 AM',
                            'Components in Laravel',
                            'Learn Laravel',
                            CodeIcon,
                        ],
                    ].map(([day, time, title, path, Icon]) => (
                        <div
                            key={title as string}
                            className="flex items-center gap-3 border-b border-border/50 pb-3 last:border-0"
                        >
                            <span className="size-2 rounded-full bg-emerald-300" />
                            <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
                                <Icon size={18} className="text-emerald-300" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-muted-foreground">
                                    {day} · {time}
                                </p>
                                <p className="font-medium">{title as string}</p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {path as string}
                                </p>
                            </div>
                            <ChevronRight className="size-4 text-muted-foreground" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
function CodeIcon() {
    return <span className="font-mono text-sm">&lt;/&gt;</span>;
}

Dashboard.layout = { breadcrumbs: [{ title: 'Dashboard', href: dashboard() }] };
