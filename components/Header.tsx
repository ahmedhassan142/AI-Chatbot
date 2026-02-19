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
  Zap,
  X,
  Shield,
  UserCircle
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
  SheetClose,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '../../my-app/app/context/Authcontext';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, isUser, logout, isLoading } = useAuth();
  const [isDashboardPage, setIsDashboardPage] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if current page is dashboard
  useEffect(() => {
    setIsDashboardPage(pathname?.startsWith('/dashboard') || false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    router.push('/auth/login');
    setMobileMenuOpen(false);
  };

  const handleSignup = () => {
    router.push('/auth/register');
    setMobileMenuOpen(false);
  };

  const handleDashboard = () => {
    router.push('/dashboard');
    setMobileMenuOpen(false);
  };

  const handleProfile = () => {
    router.push('/profile');
    setMobileMenuOpen(false);
  };

  const handleSettings = () => {
    router.push('/settings');
    setMobileMenuOpen(false);
  };

  const handleHome = () => {
    router.push('/');
    setMobileMenuOpen(false);
  };

  const handleFeatures = () => {
    router.push('/features');
    setMobileMenuOpen(false);
  };

  const handlePricing = () => {
    router.push('/pricing');
    setMobileMenuOpen(false);
  };

  const handleContact = () => {
    router.push('/contact');
    setMobileMenuOpen(false);
  };

  const handleChat = () => {
    router.push('/chat');
    setMobileMenuOpen(false);
  };

  // Navigation items for all pages
  const mainNavItems = [
    { name: 'Home', href: '/', icon: Home, onClick: handleHome },
    { name: 'Features', href: '/features', icon: Zap, onClick: handleFeatures },
    { name: 'Pricing', href: '/pricing', icon: CreditCard, onClick: handlePricing },
    { name: 'Contact', href: '/contact', icon: Contact, onClick: handleContact },
    { name: 'AI Chat', href: '/chat', icon: MessageSquare, onClick: handleChat },
  ];

  // Determine if a nav item is active
  const isActive = (href: string) => pathname === href;

  // Get role badge color
  const getRoleBadge = () => {
    if (isAdmin) {
      return { color: 'bg-red-500/10 text-red-600 border-red-200', icon: Shield, text: 'Admin' };
    } else if (isUser) {
      return { color: 'bg-blue-500/10 text-blue-600 border-blue-200', icon: UserCircle, text: 'User' };
    }
    return { color: 'bg-gray-500/10 text-gray-600 border-gray-200', icon: UserCircle, text: 'Guest' };
  };

  const roleBadge = getRoleBadge();
  const RoleIcon = roleBadge.icon;

  // Get user display name safely
  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.name || user.email?.split('@')[0] || 'User';
  };

  // Get user email safely
  const getUserEmail = () => {
    if (!user) return '';
    return user.email || '';
  };

  // Get user avatar fallback
  const getUserAvatarFallback = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="text-lg font-bold">ERP System</div>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left section - Logo */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="text-lg font-bold p-0 hover:bg-transparent"
            onClick={handleHome}
          >
            ERP System
          </Button>
          
          {/* Dashboard Badge - Only show on dashboard pages */}
          {isDashboardPage && (
            <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
              Dashboard
            </Badge>
          )}

          {/* Role Badge - Show when logged in */}
          {isAuthenticated && (
            <Badge variant="outline" className={cn("hidden md:inline-flex", roleBadge.color)}>
              <RoleIcon className="h-3 w-3 mr-1" />
              {roleBadge.text}
            </Badge>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.name}
                variant={isActive(item.href) ? "secondary" : "ghost"}
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

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={isDashboardPage ? "Search dashboard..." : "Search..."}
              className="pl-10 w-[250px]"
            />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Notifications - Only for logged in users */}
          {isAuthenticated && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>
          )}

          {/* User Menu / Auth Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* Dashboard Button - Only for ADMIN users */}
              {isAdmin && (
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleDashboard}
                  className="gap-2 hidden md:flex"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              )}

              {/* Profile Dropdown - For ALL logged in users */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${getUserEmail()}`} />
                      <AvatarFallback>
                        {getUserAvatarFallback()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">{getUserDisplayName()}</span>
                      <span className="text-xs text-muted-foreground capitalize">{user?.role || 'User'}</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {getUserEmail()}
                      </p>
                      <Badge variant="outline" className={cn("mt-1 w-fit", roleBadge.color)}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {roleBadge.text}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Profile Link - For ALL users */}
                  <DropdownMenuItem onClick={handleProfile}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  
                  {/* Settings Link - For ALL users */}
                  <DropdownMenuItem onClick={handleSettings}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  
                  {/* Chat link for all users */}
                  <DropdownMenuItem onClick={handleChat}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    AI Chat
                  </DropdownMenuItem>
                  
                  {/* Dashboard Link - Additional dashboard link in dropdown for ADMIN users */}
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleDashboard}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Go to Dashboard
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  
                  {/* Main navigation in dropdown */}
                  <DropdownMenuItem onClick={handleHome}>
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleFeatures}>
                    <Zap className="mr-2 h-4 w-4" />
                    Features
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handlePricing}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pricing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleContact}>
                    <Contact className="mr-2 h-4 w-4" />
                    Contact
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogin}
                className="gap-2"
              >
                <LogIn size={16} />
                Login
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSignup}
                className="gap-2"
              >
                <UserPlus size={16} />
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              {/* Mobile menu content - same as before */}
              <div className="flex flex-col h-full">
                {/* Mobile Header with Close */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X size={20} />
                    </Button>
                  </SheetClose>
                </div>

                {/* User Info - Only if logged in */}
                {isAuthenticated && user && (
                  <div className="flex items-center gap-3 py-4 border-b">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {getUserAvatarFallback()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{getUserDisplayName()}</p>
                      <p className="text-sm text-muted-foreground">{getUserEmail()}</p>
                      <Badge variant="outline" className={cn("mt-1", roleBadge.color)}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {roleBadge.text}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Mobile Navigation Links */}
                <div className="flex-1 overflow-y-auto py-4">
                  {/* Main Navigation */}
                  <div className="space-y-1 mb-4">
                    <p className="text-sm font-medium text-muted-foreground px-2 mb-2">
                      Navigation
                    </p>
                    {mainNavItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.name}
                          variant={isActive(item.href) ? "secondary" : "ghost"}
                          className="w-full justify-start gap-3"
                          onClick={() => {
                            item.onClick();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <Icon className="h-5 w-5" />
                          {item.name}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Dashboard Section - Only for ADMIN users */}
                  {isAuthenticated && isAdmin && (
                    <div className="space-y-1 pt-4 border-t">
                      <p className="text-sm font-medium text-muted-foreground px-2 mb-2">
                        Admin
                      </p>
                      <Button
                        variant={isActive('/dashboard') ? "secondary" : "ghost"}
                        className="w-full justify-start gap-3"
                        onClick={() => {
                          handleDashboard();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                      </Button>
                    </div>
                  )}

                  {/* Profile Section - For ALL logged in users */}
                  {isAuthenticated && (
                    <div className="space-y-1 pt-4 border-t">
                      <p className="text-sm font-medium text-muted-foreground px-2 mb-2">
                        Account
                      </p>
                      <Button
                        variant={isActive('/profile') ? "secondary" : "ghost"}
                        className="w-full justify-start gap-3"
                        onClick={() => {
                          handleProfile();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <User className="h-5 w-5" />
                        Profile
                      </Button>
                      <Button
                        variant={isActive('/settings') ? "secondary" : "ghost"}
                        className="w-full justify-start gap-3"
                        onClick={() => {
                          handleSettings();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <Settings className="h-5 w-5" />
                        Settings
                      </Button>
                    </div>
                  )}

                  {/* Auth buttons for non-logged in users on mobile */}
                  {!isAuthenticated && (
                    <div className="pt-4 border-t space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => {
                          handleLogin();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogIn size={16} />
                        Login
                      </Button>
                      
                      <Button 
                        variant="default" 
                        className="w-full justify-start gap-2"
                        onClick={() => {
                          handleSignup();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <UserPlus size={16} />
                        Sign Up
                      </Button>
                    </div>
                  )}

                  {/* Logout button for logged in users */}
                  {isAuthenticated && (
                    <div className="pt-4 border-t">
                      <Button 
                        variant="destructive" 
                        className="w-full justify-start gap-2"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Dashboard indicator */}
      {isDashboardPage && (
        <div className="md:hidden bg-muted/30 px-4 py-1 text-xs text-muted-foreground border-t flex items-center justify-between">
          <span className="flex items-center gap-1">
            <LayoutDashboard className="h-3 w-3" />
            Dashboard Mode
          </span>
          {isAdmin && (
            <Badge variant="outline" className="text-xs bg-red-500/10">
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </Badge>
          )}
        </div>
      )}
    </header>
  );
}