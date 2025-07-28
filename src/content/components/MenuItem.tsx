import React from 'react';

export interface MenuItemProps {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  onClick: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  focused?: boolean;
  'aria-posinset'?: number;
  'aria-setsize'?: number;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  id,
  label,
  icon,
  shortcut,
  disabled = false,
  onClick,
  onKeyDown,
  focused = false,
  'aria-posinset': ariaPosinset,
  'aria-setsize': ariaSetsize,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
    
    // Handle Enter and Space key activation
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      id={id}
      role="menuitem"
      tabIndex={focused ? 0 : -1}
      aria-disabled={disabled}
      aria-posinset={ariaPosinset}
      aria-setsize={ariaSetsize}
      className={`
        menu-item group
        ${focused ? 'menu-item-focused' : ''}
        ${disabled ? 'menu-item-disabled' : ''}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="menu-item-content">
        {icon && (
          <span className="menu-item-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="menu-item-label">{label}</span>
        {shortcut && (
          <span className="menu-item-shortcut" aria-hidden="true">
            {shortcut}
          </span>
        )}
      </div>
    </div>
  );
};