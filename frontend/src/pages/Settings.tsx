import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import BackButton from '../components/BackButton';
import { settingsService, AppSettings } from '../services/settingsService';
import { useSidebar } from '../hooks/useSidebar';
import { useWindowSize } from '../hooks/useWindowSize';

export default function Settings() {
  const { isOpen } = useSidebar();
  const { width } = useWindowSize();
  const isDesktop = width >= 1024;
  const [settings, setSettings] = useState<AppSettings>(settingsService.getSettings());

  useEffect(() => {
    setSettings(settingsService.getSettings());
  }, []);

  const handleUpdate = (updates: Partial<AppSettings>) => {
    const updated = settingsService.updateSettings(updates);
    setSettings(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <Header />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          marginLeft: isDesktop ? (isOpen ? '256px' : '80px') : '0px'
        }}
        transition={{ duration: 0.3 }}
        className="pt-24 p-8"
      >
        <div className="max-w-4xl mx-auto">
          <BackButton />
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
            
            <div className="space-y-8">
              {/* Notifications Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="font-medium text-gray-700">Enable Notifications</label>
                      <p className="text-sm text-gray-500">Receive notifications for important updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={(e) => handleUpdate({ notifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mid-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mid-blue"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="font-medium text-gray-700">Email Notifications</label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleUpdate({ emailNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mid-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mid-blue"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="font-medium text-gray-700">Sound Notifications</label>
                      <p className="text-sm text-gray-500">Play sound for notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.soundNotifications}
                        onChange={(e) => handleUpdate({ soundNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mid-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mid-blue"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="font-medium text-gray-700">Desktop Notifications</label>
                      <p className="text-sm text-gray-500">Show browser desktop notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.desktopNotifications}
                        onChange={(e) => handleUpdate({ desktopNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mid-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mid-blue"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Theme Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Appearance</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block font-medium text-gray-700 mb-2">Theme</label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleUpdate({ theme: 'light' })}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                          settings.theme === 'light'
                            ? 'border-mid-blue bg-mid-blue text-white'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-mid-blue'
                        }`}
                      >
                        <div className="font-medium mb-1">Light</div>
                        <div className="text-xs opacity-75">Default light theme</div>
                      </button>
                      <button
                        onClick={() => handleUpdate({ theme: 'dark' })}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                          settings.theme === 'dark'
                            ? 'border-mid-blue bg-mid-blue text-white'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-mid-blue'
                        }`}
                      >
                        <div className="font-medium mb-1">Dark</div>
                        <div className="text-xs opacity-75">Dark mode theme</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Preferences</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block font-medium text-gray-700 mb-2">Date Format</label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => handleUpdate({ dateFormat: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mid-blue focus:border-transparent outline-none"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block font-medium text-gray-700 mb-2">Time Format</label>
                    <select
                      value={settings.timeFormat}
                      onChange={(e) => handleUpdate({ timeFormat: e.target.value as '12' | '24' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mid-blue focus:border-transparent outline-none"
                    >
                      <option value="12">12 Hour</option>
                      <option value="24">24 Hour</option>
                    </select>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block font-medium text-gray-700 mb-2">Default Issue Priority</label>
                    <select
                      value={settings.defaultIssuePriority}
                      onChange={(e) => handleUpdate({ defaultIssuePriority: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mid-blue focus:border-transparent outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block font-medium text-gray-700 mb-2">Default Issue Category</label>
                    <select
                      value={settings.defaultIssueCategory}
                      onChange={(e) => handleUpdate({ defaultIssueCategory: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mid-blue focus:border-transparent outline-none"
                    >
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electric">Electric</option>
                      <option value="A/C">A/C</option>
                      <option value="IT">IT</option>
                      <option value="Machine Repair">Machine Repair</option>
                    </select>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block font-medium text-gray-700 mb-2">Items Per Page</label>
                    <select
                      value={settings.itemsPerPage}
                      onChange={(e) => handleUpdate({ itemsPerPage: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mid-blue focus:border-transparent outline-none"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block font-medium text-gray-700 mb-2">Export Format</label>
                    <select
                      value={settings.exportFormat}
                      onChange={(e) => handleUpdate({ exportFormat: e.target.value as 'CSV' | 'PDF' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mid-blue focus:border-transparent outline-none"
                    >
                      <option value="CSV">CSV</option>
                      <option value="PDF">PDF</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Auto Refresh Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Auto Refresh</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="font-medium text-gray-700">Enable Auto Refresh</label>
                      <p className="text-sm text-gray-500">Automatically refresh data at intervals</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoRefresh}
                        onChange={(e) => handleUpdate({ autoRefresh: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mid-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mid-blue"></div>
                    </label>
                  </div>

                  {settings.autoRefresh && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block font-medium text-gray-700 mb-2">
                        Refresh Interval (seconds)
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="300"
                        step="10"
                        value={settings.refreshInterval}
                        onChange={(e) => handleUpdate({ refreshInterval: parseInt(e.target.value) || 30 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mid-blue focus:border-transparent outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Reset Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    const reset = settingsService.resetSettings();
                    setSettings(reset);
                    alert('Settings reset to default values');
                  }}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
