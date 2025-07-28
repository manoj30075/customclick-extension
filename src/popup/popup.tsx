import React from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';

const Popup: React.FC = () => {
  return (
    <div className="popup-container">
      <header className="popup-header">
        <h1>CustomClick</h1>
        <p>Transform your right-click experience</p>
      </header>
      
      <main className="popup-content">
        <div className="feature-item">
          <h3>🎯 Custom Menu</h3>
          <p>Personalize your right-click menu with custom actions</p>
        </div>
        
        <div className="feature-item">
          <h3>🤖 AI Integration</h3>
          <p>Built-in ChatGPT for instant assistance</p>
        </div>
        
        <div className="feature-item">
          <h3>⚡ Lightning Fast</h3>
          <p>Renders in under 100ms</p>
        </div>
      </main>
      
      <footer className="popup-footer">
        <button 
          onClick={() => chrome.runtime.openOptionsPage()}
          className="options-button"
        >
          Open Settings
        </button>
      </footer>
    </div>
  );
};

const container = document.getElementById('popup-root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}