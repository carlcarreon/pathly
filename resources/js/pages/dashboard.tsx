import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    BookOpen,
    CalendarDays,
    Check,
    ChevronRight,
    Clock3,
    Code2,
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
import { MetricCard } from '@/components/metric-card';
import { EmptyState } from '@/components/empty-state';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';

type Stat = { value: string; label: string; note: string };
type Course = { id: string; title: string; kind: string; duration: string; progress: number; topics: string; tone: string };
type Activity = { day: string; topics: number };

type Props = { stats: Stat[]; courses: Course[]; activity: Activity[] };

export default function Dashboard({ stats = [], courses = [], activity = [] }: Props) {
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
                            {stats.map(({ value, label, note }) => (
                                <MetricCard key={label} label={label} value={value} note={note} icon={BookOpen} />
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
                                    {courses.length > 0 ? (
                                        courses.map((course) => (
                                            <CourseCard
                                                key={course.id}
                                                {...course}
                                            />
                                        ))
                                    ) : (
                                        <div className="lg:col-span-2">
                                            <EmptyState icon={BookOpen} title="No learning paths yet" description="Create your first learning path to start tracking your progress." />
                                            <Button
                                                asChild
                                                className="mt-4 bg-emerald-300 text-emerald-950 hover:bg-emerald-200"
                                            >
                                                <a href="/paths/create">
                                                    Create a learning path
                                                    <ArrowRight />
                                                </a>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                            <ActivityCard data={activity} />
                            <SessionsCard />
                        </div>
                    </main>
                    <aside className="space-y-4">
                        <GoalCard />
                        <Card className="border-border/70 bg-card/60 py-2 shadow-none">
                            <CardContent className="px-4 py-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="flex items-center gap-2 text-lg font-semibold">
                                            <Sparkles className="text-emerald-300" />
                                            Recommended for You
                                        </h2>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Based on your interests and progress.
                                        </p>
                                    </div>
                                    <Button variant="link" className="text-emerald-300">View all</Button>
                                </div>
                                <EmptyState icon={Sparkles} description="Recommendations will appear as you build your learning history." />
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
}: Course) {
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

function GoalCard() {
    return (
        <Card className="flex min-h-[370px] flex-col border-border/70 bg-card/60 py-2 shadow-none">
            <CardContent className="px-4 py-2">
                <div>
                    <div>
                        <h2 className="flex items-center gap-2 text-lg font-semibold">
                            <Target className="text-emerald-300" />
                            Today's Goal
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Small steps lead to big results.
                        </p>
                    </div>
                </div>
                <div className="mt-4 rounded-xl border border-dashed border-border/70 p-6 text-center">
                    <Target className="mx-auto size-8 text-emerald-300" />
                    <p className="mt-3 text-sm text-muted-foreground">
                        Daily goals will appear when goal tracking is enabled.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
function ActivityCard({ data }: { data: Activity[] }) {
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
                            Topics completed over the last 7 days.
                        </p>
                    </div>
                    <Button variant="outline" size="sm">This week</Button>
                </div>
                {data.some(({ topics }) => topics > 0) ? (
                    <div className="mt-auto w-full">
                        <ActivityChart
                            data={data.map(({ day, topics }) => ({ day, minutes: topics }))}
                        />
                    </div>
                ) : (
                    <div className="mt-auto flex min-h-48 items-end justify-center pb-2">
                        <p className="text-center text-sm text-muted-foreground">
                            Complete a topic to see your weekly activity.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
function SessionsCard() {
    return (
        <Card className="border-border/70 bg-card/60 py-2 shadow-none">
            <CardContent className="px-4 py-2">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <CalendarDays className="text-emerald-300" />
                    Upcoming Sessions
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Your scheduled learning sessions.
                </p>
                <EmptyState icon={CalendarDays} description="No upcoming sessions scheduled." />
            </CardContent>
        </Card>
    );
}

Dashboard.layout = { breadcrumbs: [{ title: 'Dashboard', href: dashboard() }] };
