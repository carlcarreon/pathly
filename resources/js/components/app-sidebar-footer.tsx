import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export function AppSidebarFooter() {
    const { url } = usePage();
    const isManual = url.includes('/paths/create/manual-create');
    const isAi = url.includes('/paths/create/generate-with-ai');
    const isCreatePath = isManual || isAi;

    if (!isCreatePath) {
        return null;
    }

    return (
        <footer className="flex min-h-20 shrink-0 items-center justify-between gap-4 border-t border-sidebar-border/50 bg-background px-6 pt-3 pb-5 md:px-8">
            <Button variant="secondary" size="lg" className="h-11 min-w-28 px-5 text-lg" asChild>
                <Link href="/paths/create">Back</Link>
            </Button>
            <Button size="lg" className="h-11 min-w-40 px-5 text-lg bg-emerald-300 text-emerald-950 hover:bg-emerald-200" asChild>
                <Link href={isAi ? '/paths/create/generate-with-ai' : '/paths/create/manual-create'}>
                    {isAi ? 'Generate' : 'Create path'}
                </Link>
            </Button>
        </footer>
    );
}
