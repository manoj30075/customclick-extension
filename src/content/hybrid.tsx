import React, { useEffect, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import './styles.css';

// Content script for CustomClick extension - Hybrid Vanilla JS + React approach
console.log('CustomClick hybrid content script loaded');

interface MenuPosition {
  x: number;
  y: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  onClick: () => void;
}

interface MenuSection {
  id: string;
  items: MenuItem[];
}

// Enhanced React Menu Component
const MenuContainer: React.FC<{
  sections: MenuSection[];
  isVisible: boolean;
  position: MenuPosition;
  onClose: () => void;
  'aria-label'?: string;
}> = ({ sections, isVisible, position, onClose, 'aria-label': ariaLabel = 'Context menu' }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Flatten all menu items for keyboard navigation
  const allItems = sections.flatMap(section => section.items);
  const focusableItems = allItems.filter(item => !item.disabled);

  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? 'dark' : 'light');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Focus management
  useEffect(() => {
    if (isVisible && menuRef.current) {
      menuRef.current.focus();
      setFocusedIndex(0);
    }
  }, [isVisible]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % focusableItems.length);
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + focusableItems.length) % focusableItems.length);
        break;
      
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      
      case 'End':
        e.preventDefault();
        setFocusedIndex(focusableItems.length - 1);
        break;
      
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusableItems[focusedIndex]) {
          focusableItems[focusedIndex].onClick();
        }
        break;
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isVisible, onClose]);

  if (!isVisible) {
    return null;
  }

  // Adjust position for screen edges
  const adjustedPosition = adjustMenuPosition(position);

  let itemIndex = 0;

  return (
    <div
      ref={menuRef}
      role="menu"
      tabIndex={-1}
      aria-label={ariaLabel}
      aria-orientation="vertical"
      className={`menu-container theme-${theme}`}
      style={{
        position: 'fixed',
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        zIndex: 2147483647,
      }}
      onKeyDown={handleKeyDown}
    >
      {sections.map((section, sectionIndex) => (
        <React.Fragment key={section.id}>
          {sectionIndex > 0 && <div role="separator" className="menu-separator" aria-orientation="horizontal" />}
          {section.items.map((item) => {
            const currentItemIndex = itemIndex;
            const isFocused = !item.disabled && focusedIndex === focusableItems.findIndex(
              focusableItem => focusableItem.id === item.id
            );
            
            if (!item.disabled) {
              itemIndex++;
            }

            return (
              <div
                key={item.id}
                id={item.id}
                role="menuitem"
                tabIndex={isFocused ? 0 : -1}
                aria-disabled={item.disabled}
                aria-posinset={currentItemIndex + 1}
                aria-setsize={focusableItems.length}
                className={`
                  menu-item group
                  ${isFocused ? 'menu-item-focused' : ''}
                  ${item.disabled ? 'menu-item-disabled' : ''}
                `}
                onClick={item.disabled ? undefined : item.onClick}
                onKeyDown={handleKeyDown}
              >
                <div className="menu-item-content">
                  {item.icon && <span className="menu-item-icon" aria-hidden="true">{item.icon}</span>}
                  <span className="menu-item-label">{item.label}</span>
                  {item.shortcut && <span className="menu-item-shortcut" aria-hidden="true">{item.shortcut}</span>}
                </div>
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

// Helper function to adjust menu position
function adjustMenuPosition(position: { x: number; y: number }): { x: number; y: number } {
  const menuWidth = 320; // Max width from CSS
  const menuHeight = 200; // Approximate height
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
        disabled: true,
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

// React Menu Component - Enhanced version of the working vanilla JS
const CustomClickMenu: React.FC<{
  isVisible: boolean;
  position: MenuPosition;
  onClose: () => void;
}> = ({ isVisible, position, onClose }) => {
  const menuSections = getMenuSections(onClose);
  
  if (!isVisible) return null;
  
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

// Vanilla JS Menu Manager - Based on working solution
class VanillaMenuManager {
  private currentMenu: HTMLElement | null = null;
  
  createSimpleMenu(): HTMLElement {
    const menu = document.createElement('div');
    menu.id = 'customclick-simple-menu';
    menu.innerHTML = `
      <div style="
        position: fixed;
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 8px 0;
        min-width: 200px;
        z-index: 2147483647;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        font-size: 14px;
      ">
        <div class="menu-item" style="
          padding: 8px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.15s ease;
        " onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">
          🔍 Search
        </div>
        <div class="menu-item" style="
          padding: 8px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.15s ease;
        " onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">
          📋 Copy
        </div>
        <div class="menu-item" style="
          padding: 8px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.15s ease;
        " onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">
          🌐 Translate
        </div>
        <hr style="margin: 4px 8px; border: none; border-top: 1px solid #eee;">
        <div class="menu-item" style="
          padding: 8px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.15s ease;
        " onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">
          ⚡ Custom Action
        </div>
      </div>
    `;
    return menu;
  }
  
  show(x: number, y: number) {
    this.hide();
    
    const menu = this.createSimpleMenu();
    menu.style.position = 'fixed';
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.style.zIndex = '2147483647';
    
    // Add click handlers
    const items = menu.querySelectorAll('.menu-item');
    items.forEach((item, index) => {
      item.addEventListener('click', () => {
        const actions = ['search', 'copy', 'translate', 'custom'];
        console.log('Vanilla menu action:', actions[index]);
        this.hide();
      });
    });
    
    document.body.appendChild(menu);
    this.currentMenu = menu;
    
    // Close handlers
    setTimeout(() => {
      document.addEventListener('click', this.handleOutsideClick);
      document.addEventListener('keydown', this.handleEscapeKey);
    }, 0);
  }
  
  hide() {
    if (this.currentMenu) {
      this.currentMenu.remove();
      this.currentMenu = null;
      document.removeEventListener('click', this.handleOutsideClick);
      document.removeEventListener('keydown', this.handleEscapeKey);
    }
  }
  
  private handleOutsideClick = (e: MouseEvent) => {
    if (this.currentMenu && !this.currentMenu.contains(e.target as Node)) {
      this.hide();
    }
  };
  
  private handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.hide();
    }
  };
}

// React Menu Manager - Enhanced version
class ReactMenuManager {
  private isVisible = false;
  private position: MenuPosition = { x: 0, y: 0 };
  private root: Root | null = null;
  private container: HTMLElement | null = null;
  
  constructor() {
    this.createContainer();
  }
  
  private createContainer() {
    const existingContainer = document.getElementById('customclick-react-menu-root');
    if (existingContainer) {
      this.container = existingContainer;
      this.root = createRoot(existingContainer);
      return;
    }
    
    const container = document.createElement('div');
    container.id = 'customclick-react-menu-root';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.zIndex = '999999';
    container.style.pointerEvents = 'none';
    container.style.width = '100%';
    container.style.height = '100%';
    document.body.appendChild(container);
    
    this.container = container;
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
    if (!this.root) return;
    
    this.root.render(
      <CustomClickMenu 
        isVisible={this.isVisible}
        position={this.position}
        onClose={() => this.hide()}
      />
    );
  }
}

// Menu mode selection - allows switching between vanilla and React
type MenuMode = 'vanilla' | 'react';
const MENU_MODE: MenuMode = 'react'; // Change this to switch modes

// Initialize menu manager based on mode
const initializeMenuManager = () => {
  if (MENU_MODE === 'vanilla') {
    console.log('Using vanilla JS menu manager');
    return new VanillaMenuManager();
  } else {
    console.log('Using React menu manager');
    return new ReactMenuManager();
  }
};

// Main initialization
const init = () => {
  const menuManager = initializeMenuManager();
  
  // Performance tracking
  let contextMenuStartTime = 0;
  
  // Right-click event handler
  document.addEventListener('contextmenu', (e: MouseEvent) => {
    contextMenuStartTime = performance.now();
    
    console.log('Right-click detected');
    
    // Allow native context menu with Shift+Right-click
    if (e.shiftKey) {
      return true;
    }
    
    // Prevent default context menu
    e.preventDefault();
    e.stopPropagation();
    
    // Show custom menu at click position
    menuManager.show(e.clientX, e.clientY);
    
    // Performance logging
    const renderTime = performance.now() - contextMenuStartTime;
    if (renderTime > 10) {
      console.warn(`CustomClick menu render time: ${renderTime.toFixed(2)}ms (target: <10ms)`);
    } else {
      console.log(`CustomClick menu render time: ${renderTime.toFixed(2)}ms`);
    }
    
    return false;
  }, true);
  
  // Hide menu on scroll and resize
  document.addEventListener('scroll', () => {
    menuManager.hide();
  }, true);
  
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

console.log('CustomClick hybrid content script initialized');