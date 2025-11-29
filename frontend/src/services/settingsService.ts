const SETTINGS_KEY = 'mrt_settings';

export interface AppSettings {
  notifications: boolean;
  theme: 'light' | 'dark';
  emailNotifications: boolean;
  soundNotifications: boolean;
  desktopNotifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // in seconds
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12' | '24';
  defaultIssuePriority: 'low' | 'medium' | 'high';
  defaultIssueCategory: 'Plumbing' | 'Electric' | 'A/C' | 'IT' | 'Machine Repair';
  itemsPerPage: number;
  exportFormat: 'CSV' | 'PDF';
}

const defaultSettings: AppSettings = {
  notifications: true,
  theme: 'light',
  emailNotifications: true,
  soundNotifications: false,
  desktopNotifications: true,
  autoRefresh: false,
  refreshInterval: 30,
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12',
  defaultIssuePriority: 'medium',
  defaultIssueCategory: 'Plumbing',
  itemsPerPage: 10,
  exportFormat: 'CSV',
};

export const settingsService = {
  getSettings: (): AppSettings => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  },

  updateSettings: (updates: Partial<AppSettings>): AppSettings => {
    const current = settingsService.getSettings();
    const updated = { ...current, ...updates };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    
    // Apply theme immediately
    if (updates.theme) {
      document.documentElement.classList.toggle('dark', updates.theme === 'dark');
    }
    
    return updated;
  },

  resetSettings: (): AppSettings => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    document.documentElement.classList.remove('dark');
    return defaultSettings;
  },
};

// Initialize theme on load
const initialSettings = settingsService.getSettings();
if (initialSettings.theme === 'dark') {
  document.documentElement.classList.add('dark');
}

