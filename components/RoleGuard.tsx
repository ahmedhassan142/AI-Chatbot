// components/RoleGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/context/Authcontext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: Array<'admin' | 'user'>;
  redirectTo?: string;
}

export default function RoleGuard({ 
  children, 
  allowedRoles = ['admin', 'user'],
  redirectTo = '/auth/login' 
}: RoleGuardProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
      } else if (user && !allowedRoles.includes(user.role)) {
        // User doesn't have required role, redirect to home
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}