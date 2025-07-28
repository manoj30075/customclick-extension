import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './options.css';

interface Settings {
  theme: 'light' | 'dark' | 'auto';
  iconSize: 'small' | 'medium' | 'large';
  animations: boolean;
}

const Options: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    theme: 'auto',
    iconSize: 'medium',
    animations: true,
  });
  
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load settings from Chrome storage
    chrome.storage.sync.get(['settings'], (result) => {
      if (result.settings) {
        setSettings(result.settings);
      }
    });
  }, []);

  const saveSettings = () => {
    chrome.storage.sync.set({ settings }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div className="options-container">
      <header className="options-header">
        <h1>CustomClick Settings</h1>
        <p>Customize your right-click experience</p>
      </header>

      <main className="options-content">
        <section className="settings-section">
          <h2>Appearance</h2>
          
          <div className="setting-item">
            <label>Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({...settings, theme: e.target.value as any})}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Icon Size</label>
            <select
              value={settings.iconSize}
              onChange={(e) => setSettings({...settings, iconSize: e.target.value as any})}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.animations}
                onChange={(e) => setSettings({...settings, animations: e.target.checked})}
              />
              Enable Animations
            </label>
          </div>
        </section>
      </main>

      <footer className="options-footer">
        <button onClick={saveSettings} className="save-button">
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </footer>
    </div>
  );
};

const container = document.getElementById('options-root');
if (container) {
  const root = createRoot(container);
  root.render(<Options />);
}