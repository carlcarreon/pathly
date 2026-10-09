import { Head } from '@inertiajs/react';
import {
    Activity,
    Award,
    Flame,
    MoreVertical,
    UserRound,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const people = [
    [
        'Alex Chen',
        '@alexchen',
        'Creator',
        'Design',
        'Building in public. Sharing what I learn about design, no-code and productivity.',
        'from-sky-300 to-indigo-700',
    ],
    [
        'Maya Tan',
        '@mayatan',
        'Top Learner',
        'Technology',
        'Lifelong learner exploring tech, creativity and a more intentional life.',
        'from-pink-200 to-orange-500',
    ],
    [
        'Daniel Park',
        '@danielpark',
        'Mentor',
        'Career',
        'I create learning paths to help others break into tech and build a fulfilling career.',
        'from-green-300 to-slate-700',
    ],
    [
        'Sophia Rivera',
        '@sophiarivera',
        'Creator',
        'Design',
        'Design systems, UI/UX and creative workflows. Turning ideas into real progress.',
        'from-blue-700 to-cyan-400',
    ],
    [
        'Ethan Kim',
        '@ethankim',
        'Learner',
        'Personal Growth',
        'Exploring AI, productivity and building a better version of myself every day.',
        'from-sky-300 to-pink-300',
    ],
    [
        'Priya Shah',
        '@priyashah',
        'Creator',
        'Data Science',
        'Sharing practical knowledge about data science, analytics and real-world projects.',
        'from-green-400 to-lime-200',
    ],
    [
        'Noah Wilson',
        '@noahwilson',
        'Learner',
        'Business',
        'Student, builder, and curious explorer. Documenting my learning journey here.',
        'from-orange-300 to-slate-800',
    ],
    [
        'Luna Garcia',
        '@lunagarcia',
        'Mentor',
        'Lifestyle',
        'Mindfulness, creativity and living a balanced, intentional life.',
        'from-slate-500 to-blue-950',
    ],
] as const;

export default function UsersPage() {
    const [filter, setFilter] = useState('All');
    return (
        <>
            <Head title="Users" />
            <div className="mx-auto w-full max-w-[1500px] p-4 md:p-7">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <main>
                        <h1 className="text-4xl font-bold">Users</h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Discover learners, creators, and community members
                            on Pathly.
                        </p>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {[
                                ['Total Users', '2,482', Users],
                                ['Active This Week', '864', Activity],
                                ['Path Creators', '312', UserRound],
                                ['Top Streak', '97 days', Flame],
                            ].map(([label, value, Icon]) => (
                                <Card
                                    key={label as string}
                                    className="border-border/70 bg-card/60 pt-0 shadow-none"
                                >
                                    <CardContent className="flex items-center gap-4 px-4 py-2">
                                        <span className="flex size-12 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                                            <Icon size={22} />
                                        </span>
                                        <div>
                                            <strong className="block text-2xl">
                                                {value as string}
                                            </strong>
                                            <p className="text-sm text-muted-foreground">
                                                {label as string}
                                            </p>
                                            <p className="mt-1 text-xs text-emerald-300">
                                                ↗ +12% from last month
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <div className="mt-6 flex flex-wrap gap-2">
                            {[
                                'All',
                                'Creators',
                                'Learners',
                                'Following',
                                'New Members',
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
                        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {people.map(
                                ([name, handle, role, category, bio, tone]) => (
                                    <Card
                                        key={name}
                                        className="overflow-hidden border-border/70 bg-card/60 pt-0 shadow-none"
                                    >
                                        <div
                                            className={cn(
                                                'h-20 bg-gradient-to-br',
                                                tone,
                                            )}
                                        />
                                        <CardContent className="relative px-3 py-2">
                                            <span className="-mt-10 flex size-16 items-center justify-center rounded-full border-4 border-card bg-muted text-xl font-semibold">
                                                {name
                                                    .split(' ')
                                                    .map((part) => part[0])
                                                    .join('')}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2"
                                            >
                                                <MoreVertical />
                                            </Button>
                                            <div className="mt-2">
                                                <h2 className="font-semibold">
                                                    {name}
                                                </h2>
                                                <p className="text-xs text-muted-foreground">
                                                    {handle}
                                                </p>
                                                <span className="mt-2 inline-flex rounded-full border border-emerald-400/30 px-2 py-0.5 text-xs text-emerald-300">
                                                    {role}
                                                </span>
                                                <p className="mt-3 min-h-16 text-sm text-muted-foreground">
                                                    {bio}
                                                </p>
                                                <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                                                    <span>♧ 12 Paths</span>
                                                    <span>🔥 28 days</span>
                                                    <span>{category}</span>
                                                </div>
                                                <Button className="mt-4 w-full bg-emerald-300 text-emerald-950 hover:bg-emerald-200">
                                                    {role === 'Learner'
                                                        ? 'Follow'
                                                        : 'View Profile'}{' '}
                                                    →
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ),
                            )}
                        </div>
                    </main>
                    <aside className="space-y-4">
                        <Card className="border-border/70 bg-card/60 pt-0 shadow-none">
                            <CardContent className="px-4 py-2">
                                <h2 className="font-semibold">
                                    Suggested to Follow
                                </h2>
                                {people
                                    .slice(0, 5)
                                    .map(([name, , role, category]) => (
                                        <div
                                            key={name}
                                            className="flex items-center gap-3 border-b border-border/50 py-3 last:border-0"
                                        >
                                            <span className="flex size-9 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-semibold text-emerald-300">
                                                {name
                                                    .split(' ')
                                                    .map((x) => x[0])
                                                    .join('')}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium">
                                                    {name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {role} · {category}
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-emerald-300"
                                            >
                                                Follow
                                            </Button>
                                        </div>
                                    ))}
                            </CardContent>
                        </Card>
                        <Card className="border-border/70 bg-card/60 pt-0 shadow-none">
                            <CardContent className="px-4 py-2">
                                <h2 className="flex items-center gap-2 font-semibold">
                                    <Award className="text-amber-400" />
                                    Top Contributors
                                </h2>
                                {people.slice(0, 5).map(([name], i) => (
                                    <div
                                        key={name}
                                        className="flex items-center gap-3 py-3"
                                    >
                                        <span className="flex size-7 items-center justify-center rounded-full bg-muted text-xs">
                                            {i + 1}
                                        </span>
                                        <span className="flex-1 text-sm">
                                            {name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {24 - i * 3} paths
                                        </span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </div>
        </>
    );
}
