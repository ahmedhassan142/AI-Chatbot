'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plus,
  Calendar,
  Clock,
  User,
  Flag,
  CheckCircle,
  Circle,
  AlertCircle,
  FileText,
  MoreVertical,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  department: string;
  dueDate: string;
  createdAt: string;
  tags: string[];
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      todo: { label: 'To Do', color: 'bg-gray-500/20 text-gray-700' },
      in_progress: { label: 'In Progress', color: 'bg-blue-500/20 text-blue-700' },
      review: { label: 'Review', color: 'bg-yellow-500/20 text-yellow-700' },
      completed: { label: 'Completed', color: 'bg-green-500/20 text-green-700' },
      blocked: { label: 'Blocked', color: 'bg-red-500/20 text-red-700' },
    };
    
    const current = config[status as keyof typeof config];
    
    return (
      <Badge variant="outline" className={current.color}>
        {current.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const config = {
      low: { label: 'Low', color: 'bg-gray-500/20 text-gray-700' },
      medium: { label: 'Medium', color: 'bg-blue-500/20 text-blue-700' },
      high: { label: 'High', color: 'bg-orange-500/20 text-orange-700' },
      critical: { label: 'Critical', color: 'bg-red-500/20 text-red-700' },
    };
    
    const current = config[priority as keyof typeof config];
    
    return (
      <Badge variant="outline" className={current.color}>
        {current.label}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <Circle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'review':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'blocked':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    review: tasks.filter(t => t.status === 'review'),
    completed: tasks.filter(t => t.status === 'completed'),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
          <p className="text-muted-foreground">
            Track and manage team tasks and projects
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <AddTaskForm onSuccess={fetchTasks} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">To Do</p>
                <p className="text-2xl font-bold">{tasksByStatus.todo.length}</p>
              </div>
              <div className="p-3 bg-gray-500/20 rounded-lg">
                <Circle className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{tasksByStatus.in_progress.length}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Review</p>
                <p className="text-2xl font-bold">{tasksByStatus.review.length}</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{tasksByStatus.completed.length}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Board */}
      <Tabs defaultValue="board" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="board">Board View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="board" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
              <Card key={status} className="min-h-[500px]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      <CardTitle className="text-lg capitalize">
                        {status.replace('_', ' ')}
                      </CardTitle>
                    </div>
                    <Badge variant="outline">{statusTasks.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {statusTasks.map(task => (
                      <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <h3 className="font-semibold">{task.title}</h3>
                              {getPriorityBadge(task.priority)}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>
                                    {task.assignedTo?.name?.charAt(0) || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs">
                                  {task.assignedTo?.name || 'Unassigned'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {formatDate(task.dueDate)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="list">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-muted">
                        {getStatusIcon(task.status)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{task.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {task.description.substring(0, 60)}...
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{task.assignedTo?.name || 'Unassigned'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm capitalize">{task.priority}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(task.dueDate)}</span>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AddTaskForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignedTo: '',
    department: '',
    dueDate: '',
    tags: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
        setFormData({
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          assignedTo: '',
          department: '',
          dueDate: '',
          tags: [],
        });
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Task Title</label>
        <input
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter task title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Describe the task..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Priority</label>
          <select
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Department</label>
          <select
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          >
            <option value="">Select Department</option>
            <option value="sales">Sales</option>
            <option value="support">Support</option>
            <option value="engineering">Engineering</option>
            <option value="hr">HR</option>
            <option value="finance">Finance</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Due Date</label>
          <input
            type="date"
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        Create Task
      </Button>
    </form>
  );
}