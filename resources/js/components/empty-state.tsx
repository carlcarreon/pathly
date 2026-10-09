import type { LucideIcon } from 'lucide-react';

export function EmptyState({ icon: Icon, title, description, className = '' }: { icon: LucideIcon; title?: string; description: string; className?: string }) {
    return (
        <div className={`rounded-xl border border-dashed border-border/70 p-6 text-center ${className}`}>
            <Icon className="mx-auto size-8 text-emerald-300" />
            {title && <h2 className="mt-3 text-lg font-semibold">{title}</h2>}
            <p className="mt-3 text-sm text-muted-foreground">{description}</p>
        </div>
    );
}
