"use client";

import { useSettings } from '@/contexts/SettingsContext';
import { useEffect, useState } from 'react';

export function SettingsDebug() {
  const { settings, loading, error, refreshSettings } = useSettings();
  const [apiTest, setApiTest] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    // Test direct API call
    const testAPI = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/settings/public');
        const data = await response.json();
        setApiTest(data);
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'API test failed');
      }
    };

    testAPI();
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-4 max-w-md max-h-96 overflow-auto z-50 shadow-lg">
      <h3 className="font-bold text-lg mb-2">Settings Debug</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Context Status:</strong>
          <div>Loading: {loading ? 'Yes' : 'No'}</div>
          <div>Error: {error || 'None'}</div>
          <div>Settings Keys: {Object.keys(settings).join(', ')}</div>
        </div>

        <div>
          <strong>Direct API Test:</strong>
          <div>Error: {apiError || 'None'}</div>
          <div>Success: {apiTest?.success ? 'Yes' : 'No'}</div>
          <div>Categories: {apiTest?.settings ? Object.keys(apiTest.settings).join(', ') : 'None'}</div>
        </div>

        <div>
          <strong>Sample Settings:</strong>
          <div>Site Name: {settings.general?.site_name || 'Not loaded'}</div>
          <div>Owner Name: {settings.general?.owner_name || 'Not loaded'}</div>
        </div>

        <div>
          <strong>SEO Settings:</strong>
          <div>Meta Title: {settings.seo?.seo_meta_title || 'Not loaded'}</div>
          <div>Meta Description: {settings.seo?.seo_meta_description?.substring(0, 50) || 'Not loaded'}...</div>
          <div>Keywords: {settings.seo?.seo_keywords?.length || 0} keywords</div>
        </div>

        <button 
          onClick={refreshSettings}
          className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
        >
          Refresh Settings
        </button>
      </div>
    </div>
  );
}