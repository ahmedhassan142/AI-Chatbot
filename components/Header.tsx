// components/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Bell, 
  Search, 
  User, 
  Menu, 
  LogOut, 
  LayoutDashboard,
  ChevronDown,
  LogIn, 
  UserPlus,
  Settings,
  Home,
  Building,
  BarChart3,
  Calendar,
  MessageSquare,
  CreditCard,
  Contact,
  Zap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDashboardPage, setIsDashboardPage] = useState(false);

  // Check if current page is dashboard
  useEffect(() => {
    setIsDashboardPage(pathname?.startsWith('/dashboard') || false);
  }, [pathname]);

  // Check authentication status
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = sessionStorage.getItem('accessToken');
    const userData = sessionStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        clearAuth();
      }
    } else {
      clearAuth();
    }
  };

  const clearAuth = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userData');
    clearAuth();
    
    if (isDashboardPage) {
      window.location.href = '/auth/login';
    } else {
      router.push('/auth/login');
      router.refresh();
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

  const handleHome = () => {
    router.push('/');
  };

  const handleFeatures = () => {
    router.push('/features');
  };

  const handlePricing = () => {
    router.push('/pricing');
  };

  const handleContact = () => {
    router.push('/contact');
  };

  // Navigation items for app pages (Home, Features, Pricing, Contact)
  const appNavItems = [
    { name: 'Home', href: '/', icon: Home, onClick: handleHome },
    { name: 'Features', href: '/features', icon: Zap, onClick: handleFeatures },
    { name: 'Pricing', href: '/pricing', icon: CreditCard, onClick: handlePricing },
    { name: 'Contact', href: '/contact', icon: Contact, onClick: handleContact },
  ];

  // Navigation items for dashboard sidebar (shown in mobile sheet)
  const dashboardNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/dashboard/users', icon: User },
    { name: 'Departments', href: '/dashboard/departments', icon: Building },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
    { name: 'Chat', href: '/dashboard/chat', icon: MessageSquare },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  // If we're on a dashboard page, show a simplified header (the sidebar will have the main navigation)
  if (isDashboardPage) {
    return (
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6">
          {/* Mobile Menu Button for Dashboard */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden mr-4">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="flex h-16 items-center justify-center border-b px-4">
                  <h1 className="text-xl font-bold">ERP Dashboard</h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                  <div className="px-3 space-y-1">
                    {dashboardNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      
                      return (
                        <Button
                          key={item.name}
                          variant={isActive ? "secondary" : "ghost"}
                          className="w-full justify-start gap-3"
                          onClick={() => {
                            router.push(item.href);
                            // Close sheet after navigation
                            //@ts-ignore
                            document.querySelector('[data-state="open"]')?.click();
                          }}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Button>
                      );
                    })}
                  </div>
                </nav>

                {/* User Info */}
                {user && (
                  <div className="border-t p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex flex-1 items-center space-x-4">
            {/* Search - Only show on larger screens */}
            <div className="w-full max-w-sm hidden lg:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search dashboard..."
                  className="pl-10 bg-muted/50 border-none focus-visible:ring-0"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">{user?.name || 'User'}</span>
                    <span className="text-xs text-muted-foreground capitalize">{user?.role || 'User'}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex flex-col">
                    <span className="font-medium">{user?.name}</span>
                    <span className="text-sm text-muted-foreground">{user?.email}</span>
                    <Badge 
                      variant={user?.emailVerified ? "default" : "destructive"} 
                      className="mt-1 w-fit"
                    >
                      {user?.emailVerified ? 'Verified' : 'Not Verified'}
                    </Badge>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/')}>
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    );
  }

  // ========== LANDING PAGE HEADER (Non-dashboard pages) ==========
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Logo/Brand */}
          <Button 
            variant="ghost" 
            className="text-lg font-bold p-0 hover:bg-transparent"
            onClick={handleHome}
          >
            ERP System
          </Button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {appNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  onClick={item.onClick}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Search - Desktop only */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 w-[250px]"
            />
          </div>

          {isLoggedIn ? (
            // ========== LOGGED IN STATE ==========
            <>
              {/* Dashboard button - visible on desktop */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDashboard}
                className="hidden md:flex items-center gap-2"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  3
                </Badge>
              </Button>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full border">
                    {user?.name?.charAt(0) || 'U'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.role || 'User'} • {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDashboard}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
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

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user?.name || 'User'}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    
                    {/* App Navigation Links */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground px-2">Navigation</p>
                      {appNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        
                        return (
                          <Button
                            key={item.name}
                            variant={isActive ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2"
                            onClick={item.onClick}
                          >
                            <Icon size={16} />
                            {item.name}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <div className="pt-2 border-t space-y-1">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={handleDashboard}
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-2"
                        onClick={() => router.push('/dashboard/profile')}
                      >
                        <User size={16} />
                        Profile
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-2"
                        onClick={() => router.push('/dashboard/settings')}
                      >
                        <Settings size={16} />
                        Settings
                      </Button>
                      
                      <div className="pt-2">
                        <Button 
                          variant="destructive" 
                          className="w-full justify-start gap-2"
                          onClick={handleLogout}
                        >
                          <LogOut size={16} />
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            // ========== NOT LOGGED IN STATE ==========
            <>
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogin}
                  className="hidden sm:flex items-center gap-2"
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

              {/* Mobile Menu for non-logged in */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="sm:hidden">
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col gap-4">
                    {/* App Navigation Links */}
                    <div className="space-y-1">
                      <p className="font-medium px-2">Navigation</p>
                      {appNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        
                        return (
                          <Button
                            key={item.name}
                            variant={isActive ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2"
                            onClick={item.onClick}
                          >
                            <Icon size={16} />
                            {item.name}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <div className="pt-4 border-t space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={handleLogin}
                      >
                        <LogIn size={16} />
                        Login
                      </Button>
                      
                      <Button 
                        variant="default" 
                        className="w-full justify-start gap-2"
                        onClick={handleSignup}
                      >
                        <UserPlus size={16} />
                        Sign Up
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dashboard button for logged in users (outside dashboard) */}
      {isLoggedIn && !isDashboardPage && (
        <div className="md:hidden border-t">
          <div className="container px-4 py-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDashboard}
              className="w-full justify-center gap-2"
            >
              <LayoutDashboard size={16} />
              Go to Dashboard
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}