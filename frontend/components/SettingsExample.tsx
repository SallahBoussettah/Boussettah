"use client";

import { useSettings, useSetting, useSettingsByCategory } from '@/contexts/SettingsContext';

// Example component showing how to use settings
export function SettingsExample() {
  const { settings, loading, error } = useSettings();
  
  // Get a specific setting with default value
  const siteName = useSetting('site_name', 'Default Portfolio');
  const ownerName = useSetting('owner_name', 'John Doe');
  const contactEmail = useSetting('contact_email', 'contact@example.com');
  
  // Get all settings from a category
  const socialSettings = useSettingsByCategory('social');
  const seoSettings = useSettingsByCategory('seo');
  
  if (loading) {
    return <div>Loading settings...</div>;
  }
  
  if (error) {
    return <div>Error loading settings: {error}</div>;
  }
  
  return (
    <div className="p-6 bg-white dark:bg-black rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Settings Example</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Basic Settings:</h3>
          <p>Site Name: {siteName}</p>
          <p>Owner: {ownerName}</p>
          <p>Email: {contactEmail}</p>
        </div>
        
        <div>
          <h3 className="font-semibold">Social Links:</h3>
          <ul className="list-disc list-inside">
            {Object.entries(socialSettings).map(([key, value]) => (
              <li key={key}>
                {key.replace('social_', '')}: {value as string || 'Not set'}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold">SEO Settings:</h3>
          <ul className="list-disc list-inside">
            {Object.entries(seoSettings).map(([key, value]) => (
              <li key={key}>
                {key.replace('seo_', '')}: {
                  Array.isArray(value) 
                    ? (value as string[]).join(', ')
                    : value as string || 'Not set'
                }
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold">All Settings (Debug):</h3>
          <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(settings, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

// Example of a dynamic header component using settings
export function DynamicHeader() {
  const siteName = useSetting('site_name', 'Portfolio');
  const ownerName = useSetting('owner_name', 'Developer');
  const siteDescription = useSetting('site_description', 'Welcome to my portfolio');
  
  return (
    <header className="text-center py-12">
      <h1 className="text-4xl font-bold mb-2">{siteName}</h1>
      <h2 className="text-2xl text-gray-600 dark:text-gray-400 mb-4">{ownerName}</h2>
      <p className="text-lg text-gray-500 dark:text-gray-500">{siteDescription}</p>
    </header>
  );
}

// Example of dynamic social links
export function DynamicSocialLinks() {
  const socialSettings = useSettingsByCategory('social');
  
  const socialLinks = [
    { key: 'social_github', label: 'GitHub', icon: '🐙' },
    { key: 'social_linkedin', label: 'LinkedIn', icon: '💼' },
    { key: 'social_twitter', label: 'Twitter', icon: '🐦' },
    { key: 'social_instagram', label: 'Instagram', icon: '📸' },
  ];
  
  return (
    <div className="flex space-x-4">
      {socialLinks.map(({ key, label, icon }) => {
        const url = socialSettings[key];
        if (!url) return null;
        
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <span>{icon}</span>
            <span>{label}</span>
          </a>
        );
      })}
    </div>
  );
}