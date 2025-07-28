import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// Content script for CustomClick extension
console.log('CustomClick content script loaded');

// Create root container for React components
const createMenuContainer = (): HTMLElement => {
  const container = document.createElement('div');
  container.id = 'customclick-menu-root';
  container.style.position = 'fixed';
  container.style.zIndex = '999999';
  container.style.pointerEvents = 'none';
  document.body.appendChild(container);
  return container;
};

// Basic menu component placeholder
const CustomClickMenu: React.FC = () => {
  return (
    <div className="customclick-menu">
      <p>CustomClick Menu - Coming Soon!</p>
    </div>
  );
};

// Initialize content script
const init = () => {
  const container = createMenuContainer();
  const root = createRoot(container);
  
  // Listen for right-click events
  document.addEventListener('contextmenu', (e) => {
    console.log('Right-click detected at:', e.pageX, e.pageY);
    // TODO: Show custom menu
  });
  
  root.render(<CustomClickMenu />);
};

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}