// app/dashboard/layout.tsx
import type { Metadata } from 'next';
import RoleGuard from '../../components/RoleGuard';
import DashboardSidebar from '../../components/dahboard sidebar';

export const metadata: Metadata = {
  title: 'Dashboard - ERP AI System',
  description: 'ERP Dashboard with AI Assistant and Task Management',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 bg-gradient-to-b from-background to-muted/10">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
          <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
            <p>ERP Dashboard v1.0 • © {new Date().getFullYear()} All rights reserved</p>
          </footer>
        </div>
      </div>
    </RoleGuard>
  );
}