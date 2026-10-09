import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    BookOpen,
    CalendarDays,
    Check,
    Compass,
    Menu,
    Network,
    Sparkles,
    Target,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { dashboard, login, register } from '@/routes';

const features = [
    {
        icon: BookOpen,
        title: 'Personalized paths',
        text: 'Learn anything, your way.',
    },
    {
        icon: BarChart3,
        title: 'Track progress',
        text: 'Stay motivated as you grow.',
    },
    {
        icon: CalendarDays,
        title: 'Plan your learning',
        text: 'Build consistent habits.',
    },
    {
        icon: Sparkles,
        title: 'AI-powered creation',
        text: 'Turn ideas into roadmaps.',
    },
    {
        icon: Users,
        title: 'Learn together',
        text: 'Explore a world of topics.',
    },
];
const steps = [
    {
        icon: Compass,
        number: '01',
        title: 'Choose a path',
        text: 'Start with a goal or explore a path made for you.',
    },
    {
        icon: Network,
        number: '02',
        title: 'Follow the roadmap',
        text: 'Move through focused milestones at your own pace.',
    },
    {
        icon: BarChart3,
        number: '03',
        title: 'Track your progress',
        text: 'See your momentum and celebrate every win.',
    },
];

export default function Welcome() {
    const { auth } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <>
            <Head title="Turn goals into progress" />
            <div className="landing-page min-h-screen overflow-hidden bg-[#06120f] text-white">
                <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
                    <a
                        href="#top"
                        className="flex items-center gap-2 text-xl font-bold tracking-tight"
                        aria-label="Pathly home"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 text-[#06120f] shadow-[0_0_24px_rgba(52,211,153,.35)]">
                            <Compass size={22} strokeWidth={2.5} />
                        </span>
                        pathly
                    </a>
                    <nav
                        className="hidden items-center gap-8 text-sm text-emerald-100/70 md:flex"
                        aria-label="Main navigation"
                    >
                        <a
                            href="#features"
                            className="transition hover:text-emerald-300"
                        >
                            Features
                        </a>
                        <a
                            href="#paths"
                            className="transition hover:text-emerald-300"
                        >
                            Explore Paths
                        </a>
                        <a
                            href="#how-it-works"
                            className="transition hover:text-emerald-300"
                        >
                            How It Works
                        </a>
                        <a
                            href="#about"
                            className="transition hover:text-emerald-300"
                        >
                            About
                        </a>
                    </nav>
                    <div className="hidden items-center gap-5 md:flex">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="text-sm text-emerald-100/80 transition hover:text-white"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="text-sm text-emerald-100/80 transition hover:text-white"
                            >
                                Sign in
                            </Link>
                        )}
                        <Link
                            href={auth.user ? dashboard() : register()}
                            className="landing-button rounded-xl px-5 py-3 text-sm font-semibold text-[#04110d]"
                        >
                            {auth.user ? 'Open dashboard' : 'Get started'}
                        </Link>
                    </div>
                    <button
                        type="button"
                        className="rounded-lg p-2 text-emerald-100 md:hidden"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {menuOpen ? <X /> : <Menu />}
                    </button>
                </header>
                {menuOpen && (
                    <nav
                        className="relative z-20 mx-6 flex flex-col gap-5 rounded-2xl border border-emerald-300/15 bg-[#0b211b]/95 p-6 text-sm text-emerald-100 md:hidden"
                        aria-label="Mobile navigation"
                    >
                        <a href="#features" onClick={() => setMenuOpen(false)}>
                            Features
                        </a>
                        <a href="#paths" onClick={() => setMenuOpen(false)}>
                            Explore Paths
                        </a>
                        <a
                            href="#how-it-works"
                            onClick={() => setMenuOpen(false)}
                        >
                            How It Works
                        </a>
                        <a href="#about" onClick={() => setMenuOpen(false)}>
                            About
                        </a>
                        <Link
                            href={auth.user ? dashboard() : login()}
                            className="border-t border-emerald-300/15 pt-4"
                        >
                            {auth.user ? 'Dashboard' : 'Sign in'}
                        </Link>
                    </nav>
                )}
                <main id="top">
                    <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pt-16 pb-20 lg:grid-cols-[.9fr_1.1fr] lg:px-10 lg:pt-24 lg:pb-28">
                        <div className="landing-grid absolute inset-0 -z-10 opacity-30" />
                        <div className="relative z-10">
                            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/5 px-4 py-2 text-xs font-semibold tracking-[.2em] text-emerald-300 uppercase">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                                Your learning. Your path.
                            </div>
                            <h1 className="max-w-2xl text-5xl leading-[1.05] font-bold tracking-[-.04em] sm:text-6xl lg:text-7xl">
                                Turn your goals into{' '}
                                <span className="landing-gradient-text">
                                    real progress.
                                </span>
                            </h1>
                            <p className="mt-7 max-w-xl text-lg leading-8 text-emerald-100/65 sm:text-xl">
                                Pathly helps you create and follow personalized
                                learning paths for any subject. Learn at your
                                pace, track your progress, and build the skills
                                you want.
                            </p>
                            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                                <Link
                                    href={auth.user ? dashboard() : register()}
                                    className="landing-button inline-flex items-center justify-center gap-3 rounded-xl px-6 py-4 font-semibold text-[#04110d]"
                                >
                                    {auth.user
                                        ? 'Open your dashboard'
                                        : 'Start learning free'}{' '}
                                    <ArrowRight size={18} />
                                </Link>
                                <a
                                    href="#paths"
                                    className="inline-flex items-center justify-center rounded-xl border border-emerald-200/25 px-6 py-4 font-semibold text-emerald-50 transition hover:border-emerald-300/60 hover:bg-emerald-300/5"
                                >
                                    Explore learning paths
                                </a>
                            </div>
                            <div className="mt-14 flex gap-8 border-t border-emerald-100/10 pt-6 sm:gap-14">
                                <div>
                                    <strong className="block text-3xl text-emerald-300">
                                        500+
                                    </strong>
                                    <span className="text-sm text-emerald-100/55">
                                        Learning paths
                                    </span>
                                </div>
                                <div>
                                    <strong className="block text-3xl text-emerald-300">
                                        10+
                                    </strong>
                                    <span className="text-sm text-emerald-100/55">
                                        Categories
                                    </span>
                                </div>
                                <div>
                                    <strong className="block text-3xl text-emerald-300">
                                        ∞
                                    </strong>
                                    <span className="text-sm text-emerald-100/55">
                                        Possible skills
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div
                            className="landing-orb-wrap relative mx-auto aspect-square w-full max-w-[620px]"
                            aria-hidden="true"
                        >
                            <div className="landing-orb absolute inset-[10%] rounded-full bg-emerald-400/20 blur-3xl" />
                            <div className="landing-orbit absolute inset-[8%] rounded-full border border-emerald-300/20" />
                            <div className="landing-orbit landing-orbit-two absolute inset-[18%] rounded-full border border-teal-300/15" />
                            <div className="absolute inset-[22%] rounded-[38%] border border-emerald-200/20 bg-gradient-to-br from-emerald-300/20 via-[#0c2b21]/70 to-[#071711]/90 shadow-[0_0_90px_rgba(52,211,153,.18)] backdrop-blur-sm" />
                            <div className="absolute top-[25%] left-[25%] h-20 w-20 rounded-3xl bg-emerald-300/20 blur-xl" />
                            <div className="absolute top-[30%] right-[22%] h-12 w-12 rounded-full bg-teal-300/60 blur-md" />
                            <div className="absolute bottom-[25%] left-[26%] h-8 w-8 rounded-full bg-lime-300/70 shadow-[0_0_25px_rgba(190,242,100,.8)]" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Target
                                    size={130}
                                    strokeWidth={0.7}
                                    className="text-emerald-200/75"
                                />
                            </div>
                            <div className="absolute bottom-[13%] left-[10%] rounded-2xl border border-emerald-200/15 bg-[#0c251e]/90 px-5 py-4 shadow-xl backdrop-blur-md">
                                <div className="mb-2 flex gap-1">
                                    <Check
                                        size={14}
                                        className="text-emerald-300"
                                    />
                                    <span className="text-xs text-emerald-100/60">
                                        Weekly progress
                                    </span>
                                </div>
                                <div className="h-2 w-32 overflow-hidden rounded-full bg-emerald-100/10">
                                    <div className="h-full w-4/5 rounded-full bg-emerald-300" />
                                </div>
                            </div>
                            <div className="absolute top-[16%] right-[7%] rounded-2xl border border-emerald-200/15 bg-[#0c251e]/90 px-5 py-4 shadow-xl backdrop-blur-md">
                                <Sparkles
                                    size={18}
                                    className="mb-2 text-lime-300"
                                />
                                <div className="text-sm font-semibold">
                                    Keep exploring
                                </div>
                                <div className="mt-1 text-xs text-emerald-100/50">
                                    Your next skill is waiting
                                </div>
                            </div>
                        </div>
                    </section>
                    <section
                        id="features"
                        className="border-y border-emerald-100/10 bg-[#081a15]/70"
                    >
                        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-5 lg:px-10">
                            {features.map(({ icon: Icon, title, text }) => (
                                <div
                                    key={title}
                                    className="flex items-center gap-4"
                                >
                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/5 text-emerald-300">
                                        <Icon size={22} />
                                    </span>
                                    <div>
                                        <h2 className="text-sm font-semibold">
                                            {title}
                                        </h2>
                                        <p className="mt-1 text-xs text-emerald-100/50">
                                            {text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section
                        id="how-it-works"
                        className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-10"
                    >
                        <p className="text-xs font-semibold tracking-[.2em] text-emerald-300 uppercase">
                            How it works
                        </p>
                        <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                            Start learning in 3 simple steps
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-emerald-100/60">
                            Go from a spark of an idea to meaningful progress in
                            just a few clicks.
                        </p>
                        <div className="mt-14 grid gap-6 text-left md:grid-cols-3">
                            {steps.map(
                                ({ icon: Icon, number, title, text }) => (
                                    <article
                                        key={number}
                                        className="relative rounded-2xl border border-emerald-100/10 bg-emerald-300/[.03] p-7 transition hover:-translate-y-1 hover:border-emerald-300/30"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-300">
                                                <Icon size={23} />
                                            </span>
                                            <span className="text-sm font-semibold text-emerald-300/50">
                                                {number}
                                            </span>
                                        </div>
                                        <h3 className="mt-8 text-xl font-semibold">
                                            {title}
                                        </h3>
                                        <p className="mt-3 leading-7 text-emerald-100/55">
                                            {text}
                                        </p>
                                    </article>
                                ),
                            )}
                        </div>
                    </section>
                    <section
                        id="paths"
                        className="mx-6 mb-20 rounded-3xl border border-emerald-300/15 bg-gradient-to-br from-emerald-400/10 to-transparent px-6 py-16 text-center sm:px-12 lg:mx-auto lg:max-w-7xl"
                    >
                        <p className="text-sm font-semibold text-emerald-300">
                            Your next chapter starts here
                        </p>
                        <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-bold tracking-tight">
                            Make learning feel like momentum.
                        </h2>
                        <Link
                            href={auth.user ? dashboard() : register()}
                            className="landing-button mt-8 inline-flex items-center gap-3 rounded-xl px-6 py-4 font-semibold text-[#04110d]"
                        >
                            Create your path <ArrowRight size={18} />
                        </Link>
                    </section>
                </main>
                <footer
                    id="about"
                    className="border-t border-emerald-100/10 px-6 py-8 text-center text-sm text-emerald-100/40"
                >
                    <span className="font-semibold text-emerald-100/70">
                        pathly
                    </span>
                    <span className="mx-2">·</span>Your learning, your path.
                </footer>
            </div>
        </>
    );
}
