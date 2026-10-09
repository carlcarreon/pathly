import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { AppSidebarFooter } from '@/components/app-sidebar-footer';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="flex h-svh min-h-0 min-w-0 flex-col overflow-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <main className="min-h-0 flex-1 overflow-y-auto overflow-x-clip">
                    {children}
                </main>
                <AppSidebarFooter />
            </AppContent>
        </AppShell>
    );
}
