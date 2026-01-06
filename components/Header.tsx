'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Search, 
  User, 
  Menu, 
  LogOut, 
  LayoutDashboard, // Changed from Dashboard
  LogIn, 
  UserPlus,
  Settings 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
      if (token) {
        setIsLoggedIn(true);
        
        // Get user info from token or session storage
        const userData = sessionStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.name || 'User');
          setUserRole(user.role || 'User');
        }
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      });
      
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('userData');
      
      setIsLoggedIn(false);
      setUserName('');
      setUserRole('');
      
      router.push('/auth/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('userData');
      setIsLoggedIn(false);
      router.push('/auth/login');
    }
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleSignup = () => {
    router.push('/auth/register');
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  const handleProfile = () => {
    router.push('/dashboard/profile');
  };

  const handleSettings = () => {
    router.push('/dashboard/settings');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu size={20} />
          </Button>
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={isLoggedIn ? "Search conversations..." : "Search..."}
              className="pl-10 w-[300px]"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {isLoggedIn ? (
            // Logged in state - show notifications and profile dropdown
            <>
              <div className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                    3
                  </Badge>
                </Button>
              </div>

              {/* Dashboard button - visible on desktop */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDashboard}
                className="hidden md:flex items-center gap-2"
              >
                <LayoutDashboard size={16} /> {/* Updated */}
                Dashboard
              </Button>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full border">
                    <User size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userRole} • {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfile}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDashboard}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> {/* Updated */}
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSettings}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            // Not logged in state - show login/signup buttons
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogin}
                className="flex items-center gap-2"
              >
                <LogIn size={16} />
                Login
              </Button>
              
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSignup}
                className="flex items-center gap-2"
              >
                <UserPlus size={16} />
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile dashboard button (for logged in users) */}
      {isLoggedIn && (
        <div className="md:hidden border-t">
          <div className="container px-4 py-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDashboard}
              className="w-full justify-center gap-2"
            >
              <LayoutDashboard size={16} /> {/* Updated */}
              Go to Dashboard
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}