import React, { useEffect, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import './styles.css';

// Content script for CustomClick extension
console.log('CustomClick content script loaded');

interface MenuPosition {
  x: number;
  y: number;
}

interface CustomClickMenuProps {
  isVisible: boolean;
  position: MenuPosition;
  onClose: () => void;
}

// Custom menu component
const CustomClickMenu: React.FC<CustomClickMenuProps> = ({ isVisible, position, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('click', handleClickOutside);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const adjustedPosition = adjustMenuPosition(position);

  return (
    <div 
      ref={menuRef}
      className="customclick-menu"
      style={{
        position: 'fixed',
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        zIndex: 999999,
        pointerEvents: 'auto'
      }}
    >
      <div className="menu-item" onClick={() => { console.log('Search selected text'); onClose(); }}>
        🔍 Search
      </div>
      <div className="menu-item" onClick={() => { console.log('Copy selected text'); onClose(); }}>
        📋 Copy
      </div>
      <div className="menu-item" onClick={() => { console.log('Translate selected text'); onClose(); }}>
        🌐 Translate
      </div>
      <hr className="menu-separator" />
      <div className="menu-item" onClick={() => { console.log('Custom action'); onClose(); }}>
        ⚡ Custom Action
      </div>
    </div>
  );
};

// Adjust menu position to handle screen edges
const adjustMenuPosition = (position: MenuPosition): MenuPosition => {
  const menuWidth = 200; // Approximate menu width
  const menuHeight = 150; // Approximate menu height
  const padding = 10;
  
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  
  let adjustedX = position.x;
  let adjustedY = position.y;
  
  // Handle right edge
  if (position.x + menuWidth > viewportWidth + scrollX) {
    adjustedX = viewportWidth + scrollX - menuWidth - padding;
  }
  
  // Handle bottom edge
  if (position.y + menuHeight > viewportHeight + scrollY) {
    adjustedY = viewportHeight + scrollY - menuHeight - padding;
  }
  
  // Ensure menu doesn't go off left edge
  if (adjustedX < scrollX + padding) {
    adjustedX = scrollX + padding;
  }
  
  // Ensure menu doesn't go off top edge
  if (adjustedY < scrollY + padding) {
    adjustedY = scrollY + padding;
  }
  
  return { x: adjustedX, y: adjustedY };
};

// Create root container for React components
const createMenuContainer = (): HTMLElement => {
  const existingContainer = document.getElementById('customclick-menu-root');
  if (existingContainer) {
    return existingContainer;
  }
  
  const container = document.createElement('div');
  container.id = 'customclick-menu-root';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.zIndex = '999999';
  container.style.pointerEvents = 'none';
  container.style.width = '100%';
  container.style.height = '100%';
  document.body.appendChild(container);
  return container;
};

// Menu state manager
class MenuManager {
  private isVisible = false;
  private position: MenuPosition = { x: 0, y: 0 };
  private root: Root;
  
  constructor(container: HTMLElement) {
    this.root = createRoot(container);
    this.render();
  }
  
  show(x: number, y: number) {
    this.position = { x, y };
    this.isVisible = true;
    this.render();
  }
  
  hide() {
    this.isVisible = false;
    this.render();
  }
  
  private render() {
    this.root.render(
      <CustomClickMenu 
        isVisible={this.isVisible}
        position={this.position}
        onClose={() => this.hide()}
      />
    );
  }
}

// Initialize content script
const init = () => {
  const container = createMenuContainer();
  const menuManager = new MenuManager(container);
  
  // Performance tracking
  let contextMenuStartTime = 0;
  
  // Listen for right-click events
  document.addEventListener('contextmenu', (e: MouseEvent) => {
    contextMenuStartTime = performance.now();
    
    // Allow native context menu with Shift+Right-click
    if (e.shiftKey) {
      return; // Let default context menu show
    }
    
    // Prevent default context menu
    e.preventDefault();
    e.stopPropagation();
    
    // Show custom menu at click position
    menuManager.show(e.clientX + window.scrollX, e.clientY + window.scrollY);
    
    // Log performance
    const renderTime = performance.now() - contextMenuStartTime;
    if (renderTime > 10) {
      console.warn(`CustomClick menu render time: ${renderTime.toFixed(2)}ms (target: <10ms)`);
    } else {
      console.log(`CustomClick menu render time: ${renderTime.toFixed(2)}ms`);
    }
  }, true); // Use capture phase for better performance
  
  // Handle scroll events to hide menu
  document.addEventListener('scroll', () => {
    menuManager.hide();
  }, true);
  
  // Handle window resize to hide menu
  window.addEventListener('resize', () => {
    menuManager.hide();
  });
};

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
