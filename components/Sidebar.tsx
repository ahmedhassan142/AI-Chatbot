'use client';

import { useState } from 'react';
import { 
  MessageSquare, 
  Settings, 
  History, 
  Users, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/conversations', label: 'Conversations', icon: MessageSquare },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/pricing', label: 'Pricing', icon: CreditCard },
  { href: '/about', label: 'About', icon: Users },
  { href: '/help', label: 'Help', icon: HelpCircle },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={cn(
      "flex flex-col border-r bg-card transition-all duration-300 h-screen sticky top-0",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Grok AI
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      collapsed && "justify-center"
                    )}
                  >
                    <Icon size={20} />
                    {!collapsed && <span>{item.label}</span>}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-3">
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}