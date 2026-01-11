// app/dashboard/reports/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  FileText,
  Download,
  Users,
  Eye,
  Share2,
  Calendar,
  Filter,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'financial' | 'performance' | 'analytics' | 'audit';
  status: 'generated' | 'pending' | 'failed';
  createdAt: string;
  updatedAt: string;
  size: string;
  format: 'pdf' | 'excel' | 'csv';
  downloads: number;
  author: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockReports: Report[] = [
        {
          id: '1',
          title: 'Q1 2024 Financial Report',
          description: 'Quarterly financial performance and revenue analysis',
          type: 'financial',
          status: 'generated',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          size: '2.4 MB',
          format: 'pdf',
          downloads: 124,
          author: 'Finance Department',
        },
        {
          id: '2',
          title: 'Monthly Sales Performance',
          description: 'Sales metrics and conversion rates for January',
          type: 'performance',
          status: 'generated',
          createdAt: '2024-01-10T14:20:00Z',
          updatedAt: '2024-01-10T14:20:00Z',
          size: '1.8 MB',
          format: 'excel',
          downloads: 89,
          author: 'Sales Team',
        },
        {
          id: '3',
          title: 'User Engagement Analytics',
          description: 'Platform usage and user behavior insights',
          type: 'analytics',
          status: 'pending',
          createdAt: '2024-01-14T09:15:00Z',
          updatedAt: '2024-01-14T09:15:00Z',
          size: '3.2 MB',
          format: 'pdf',
          downloads: 0,
          author: 'Analytics Team',
        },
        {
          id: '4',
          title: 'System Security Audit',
          description: 'Security assessment and vulnerability report',
          type: 'audit',
          status: 'generated',
          createdAt: '2024-01-05T11:45:00Z',
          updatedAt: '2024-01-05T11:45:00Z',
          size: '4.1 MB',
          format: 'pdf',
          downloads: 56,
          author: 'Security Team',
        },
        {
          id: '5',
          title: 'Marketing Campaign ROI',
          description: 'Return on investment for Q4 marketing campaigns',
          type: 'financial',
          status: 'failed',
          createdAt: '2024-01-12T16:30:00Z',
          updatedAt: '2024-01-12T16:30:00Z',
          size: '0 MB',
          format: 'csv',
          downloads: 0,
          author: 'Marketing Department',
        },
        {
          id: '6',
          title: 'Employee Performance Review',
          description: 'Quarterly employee performance metrics',
          type: 'performance',
          status: 'generated',
          createdAt: '2024-01-08T13:20:00Z',
          updatedAt: '2024-01-08T13:20:00Z',
          size: '2.1 MB',
          format: 'pdf',
          downloads: 67,
          author: 'HR Department',
        },
      ];
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(search.toLowerCase()) ||
      report.description.toLowerCase().includes(search.toLowerCase()) ||
      report.author.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeBadge = (type: string) => {
    const colors = {
      financial: 'bg-green-500/20 text-green-700',
      performance: 'bg-blue-500/20 text-blue-700',
      analytics: 'bg-purple-500/20 text-purple-700',
      audit: 'bg-amber-500/20 text-amber-700',
    };
    
    return (
      <Badge variant="outline" className={colors[type as keyof typeof colors]}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === 'generated') {
      return (
        <Badge className="bg-green-500/20 text-green-700 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Generated
        </Badge>
      );
    }
    if (status === 'pending') {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-300">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-500/20 text-red-700 border-red-300">
        <AlertCircle className="h-3 w-3 mr-1" />
        Failed
      </Badge>
    );
  };

  const getFormatIcon = (format: string) => {
    const icons = {
      pdf: FileText,
      excel: TrendingUp,
      csv: BarChart3,
    };
    const Icon = icons[format as keyof typeof icons];
    return <Icon className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and manage analytical reports ({filteredReports.length} reports)
          </p>
        </div>
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="audit">Audit</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="generated">Generated</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="popular">Most Downloaded</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReports.map(report => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {getFormatIcon(report.format)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        <CardDescription>{report.description}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(report.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {getTypeBadge(report.type)}
                    <Badge variant="outline" className="gap-1">
                      {getFormatIcon(report.format)}
                      {report.format.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {report.size}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Author</p>
                      <p className="text-muted-foreground">{report.author}</p>
                    </div>
                    <div>
                      <p className="font-medium">Downloads</p>
                      <p className="text-muted-foreground">{report.downloads} downloads</p>
                    </div>
                    <div>
                      <p className="font-medium">Created</p>
                      <p className="text-muted-foreground">{formatDate(report.createdAt)}</p>
                    </div>
                    <div>
                      <p className="font-medium">Updated</p>
                      <p className="text-muted-foreground">{formatDate(report.updatedAt)}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Eye className="h-3 w-3" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Other tabs would show filtered reports */}
        <TabsContent value="recent">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Recent reports will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Generation Options */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Report Generation</CardTitle>
          <CardDescription>Generate common reports instantly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-6 flex-col gap-3">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <span className="font-medium">Sales Report</span>
              <span className="text-sm text-muted-foreground">Monthly sales performance</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex-col gap-3">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <span className="font-medium">User Analytics</span>
              <span className="text-sm text-muted-foreground">User engagement metrics</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex-col gap-3">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
              <span className="font-medium">Financial Summary</span>
              <span className="text-sm text-muted-foreground">Revenue and expenses</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}