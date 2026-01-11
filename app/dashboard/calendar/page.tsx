// app/dashboard/calendar/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Input } from '../../../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Calendar as CalendarIcon,
  Plus,
  Filter,
  Clock,
  Users,
  MapPin,
  Video,
  Phone,
  Briefcase,
  GraduationCap,
  Heart,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'deadline' | 'event' | 'reminder';
  participants: string[];
  location?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Team Standup Meeting',
      description: 'Daily team synchronization',
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      startTime: '09:00',
      endTime: '09:30',
      type: 'meeting',
      participants: ['John Doe', 'Jane Smith', 'Bob Johnson'],
      location: 'Conference Room A',
      status: 'upcoming',
    },
    {
      id: '2',
      title: 'Project Deadline',
      description: 'Q1 Project delivery deadline',
      date: new Date(new Date().setDate(new Date().getDate() + 3)),
      startTime: '17:00',
      endTime: '18:00',
      type: 'deadline',
      participants: ['Engineering Team'],
      status: 'upcoming',
    },
    {
      id: '3',
      title: 'Client Presentation',
      description: 'Quarterly review with ABC Corp',
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      startTime: '14:00',
      endTime: '15:30',
      type: 'meeting',
      participants: ['Sales Team', 'Alex Johnson'],
      location: 'Virtual - Google Meet',
      status: 'upcoming',
    },
    {
      id: '4',
      title: 'Company All Hands',
      description: 'Monthly company-wide meeting',
      date: new Date(new Date().setDate(new Date().getDate() - 2)),
      startTime: '10:00',
      endTime: '11:30',
      type: 'event',
      participants: ['All Employees'],
      location: 'Main Auditorium',
      status: 'completed',
    },
    {
      id: '5',
      title: 'Training Workshop',
      description: 'Advanced React Patterns',
      date: new Date(new Date().setDate(new Date().getDate() + 7)),
      startTime: '13:00',
      endTime: '16:00',
      type: 'event',
      participants: ['Engineering Team'],
      location: 'Training Room B',
      status: 'upcoming',
    },
  ]);

  const getEventTypeIcon = (type: string) => {
    const icons = {
      meeting: Users,
      deadline: Briefcase,
      event: GraduationCap,
      reminder: Heart,
    };
    const Icon = icons[type as keyof typeof icons];
    return <Icon className="h-4 w-4" />;
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      meeting: 'bg-blue-500/20 text-blue-700 border-blue-300',
      deadline: 'bg-red-500/20 text-red-700 border-red-300',
      event: 'bg-green-500/20 text-green-700 border-green-300',
      reminder: 'bg-purple-500/20 text-purple-700 border-purple-300',
    };
    return colors[type as keyof typeof colors];
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      upcoming: 'bg-yellow-500/20 text-yellow-700',
      ongoing: 'bg-blue-500/20 text-blue-700',
      completed: 'bg-green-500/20 text-green-700',
      cancelled: 'bg-red-500/20 text-red-700',
    };
    return (
      <Badge variant="outline" className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const upcomingEvents = events
    .filter(event => event.status === 'upcoming')
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your schedule and upcoming events
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={view} onValueChange={(value: any) => setView(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <AddEventForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              className="rounded-md border"
            />
            
            {/* Events for selected date */}
            <div className="mt-6">
              <h3 className="font-semibold mb-4">
                Events for {format(date, 'MMMM d, yyyy')}
              </h3>
              {getEventsForDate(date).length > 0 ? (
                <div className="space-y-3">
                  {getEventsForDate(date).map(event => (
                    <div key={event.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                            {getEventTypeIcon(event.type)}
                          </div>
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                        </div>
                        {getStatusBadge(event.status)}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{event.participants.length} participants</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-6">No events scheduled for this date</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">{event.description}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline" className="gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {format(event.date, 'MMM d')}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {event.startTime}
                    </Badge>
                    {event.location?.includes('Virtual') ? (
                      <Badge variant="outline" className="gap-1">
                        <Video className="h-3 w-3" />
                        Virtual
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <MapPin className="h-3 w-3" />
                        In-person
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {event.participants.slice(0, 3).map((participant, index) => (
                        <div
                          key={index}
                          className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs border-2 border-background"
                        >
                          {participant.charAt(0)}
                        </div>
                      ))}
                      {event.participants.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                          +{event.participants.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Types Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Event Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Meetings</p>
                <p className="text-sm text-muted-foreground">Team syncs & discussions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Briefcase className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium">Deadlines</p>
                <p className="text-sm text-muted-foreground">Project milestones</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 rounded-lg bg-green-500/20">
                <GraduationCap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Events</p>
                <p className="text-sm text-muted-foreground">Workshops & trainings</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Heart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Reminders</p>
                <p className="text-sm text-muted-foreground">Personal reminders</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AddEventForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    type: 'meeting',
    participants: [] as string[],
    location: '',
    status: 'upcoming',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Event Title</label>
        <Input
          placeholder="Team Meeting"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input
          placeholder="Weekly team synchronization"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Input
            type="date"
            value={formData.date.toISOString().split('T')[0]}
            onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start</label>
            <Input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">End</label>
            <Input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Event Type</label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="reminder">Reminder</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Location</label>
        <Input
          placeholder="Conference Room A or Google Meet link"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Participants</label>
        <Input
          placeholder="Enter participant emails (comma separated)"
          onChange={(e) => setFormData({ ...formData, participants: e.target.value.split(',').map(p => p.trim()) })}
        />
      </div>
      <Button type="submit" className="w-full">
        <CheckCircle className="mr-2 h-4 w-4" />
        Create Event
      </Button>
    </form>
  );
}