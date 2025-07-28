import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MenuContainer, type MenuSection } from './components/MenuContainer';
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

// Define menu sections with proper structure
const getMenuSections = (onClose: () => void): MenuSection[] => [
  {
    id: 'search-actions',
    items: [
      {
        id: 'search',
        label: 'Search',
        icon: '🔍',
        shortcut: 'Ctrl+F',
        onClick: () => {
          console.log('Search selected text');
          onClose();
        }
      },
      {
        id: 'translate',
        label: 'Translate',
        icon: '🌐',
        shortcut: 'Ctrl+T',
        onClick: () => {
          console.log('Translate selected text');
          onClose();
        }
      }
    ]
  },
  {
    id: 'edit-actions',
    items: [
      {
        id: 'copy',
        label: 'Copy',
        icon: '📋',
        shortcut: 'Ctrl+C',
        onClick: () => {
          console.log('Copy selected text');
          onClose();
        }
      },
      {
        id: 'paste',
        label: 'Paste',
        icon: '📝',
        shortcut: 'Ctrl+V',
        disabled: true, // Example of disabled item
        onClick: () => {
          console.log('Paste text');
          onClose();
        }
      }
    ]
  },
  {
    id: 'custom-actions',
    items: [
      {
        id: 'ai-assist',
        label: 'AI Assistant',
        icon: '🤖',
        shortcut: 'Ctrl+A',
        onClick: () => {
          console.log('AI Assistant activated');
          onClose();
        }
      },
      {
        id: 'custom-action',
        label: 'Custom Action',
        icon: '⚡',
        onClick: () => {
          console.log('Custom action triggered');
          onClose();
        }
      }
    ]
  }
];

// Custom menu component wrapper
const CustomClickMenu: React.FC<CustomClickMenuProps> = ({ isVisible, position, onClose }) => {
  const menuSections = getMenuSections(onClose);
  
  return (
    <MenuContainer
      sections={menuSections}
      isVisible={isVisible}
      position={position}
      onClose={onClose}
      aria-label="CustomClick context menu"
    />
  );
};

// Position adjustment is now handled in MenuContainer component

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
    const x = e.clientX + window.scrollX;
    const y = e.clientY + window.scrollY;
    menuManager.show(x, y);
    
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
