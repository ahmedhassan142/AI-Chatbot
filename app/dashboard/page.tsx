// app/dashboard/page.tsx - Add user info section
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building, DollarSign, TrendingUp, Calendar, Activity, User, Mail, Shield, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DashboardHomePage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    departments: 0,
    revenue: 0,
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchDashboardStats();
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'User'}! Here's what's happening.
          </p>
        </div>
        
        {user && (
          <div className="flex items-center gap-3 bg-card p-3 rounded-lg border">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span>{user.email}</span>
                <Badge variant={user.emailVerified ? "default" : "secondary"} className="text-xs">
                  {user.emailVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        
        {/* ... rest of your stats cards ... */}
      </div>

      {/* Quick Info Section */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Your Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Name:</span>
                </div>
                <p className="text-lg">{user.name}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">Email:</span>
                </div>
                <p className="text-lg">{user.email}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Role:</span>
                </div>
                <p className="text-lg capitalize">{user.role}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Status:</span>
                </div>
                <Badge 
                  variant={user.emailVerified ? "default" : "destructive"}
                  className="text-lg py-1"
                >
                  {user.emailVerified ? 'Active' : 'Pending Verification'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ... rest of your dashboard content ... */}
    </div>
  );
}