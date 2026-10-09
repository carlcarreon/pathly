import {
    ArrowRight,
    BarChart3,
    BookOpen,
    Code2,
    Dumbbell,
    Gauge,
    Lightbulb,
    Network,
    Search,
    Sparkles,
    Target,
    Utensils,
    Video,
    WandSparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import type { CreatePathInput } from '@/types/paths';

const examples = [
    {
        icon: Code2,
        title: 'Learn Laravel',
        detail: 'Complete beginner, 12 weeks',
    },
    { icon: Network, title: 'Learn Japanese', detail: 'Beginner, 8 weeks' },
    { icon: Video, title: 'Learn Photography', detail: 'Beginner, 8 weeks' },
    { icon: Gauge, title: 'Learn UI/UX Design', detail: 'Beginner, 10 weeks' },
    {
        icon: BarChart3,
        title: 'Learn Data Science',
        detail: 'Beginner, 12 weeks',
    },
    { icon: Utensils, title: 'Learn Cooking', detail: 'Beginner, 6 weeks' },
];

export function CreatePathForm({
    input,
    isGenerating,
    message,
    onChange,
    onGenerate,
}: {
    input: CreatePathInput;
    isGenerating: boolean;
    message: string;
    onChange: (input: CreatePathInput) => void;
    onGenerate: () => void;
}) {
    const setPreference = (
        key: keyof CreatePathInput['preferences'],
        value: boolean,
    ) =>
        onChange({
            ...input,
            preferences: { ...input.preferences, [key]: value },
        });

    return (
        <section className="h-full">
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                        <WandSparkles size={18} />
                    </span>
                    <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
                        Create learning path
                    </p>
                </div>
                <div className="mt-3">
                    <h1 className="text-3xl font-bold tracking-tight md:text-[36px] md:whitespace-nowrap">
                        Generate a Learning Path with AI
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Tell us what you want to learn and let AI create a
                        personalized roadmap for you.
                    </p>
                </div>
            </div>

            <Card className="border-border/70 bg-card/70 py-4 shadow-none">
                <CardContent className="space-y-6 px-4">
                    <div className="space-y-2">
                        <Label htmlFor="topic">
                            What do you want to learn?
                        </Label>
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="topic"
                                value={input.topic}
                                onChange={(event) =>
                                    onChange({
                                        ...input,
                                        topic: event.target.value,
                                    })
                                }
                                className="h-11 pl-10"
                                placeholder="e.g. Japanese Language"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Be specific for better results. Example: “Japanese
                            Language”, “Web Development”, “Photography”
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>What’s your current level?</Label>
                            <Select
                                value={input.level}
                                onValueChange={(level) =>
                                    onChange({ ...input, level })
                                }
                            >
                                <SelectTrigger className="h-11 w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="beginner">
                                        Beginner
                                    </SelectItem>
                                    <SelectItem value="intermediate">
                                        Intermediate
                                    </SelectItem>
                                    <SelectItem value="advanced">
                                        Advanced
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Target duration</Label>
                            <Select
                                value={input.duration}
                                onValueChange={(duration) =>
                                    onChange({ ...input, duration })
                                }
                            >
                                <SelectTrigger className="h-11 w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="4">4 weeks</SelectItem>
                                    <SelectItem value="8">8 weeks</SelectItem>
                                    <SelectItem value="12">12 weeks</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>
                            Additional preferences{' '}
                            <span className="font-normal text-muted-foreground">
                                (optional)
                            </span>
                        </Label>
                        <div className="grid gap-2 sm:grid-cols-3">
                            <PreferenceToggle
                                icon={Target}
                                pressed={input.preferences.practical}
                                onPressedChange={(value) =>
                                    setPreference('practical', value)
                                }
                            >
                                Focus on practical skills
                            </PreferenceToggle>
                            <PreferenceToggle
                                icon={BookOpen}
                                pressed={input.preferences.resources}
                                onPressedChange={(value) =>
                                    setPreference('resources', value)
                                }
                            >
                                Include resources
                            </PreferenceToggle>
                            <PreferenceToggle
                                icon={Dumbbell}
                                pressed={input.preferences.exercises}
                                onPressedChange={(value) =>
                                    setPreference('exercises', value)
                                }
                            >
                                Include exercises
                            </PreferenceToggle>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={onGenerate}
                        disabled={isGenerating || input.topic.trim() === ''}
                        className="h-11 w-full bg-emerald-300 text-emerald-950 hover:bg-emerald-200"
                    >
                        <Sparkles size={17} />
                        {isGenerating ? message : 'Generate Learning Path'}
                        <ArrowRight size={17} />
                    </Button>
                </CardContent>
            </Card>

            <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 font-semibold">
                        <Lightbulb className="size-4 text-amber-400" />
                        Example prompts
                    </h2>
                    <Button
                        variant="link"
                        size="sm"
                        className="text-emerald-400"
                    >
                        View more
                    </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {examples.map(({ icon: Icon, title, detail }) => (
                        <button
                            type="button"
                            key={title}
                            onClick={() =>
                                onChange({
                                    ...input,
                                    topic: title.replace('Learn ', ''),
                                })
                            }
                            className="rounded-lg border border-border/70 bg-card/50 p-4 text-left transition hover:border-emerald-400/50 hover:bg-emerald-400/5"
                        >
                            <Icon className="mb-3 size-5 text-emerald-400" />
                            <p className="text-sm font-medium">{title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {detail}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

function PreferenceToggle({
    icon: Icon,
    children,
    pressed,
    onPressedChange,
}: {
    icon: typeof Target;
    children: React.ReactNode;
    pressed: boolean;
    onPressedChange: (pressed: boolean) => void;
}) {
    return (
        <Toggle
            pressed={pressed}
            onPressedChange={onPressedChange}
            variant="outline"
            className="h-11 justify-start gap-2 border-border/70 px-3 text-muted-foreground data-[state=on]:border-emerald-400 data-[state=on]:bg-emerald-400/10 data-[state=on]:text-emerald-300"
        >
            <Icon size={16} />
            {children}
        </Toggle>
    );
}
