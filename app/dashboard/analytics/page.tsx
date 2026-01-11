// app/dashboard/analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Download,
  Filter,
  Calendar,
  Target,
  PieChart,
  LineChart,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);

  // Revenue Data
  const revenueData = [
    { month: 'Jan', revenue: 4000, expenses: 2400 },
    { month: 'Feb', revenue: 3000, expenses: 1398 },
    { month: 'Mar', revenue: 9800, expenses: 2000 },
    { month: 'Apr', revenue: 3908, expenses: 2780 },
    { month: 'May', revenue: 4800, expenses: 1890 },
    { month: 'Jun', revenue: 3800, expenses: 2390 },
    { month: 'Jul', revenue: 4300, expenses: 3490 },
  ];

  // User Growth Data
  const userGrowthData = [
    { month: 'Jan', users: 400 },
    { month: 'Feb', users: 700 },
    { month: 'Mar', users: 1100 },
    { month: 'Apr', users: 1500 },
    { month: 'May', users: 1800 },
    { month: 'Jun', users: 2200 },
    { month: 'Jul', users: 2500 },
  ];

  // Department Distribution
  const departmentData = [
    { name: 'Engineering', value: 45, color: '#3b82f6' },
    { name: 'Sales', value: 28, color: '#10b981' },
    { name: 'Marketing', value: 22, color: '#8b5cf6' },
    { name: 'HR', value: 18, color: '#ec4899' },
    { name: 'Finance', value: 15, color: '#f59e0b' },
    { name: 'Support', value: 35, color: '#6366f1' },
  ];

  // KPI Metrics
  const kpiData = [
    {
      title: 'Total Revenue',
      value: '$124,580',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Active Users',
      value: '2,458',
      change: '+8.2%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Conversion Rate',
      value: '4.7%',
      change: '+1.2%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Avg. Session',
      value: '4m 32s',
      change: '-0.5%',
      icon: Activity,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
    },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Insights and performance metrics for your organization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last quarter</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                    <Icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                  <div className={`text-sm font-medium ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="departments" className="gap-2">
            <PieChart className="h-4 w-4" />
            Departments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Monthly revenue and expenses comparison</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly active user growth trend</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
              <CardDescription>Employee distribution across departments</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={
                      ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Teams</CardTitle>
            <CardDescription>Teams with highest productivity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { team: 'Engineering', productivity: 92, growth: '+12%' },
                { team: 'Sales', productivity: 87, growth: '+8%' },
                { team: 'Marketing', productivity: 78, growth: '+15%' },
                { team: 'Support', productivity: 74, growth: '+5%' },
                { team: 'HR', productivity: 68, growth: '+3%' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{item.team}</p>
                      <p className="text-sm text-muted-foreground">{item.growth}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{item.productivity}%</p>
                    <p className="text-sm text-muted-foreground">Productivity</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
            <CardDescription>Current project completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { project: 'ERP Implementation', progress: 85, status: 'On Track' },
                { project: 'Mobile App V2', progress: 65, status: 'Delayed' },
                { project: 'Website Redesign', progress: 92, status: 'Completed' },
                { project: 'Data Migration', progress: 45, status: 'In Progress' },
                { project: 'Security Audit', progress: 30, status: 'Planning' },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.project}</span>
                    <span className={`text-sm ${item.status === 'Delayed' ? 'text-red-600' : item.status === 'Completed' ? 'text-green-600' : 'text-blue-600'}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.progress > 80 ? 'bg-green-500' : item.progress > 50 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {item.progress}% complete
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}