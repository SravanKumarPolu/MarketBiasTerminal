'use client';

import { useState } from 'react';
import { useMarketStore } from '@/store/marketStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, RefreshCw, AlertTriangle, Clock, Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { settings, updateSettings, setDataSource } = useMarketStore();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    setDataSource(localSettings.useLiveData);
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    setLocalSettings(settings);
    toast.info('Settings reset to current values');
  };

  const handleDataSourceChange = (useLive: boolean) => {
    setLocalSettings(prev => ({ ...prev, useLiveData: useLive }));
  };

  const handleThemeChange = (theme: string) => {
    setLocalSettings(prev => ({ ...prev, theme: theme as 'light' | 'dark' | 'system' }));
  };

  const handleDefaultInstrumentChange = (instrument: string) => {
    setLocalSettings(prev => ({ ...prev, defaultInstrument: instrument as 'NIFTY' | 'BANKNIFTY' }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Configure your trading preferences and data sources</p>
            </div>
          </div>

          {/* Data Source Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Data Source</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Use Live Data</div>
                  <div className="text-sm text-gray-600">
                    Toggle between live API data and mock data for testing
                  </div>
                </div>
                <Switch
                  checked={localSettings.useLiveData}
                  onCheckedChange={handleDataSourceChange}
                />
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <div className="font-medium">Note:</div>
                    <div>Live data requires API keys and may have rate limits. Mock data is used for demonstration purposes.</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refresh Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5" />
                <span>Refresh Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pre-Open Refresh
                  </label>
                  <Select
                    value={localSettings.refreshCadence.preOpen}
                    onValueChange={(value) =>
                      setLocalSettings(prev => ({
                        ...prev,
                        refreshCadence: { ...prev.refreshCadence, preOpen: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:30">08:30 IST</SelectItem>
                      <SelectItem value="09:00">09:00 IST</SelectItem>
                      <SelectItem value="09:15">09:15 IST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Post-Open Refresh
                  </label>
                  <Select
                    value={localSettings.refreshCadence.postOpen}
                    onValueChange={(value) =>
                      setLocalSettings(prev => ({
                        ...prev,
                        refreshCadence: { ...prev.refreshCadence, postOpen: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:30">09:30 IST</SelectItem>
                      <SelectItem value="09:45">09:45 IST</SelectItem>
                      <SelectItem value="10:00">10:00 IST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mid-Day Refresh
                  </label>
                  <Select
                    value={localSettings.refreshCadence.midDay}
                    onValueChange={(value) =>
                      setLocalSettings(prev => ({
                        ...prev,
                        refreshCadence: { ...prev.refreshCadence, midDay: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="11:30">11:30 IST</SelectItem>
                      <SelectItem value="12:00">12:00 IST</SelectItem>
                      <SelectItem value="12:30">12:30 IST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Post-Close Refresh
                  </label>
                  <Select
                    value={localSettings.refreshCadence.close}
                    onValueChange={(value) =>
                      setLocalSettings(prev => ({
                        ...prev,
                        refreshCadence: { ...prev.refreshCadence, close: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15:35">15:35 IST</SelectItem>
                      <SelectItem value="15:45">15:45 IST</SelectItem>
                      <SelectItem value="16:00">16:00 IST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trading Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Trading Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Risk per Trade (%)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={localSettings.riskPerTrade}
                    onChange={(e) =>
                      setLocalSettings(prev => ({
                        ...prev,
                        riskPerTrade: parseFloat(e.target.value) || 2
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Instrument
                  </label>
                  <Select
                    value={localSettings.defaultInstrument}
                    onValueChange={handleDefaultInstrumentChange}
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
                  <div className="font-medium">Show Advanced Levels</div>
                  <div className="text-sm text-gray-600">
                    Display additional technical levels and indicators
                  </div>
                </div>
                <Switch
                  checked={localSettings.showAdvancedLevels}
                  onCheckedChange={(checked) =>
                    setLocalSettings(prev => ({ ...prev, showAdvancedLevels: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Appearance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                <Select
                  value={localSettings.theme}
                  onValueChange={handleThemeChange}
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
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-800">
                  <div className="font-medium">Timezone:</div>
                  <div>All times are displayed in Asia/Kolkata (IST) timezone as required for Indian markets.</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </div>

          {/* Cache Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Cache Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cache TTL (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={localSettings.cacheTTL}
                  onChange={(e) =>
                    setLocalSettings(prev => ({
                      ...prev,
                      cacheTTL: parseInt(e.target.value) || 15
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-xs text-gray-600 mt-1">
                  How long to cache data before refreshing (5-60 minutes)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
