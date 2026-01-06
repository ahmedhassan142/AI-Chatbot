import type { Metadata } from 'next';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

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
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 bg-gradient-to-b from-background to-muted/10">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}