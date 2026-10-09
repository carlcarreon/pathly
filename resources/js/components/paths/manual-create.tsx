import { useState } from 'react';
import { PenLine, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Milestone = { id: number; title: string; topics: string[] };
type ManualCreateProps = { onBack: () => void };

export function ManualCreate({ onBack }: ManualCreateProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [milestones, setMilestones] = useState<Milestone[]>([]);

    const addMilestone = () => setMilestones((items) => [...items, { id: Date.now(), title: '', topics: [''] }]);
    const updateMilestone = (id: number, title: string) => setMilestones((items) => items.map((item) => item.id === id ? { ...item, title } : item));
    const addTopic = (id: number) => setMilestones((items) => items.map((item) => item.id === id ? { ...item, topics: [...item.topics, ''] } : item));
    const updateTopic = (id: number, index: number, value: string) => setMilestones((items) => items.map((item) => {
        if (item.id !== id) return item;
        const topics = [...item.topics];
        topics[index] = value;
        return { ...item, topics };
    }));

    return (
        <div className="mx-auto w-full max-w-7xl px-4 pb-8 md:px-7">
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                        <PenLine size={18} />
                    </span>
                    <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">Create learning path</p>
                </div>
                <div className="mt-3">
                    <h1 className="text-3xl font-bold tracking-tight md:text-[36px]">Create a Learning Path Manually</h1>
                    <p className="mt-2 text-muted-foreground">Build your roadmap one milestone and topic at a time.</p>
                </div>
            </div>
            <div className="grid grid-cols-2 items-start gap-6">
                <div className="space-y-6">
                    <Card className="border-border/70 bg-card/70 shadow-none">
                        <CardHeader><CardTitle>Learning path details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <label className="block text-sm font-medium">Title<Input className="mt-2" placeholder="e.g. Learn Web Development" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
                            <label className="block text-sm font-medium">Description<textarea className="border-input placeholder:text-muted-foreground mt-2 min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50" placeholder="What do you want to achieve?" value={description} onChange={(e) => setDescription(e.target.value)} /></label>
                        </CardContent>
                    </Card>
                    {milestones.map((milestone, index) => (
                        <Card key={milestone.id} className="border-border/70 bg-card/70 shadow-none">
                            <CardHeader className="flex-row items-center justify-between space-y-0"><CardTitle>Milestone {index + 1}</CardTitle><Button variant="ghost" size="icon" onClick={() => setMilestones((items) => items.filter((item) => item.id !== milestone.id))}><Trash2 className="size-4" /></Button></CardHeader>
                            <CardContent className="space-y-4">
                                <Input placeholder="Milestone title" value={milestone.title} onChange={(e) => updateMilestone(milestone.id, e.target.value)} />
                                <div className="space-y-2"><p className="text-sm font-medium">Topics</p>{milestone.topics.map((topic, topicIndex) => <Input key={`${milestone.id}-${topicIndex}`} placeholder={`Topic ${topicIndex + 1}`} value={topic} onChange={(e) => updateTopic(milestone.id, topicIndex, e.target.value)} />)}<Button variant="outline" size="sm" onClick={() => addTopic(milestone.id)}><Plus className="size-4" /> Add topic</Button></div>
                            </CardContent>
                        </Card>
                    ))}
                    <Button variant="outline" className="w-full" onClick={addMilestone}><Plus className="size-4" /> Add milestone</Button>
                </div>
                <Card className="h-fit border-border/70 bg-card/70 shadow-none sticky top-6"><CardHeader><CardTitle>Review your path</CardTitle></CardHeader><CardContent><h2 className="text-lg font-semibold">{title || 'Untitled learning path'}</h2><p className="mt-2 text-sm text-muted-foreground">{description || 'Your description will appear here.'}</p><div className="mt-6 space-y-4">{milestones.length === 0 ? <p className="rounded-md border border-dashed p-5 text-center text-sm text-muted-foreground">Add a milestone to start building your roadmap.</p> : milestones.map((milestone, index) => <div key={milestone.id} className="border-l-2 border-emerald-300/60 pl-4"><p className="font-medium">{milestone.title || `Milestone ${index + 1}`}</p><p className="mt-1 text-sm text-muted-foreground">{milestone.topics.filter(Boolean).length} topics</p></div>)}</div></CardContent></Card>
            </div>
        </div>
    );
}
