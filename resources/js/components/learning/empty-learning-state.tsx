import { BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function EmptyLearningState() {
    return (
        <Card className="min-h-[420px] border-dashed border-border/70 bg-card/30 shadow-none">
            <CardContent className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                    <BookOpen size={26} />
                </span>
                <h2 className="mt-5 text-xl font-semibold">
                    No learning paths yet
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                    Create a personalized learning path to start building your
                    roadmap.
                </p>
            </CardContent>
        </Card>
    );
}
