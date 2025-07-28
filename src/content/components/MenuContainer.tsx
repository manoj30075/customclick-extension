import React, { useEffect, useRef, useState } from 'react';
import { MenuItem, type MenuItemProps } from './MenuItem';
import { MenuSeparator } from './MenuSeparator';

export interface MenuSection {
  id: string;
  items: Omit<MenuItemProps, 'focused' | 'aria-posinset' | 'aria-setsize' | 'onKeyDown'>[];
}

export interface MenuContainerProps {
  sections: MenuSection[];
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  'aria-label'?: string;
}

export const MenuContainer: React.FC<MenuContainerProps> = ({
  sections,
  isVisible,
  position,
  onClose,
  'aria-label': ariaLabel = 'Context menu',
}) => {
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
      // Focus the menu container when it becomes visible
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
      
      default:
        // Handle typeahead (first letter navigation)
        if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
          const letter = e.key.toLowerCase();
          const currentIndex = focusedIndex;
          
          // Find next item starting with the letter
          for (let i = 1; i < focusableItems.length; i++) {
            const index = (currentIndex + i) % focusableItems.length;
            const item = focusableItems[index];
            if (item.label.toLowerCase().startsWith(letter)) {
              setFocusedIndex(index);
              break;
            }
          }
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
          {sectionIndex > 0 && <MenuSeparator />}
          {section.items.map((item) => {
            const currentItemIndex = itemIndex;
            const isFocused = !item.disabled && focusedIndex === focusableItems.findIndex(
              focusableItem => focusableItem.id === item.id
            );
            
            if (!item.disabled) {
              itemIndex++;
            }

            return (
              <MenuItem
                key={item.id}
                {...item}
                focused={isFocused}
                aria-posinset={currentItemIndex + 1}
                aria-setsize={focusableItems.length}
                onKeyDown={handleKeyDown}
              />
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