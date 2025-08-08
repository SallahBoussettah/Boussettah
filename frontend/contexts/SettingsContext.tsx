"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { settingsAPI } from '@/lib/api';

interface SettingsContextType {
  settings: Record<string, any>;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  getSetting: (key: string, defaultValue?: any) => any;
  getSettingsByCategory: (category: string) => Record<string, any>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await settingsAPI.getPublicSettings();
      
      if (response.success) {
        setSettings(response.settings);
      } else {
        throw new Error('Failed to fetch settings');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
      // Set default settings on error to prevent app from breaking
      setSettings({
        general: {
          site_name: 'Portfolio',
          site_description: 'Developer Portfolio',
          owner_name: 'Developer'
        },
        contact: {},
        social: {},
        seo: {},
        appearance: {},
        portfolio: {}
      });
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key: string, defaultValue: any = null) => {
    // First try to find in any category
    for (const category of Object.keys(settings)) {
      if (settings[category][key] !== undefined) {
        return settings[category][key];
      }
    }
    return defaultValue;
  };

  const getSettingsByCategory = (category: string) => {
    return settings[category] || {};
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const value: SettingsContextType = {
    settings,
    loading,
    error,
    refreshSettings,
    getSetting,
    getSettingsByCategory,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// Hook for getting specific setting with default
export function useSetting(key: string, defaultValue?: any) {
  const { getSetting } = useSettings();
  return getSetting(key, defaultValue);
}

// Hook for getting settings by category
export function useSettingsByCategory(category: string) {
  const { getSettingsByCategory } = useSettings();
  return getSettingsByCategory(category);
}