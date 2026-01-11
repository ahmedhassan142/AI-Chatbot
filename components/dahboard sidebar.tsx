// components/dashboard/Sidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Users,
  Building,
  BarChart3,
  FileText,
  Settings,
  Calendar,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Departments', href: '/dashboard/departments', icon: Building },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  { name: 'Chat', href: '/dashboard/chat', icon: MessageSquare },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const bottomItems = [
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
  { name: 'Admin Panel', href: '/admin', icon: Shield },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userData');
    router.push('/auth/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen bg-background border-r transition-all duration-300",
        isCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0 w-64",
        "lg:relative lg:z-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo & Toggle */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            {!isCollapsed && (
              <h1 className="text-xl font-bold truncate">ERP Dashboard</h1>
            )}
            {isCollapsed && (
              <div className="mx-auto">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">E</span>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                    {isCollapsed && isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="px-3 mt-6 space-y-1">
              {bottomItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted",
                      "text-muted-foreground hover:text-foreground"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Info */}
          {user && (
            <div className="border-t p-4">
              <div className={cn(
                "flex items-center gap-3",
                isCollapsed && "justify-center"
              )}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                  <AvatarFallback>
                    {user.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <div className="flex items-center gap-1">
                      <Badge 
                        variant={user.emailVerified ? "default" : "secondary"} 
                        className="text-xs px-1 py-0 h-4"
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
              
              {!isCollapsed && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3 justify-start gap-2 text-muted-foreground hover:text-foreground"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              )}
              
              {isCollapsed && (
                <div className="flex justify-center mt-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={handleLogout}
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}