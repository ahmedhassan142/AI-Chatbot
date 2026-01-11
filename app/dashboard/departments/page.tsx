// app/dashboard/departments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Progress } from '../../../components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import {
  Search,
  Building,
  Users,
  Target,
  TrendingUp,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  description: string;
  head: string;
  totalEmployees: number;
  activeProjects: number;
  budget: string;
  budgetUsage: number;
  location: string;
  email: string;
  phone: string;
  color: string;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockDepartments: Department[] = [
        {
          id: '1',
          name: 'Engineering',
          description: 'Software development and technical solutions',
          head: 'Alex Johnson',
          totalEmployees: 45,
          activeProjects: 12,
          budget: '$1.2M',
          budgetUsage: 75,
          location: 'Floor 5, Building A',
          email: 'engineering@company.com',
          phone: '+1 (555) 123-4567',
          color: 'bg-blue-500',
        },
        {
          id: '2',
          name: 'Sales',
          description: 'Customer acquisition and revenue generation',
          head: 'Sarah Miller',
          totalEmployees: 28,
          activeProjects: 8,
          budget: '$850K',
          budgetUsage: 62,
          location: 'Floor 3, Building A',
          email: 'sales@company.com',
          phone: '+1 (555) 234-5678',
          color: 'bg-green-500',
        },
        {
          id: '3',
          name: 'Marketing',
          description: 'Brand promotion and market research',
          head: 'Michael Chen',
          totalEmployees: 22,
          activeProjects: 15,
          budget: '$650K',
          budgetUsage: 85,
          location: 'Floor 4, Building A',
          email: 'marketing@company.com',
          phone: '+1 (555) 345-6789',
          color: 'bg-purple-500',
        },
        {
          id: '4',
          name: 'Human Resources',
          description: 'Talent management and employee relations',
          head: 'Jessica Williams',
          totalEmployees: 18,
          activeProjects: 5,
          budget: '$480K',
          budgetUsage: 45,
          location: 'Floor 2, Building A',
          email: 'hr@company.com',
          phone: '+1 (555) 456-7890',
          color: 'bg-pink-500',
        },
        {
          id: '5',
          name: 'Finance',
          description: 'Financial planning and accounting',
          head: 'Robert Davis',
          totalEmployees: 15,
          activeProjects: 3,
          budget: '$920K',
          budgetUsage: 38,
          location: 'Floor 1, Building A',
          email: 'finance@company.com',
          phone: '+1 (555) 567-8901',
          color: 'bg-amber-500',
        },
        {
          id: '6',
          name: 'Customer Support',
          description: 'Client assistance and service management',
          head: 'Lisa Anderson',
          totalEmployees: 35,
          activeProjects: 6,
          budget: '$720K',
          budgetUsage: 68,
          location: 'Floor 2, Building B',
          email: 'support@company.com',
          phone: '+1 (555) 678-9012',
          color: 'bg-indigo-500',
        },
      ];
      setDepartments(mockDepartments);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(search.toLowerCase()) ||
    dept.description.toLowerCase().includes(search.toLowerCase()) ||
    dept.head.toLowerCase().includes(search.toLowerCase())
  );

  const getBudgetColor = (usage: number) => {
    if (usage > 90) return 'bg-red-500';
    if (usage > 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">
            Manage organizational departments and teams
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Department</DialogTitle>
            </DialogHeader>
            <AddDepartmentForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search departments by name, description, or head..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map(dept => (
          <Card key={dept.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${dept.color} flex items-center justify-center`}>
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{dept.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Department Head */}
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {dept.head.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{dept.head}</p>
                  <p className="text-xs text-muted-foreground">Department Head</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xl font-bold">{dept.totalEmployees}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Employees</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xl font-bold">{dept.activeProjects}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Projects</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xl font-bold">{dept.budget}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Budget</p>
                </div>
              </div>

              {/* Budget Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget Usage</span>
                  <span className="font-medium">{dept.budgetUsage}%</span>
                </div>
                <Progress value={dept.budgetUsage} className={getBudgetColor(dept.budgetUsage)} />
              </div>

              {/* Contact Info */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span>{dept.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span>{dept.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>{dept.phone}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2 text-red-600 hover:text-red-700">
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AddDepartmentForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    head: '',
    budget: '',
    location: '',
    email: '',
    phone: '',
    color: 'bg-blue-500',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Department Name</label>
        <Input
          placeholder="Engineering"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input
          placeholder="Software development and technical solutions"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Department Head</label>
        <Input
          placeholder="John Doe"
          value={formData.head}
          onChange={(e) => setFormData({ ...formData, head: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Annual Budget</label>
          <Input
            placeholder="$1,000,000"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Input
            placeholder="Floor 5, Building A"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            placeholder="department@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <Input
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Color Theme</label>
        <div className="flex gap-2">
          {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500', 'bg-indigo-500'].map(color => (
            <button
              key={color}
              type="button"
              className={`h-8 w-8 rounded-full ${color} ${formData.color === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
              onClick={() => setFormData({ ...formData, color })}
            />
          ))}
        </div>
      </div>
      <Button type="submit" className="w-full">
        Create Department
      </Button>
    </form>
  );
}