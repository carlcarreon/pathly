import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function MetricCard({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: LucideIcon }) {
    return (
        <Card className="border-border/70 bg-card/60 py-2 shadow-none">
            <CardContent className="relative min-h-32 p-4">
                <Icon className="absolute top-4 right-4 size-5 text-emerald-300" />
                <p className="pr-10 text-sm text-muted-foreground">{label}</p>
                <strong className="mt-2 block text-3xl">{value}</strong>
                <p className="mt-1 text-xs text-emerald-300">↗ {note}</p>
            </CardContent>
        </Card>
    );
}
