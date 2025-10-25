'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Layout, 
  Palette, 
  Bell, 
  Save, 
  Grid3X3,
  List,
  Monitor,
  Download,
  Upload,
  Trash2,
  Plus,
  Copy
} from 'lucide-react';
import { UserPreferences as UserPreferencesType, DEFAULT_PREFERENCES, LAYOUT_TEMPLATES, SavedView, CustomLayout } from '@/types/userPreferences';
import { toast } from 'sonner';

export function UserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferencesType>(DEFAULT_PREFERENCES);
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [customLayouts, setCustomLayouts] = useState<CustomLayout[]>([]);
  const [activeTab, setActiveTab] = useState('layout');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      // Load from localStorage or API
      const saved = localStorage.getItem('user-preferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences(parsed);
      }

      const savedViewsData = localStorage.getItem('saved-views');
      if (savedViewsData) {
        setSavedViews(JSON.parse(savedViewsData));
      }

      const customLayoutsData = localStorage.getItem('custom-layouts');
      if (customLayoutsData) {
        setCustomLayouts(JSON.parse(customLayoutsData));
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
      toast.error('Failed to load preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      localStorage.setItem('user-preferences', JSON.stringify(preferences));
      localStorage.setItem('saved-views', JSON.stringify(savedViews));
      localStorage.setItem('custom-layouts', JSON.stringify(customLayouts));
      toast.success('Preferences saved successfully');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast.error('Failed to save preferences');
    }
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    toast.info('Preferences reset to default');
  };

  const exportPreferences = () => {
    const data = {
      preferences,
      savedViews,
      customLayouts,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user-preferences.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importPreferences = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.preferences) setPreferences(data.preferences);
        if (data.savedViews) setSavedViews(data.savedViews);
        if (data.customLayouts) setCustomLayouts(data.customLayouts);
        toast.success('Preferences imported successfully');
      } catch {
        toast.error('Invalid preferences file');
      }
    };
    reader.readAsText(file);
  };

  const createSavedView = () => {
    const newView: SavedView = {
      id: `view_${Date.now()}`,
      name: `Custom View ${savedViews.length + 1}`,
      description: 'User created view',
      layout: preferences.layout.dashboardLayout === 'grid' 
        ? LAYOUT_TEMPLATES[0].layout 
        : LAYOUT_TEMPLATES[2].layout,
      filters: {
        instruments: ['NIFTY', 'BANKNIFTY'],
        timeRange: '1d',
        sectors: [],
        newsSources: [],
        sentimentRange: { min: -100, max: 100 }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSavedViews([...savedViews, newView]);
    toast.success('Saved view created');
  };

  const deleteSavedView = (id: string) => {
    setSavedViews(savedViews.filter(view => view.id !== id));
    toast.success('Saved view deleted');
  };

  const duplicateSavedView = (view: SavedView) => {
    const duplicated: SavedView = {
      ...view,
      id: `view_${Date.now()}`,
      name: `${view.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSavedViews([...savedViews, duplicated]);
    toast.success('Saved view duplicated');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Preferences</h2>
          <p className="text-gray-600">Customize your experience and save your favorite layouts</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportPreferences} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={savePreferences} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Preferences Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Layout Preferences */}
        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Dashboard Layout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Layout Style</label>
                  <Select 
                    value={preferences.layout.dashboardLayout} 
                    onValueChange={(value) => setPreferences(prev => ({
                      ...prev,
                      layout: { ...prev.layout, dashboardLayout: value as 'grid' | 'list' | 'compact' }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">
                        <div className="flex items-center gap-2">
                          <Grid3X3 className="h-4 w-4" />
                          Grid
                        </div>
                      </SelectItem>
                      <SelectItem value="list">
                        <div className="flex items-center gap-2">
                          <List className="h-4 w-4" />
                          List
                        </div>
                      </SelectItem>
                      <SelectItem value="compact">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          Compact
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Card Size</label>
                  <Select 
                    value={preferences.layout.cardSize} 
                    onValueChange={(value) => setPreferences(prev => ({
                      ...prev,
                      layout: { ...prev.layout, cardSize: value as 'small' | 'medium' | 'large' }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Show Advanced Metrics</label>
                  <p className="text-xs text-gray-500">Display additional technical indicators</p>
                </div>
                <Switch
                  checked={preferences.layout.showAdvancedMetrics}
                  onCheckedChange={(checked) => setPreferences(prev => ({
                    ...prev,
                    layout: { ...prev.layout, showAdvancedMetrics: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Collapse Sidebar</label>
                  <p className="text-xs text-gray-500">Start with sidebar collapsed</p>
                </div>
                <Switch
                  checked={preferences.layout.sidebarCollapsed}
                  onCheckedChange={(checked) => setPreferences(prev => ({
                    ...prev,
                    layout: { ...prev.layout, sidebarCollapsed: checked }
                  }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Saved Views */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Saved Views</CardTitle>
                <Button onClick={createSavedView} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New View
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savedViews.map((view) => (
                  <div key={view.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{view.name}</h4>
                      <p className="text-sm text-gray-600">{view.description}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {view.layout.sections.length} sections
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {view.filters.instruments.join(', ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => duplicateSavedView(view)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteSavedView(view.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {savedViews.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Layout className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No saved views yet</p>
                    <p className="text-sm">Create your first custom view</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Preferences */}
        <TabsContent value="display" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Display Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Theme</label>
                  <Select 
                    value={preferences.display.theme} 
                    onValueChange={(value) => setPreferences(prev => ({
                      ...prev,
                      display: { ...prev.display, theme: value as 'light' | 'dark' | 'system' }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Font Size</label>
                  <Select 
                    value={preferences.display.fontSize} 
                    onValueChange={(value) => setPreferences(prev => ({
                      ...prev,
                      display: { ...prev.display, fontSize: value as 'small' | 'medium' | 'large' }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Enable Animations</label>
                  <p className="text-xs text-gray-500">Smooth transitions and animations</p>
                </div>
                <Switch
                  checked={preferences.display.animations}
                  onCheckedChange={(checked) => setPreferences(prev => ({
                    ...prev,
                    display: { ...prev.display, animations: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">High Contrast</label>
                  <p className="text-xs text-gray-500">Enhanced contrast for better visibility</p>
                </div>
                <Switch
                  checked={preferences.display.highContrast}
                  onCheckedChange={(checked) => setPreferences(prev => ({
                    ...prev,
                    display: { ...prev.display, highContrast: checked }
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Preferences */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Refresh Interval (minutes)</label>
                  <Input
                    type="number"
                    value={preferences.data.refreshInterval}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      data: { ...prev.data, refreshInterval: parseInt(e.target.value) || 15 }
                    }))}
                    min="1"
                    max="60"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Default Instrument</label>
                  <Select 
                    value={preferences.data.defaultInstrument} 
                    onValueChange={(value) => setPreferences(prev => ({
                      ...prev,
                      data: { ...prev.data, defaultInstrument: value as 'NIFTY' | 'BANKNIFTY' }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NIFTY">NIFTY 50</SelectItem>
                      <SelectItem value="BANKNIFTY">BANK NIFTY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Auto Refresh</label>
                  <p className="text-xs text-gray-500">Automatically refresh data</p>
                </div>
                <Switch
                  checked={preferences.data.autoRefresh}
                  onCheckedChange={(checked) => setPreferences(prev => ({
                    ...prev,
                    data: { ...prev.data, autoRefresh: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Show Sentiment Scores</label>
                  <p className="text-xs text-gray-500">Display sentiment analysis scores</p>
                </div>
                <Switch
                  checked={preferences.data.showSentimentScores}
                  onCheckedChange={(checked) => setPreferences(prev => ({
                    ...prev,
                    data: { ...prev.data, showSentimentScores: checked }
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Preferences */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Push Notifications</label>
                    <p className="text-xs text-gray-500">Receive browser notifications</p>
                  </div>
                  <Switch
                    checked={preferences.notifications.enablePush}
                    onCheckedChange={(checked) => setPreferences(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, enablePush: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Bias Alerts</label>
                    <p className="text-xs text-gray-500">Notify when bias changes significantly</p>
                  </div>
                  <Switch
                    checked={preferences.notifications.biasAlerts}
                    onCheckedChange={(checked) => setPreferences(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, biasAlerts: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">News Alerts</label>
                    <p className="text-xs text-gray-500">Notify about important market news</p>
                  </div>
                  <Switch
                    checked={preferences.notifications.newsAlerts}
                    onCheckedChange={(checked) => setPreferences(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, newsAlerts: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Market Open</label>
                    <p className="text-xs text-gray-500">Notify when market opens</p>
                  </div>
                  <Switch
                    checked={preferences.notifications.marketOpen}
                    onCheckedChange={(checked) => setPreferences(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, marketOpen: checked }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-between">
        <Button onClick={resetPreferences} variant="outline">
          Reset to Default
        </Button>
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <Button variant="outline" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </span>
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={importPreferences}
              className="hidden"
            />
          </label>
          <Button onClick={savePreferences}>
            <Save className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
