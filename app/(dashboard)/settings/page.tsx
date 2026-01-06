'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Save, RefreshCw, Bell, Shield, Globe, Keyboard, Palette } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    apiKey: '',
    model: 'grok-2-mini',
    temperature: 0.7,
    maxTokens: 1000,
    enableNotifications: true,
    enableStreaming: true,
    darkMode: true,
    language: 'en',
    systemPrompt: 'You are a helpful AI assistant with a touch of wit and humor.',
  });

  const models = [
    { value: 'grok-2', label: 'Grok 2 (Most capable)' },
    { value: 'grok-2-mini', label: 'Grok 2 Mini (Fast & efficient)' },
    { value: 'grok-beta', label: 'Grok Beta (Latest features)' },
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'ja', label: 'Japanese' },
  ];

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Add API call to save settings
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Customize your AI chatbot experience</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* API Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                API Configuration
              </CardTitle>
              <CardDescription>Configure your Grok API settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your Grok API key"
                  value={settings.apiKey}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="model">AI Model</Label>
                  <Select
                    value={settings.model}
                    onValueChange={(value:any) => setSettings({ ...settings, model: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value:any) => setSettings({ ...settings, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Behavior */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                AI Behavior
              </CardTitle>
              <CardDescription>Customize how the AI responds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  placeholder="Define the AI's personality and behavior..."
                  value={settings.systemPrompt}
                  onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Temperature: {settings.temperature.toFixed(1)}</Label>
                    <span className="text-sm text-muted-foreground">
                      {settings.temperature < 0.5 ? 'More focused' : 
                       settings.temperature < 0.8 ? 'Balanced' : 'More creative'}
                    </span>
                  </div>
                  <Slider
                    value={[settings.temperature]}
                    onValueChange={([value]) => setSettings({ ...settings, temperature: value })}
                    max={1}
                    step={0.1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Tokens: {settings.maxTokens}</Label>
                  <Slider
                    value={[settings.maxTokens]}
                    onValueChange={([value]) => setSettings({ ...settings, maxTokens: value })}
                    max={2000}
                    step={100}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts for new messages</p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Streaming Responses</Label>
                  <p className="text-sm text-muted-foreground">Show responses as they're generated</p>
                </div>
                <Switch
                  checked={settings.enableStreaming}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableStreaming: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Use dark theme</p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Shortcuts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Keyboard Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { key: '⌘ + N', action: 'New chat' },
                { key: '⌘ + K', action: 'Command palette' },
                { key: '⌘ + Enter', action: 'Send message' },
                { key: 'Esc', action: 'Clear input' },
                { key: '⌘ + /', action: 'Toggle sidebar' },
              ].map((shortcut) => (
                <div key={shortcut.key} className="flex justify-between items-center">
                  <span className="text-sm">{shortcut.action}</span>
                  <kbd className="px-2 py-1 text-xs border rounded bg-muted">{shortcut.key}</kbd>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
              <Button variant="outline" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                Clear All Conversations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}