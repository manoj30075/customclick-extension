// Shared constants for CustomClick extension

export const EXTENSION_ID = 'customclick-extension';

export const DEFAULT_SETTINGS = {
  theme: 'auto' as const,
  iconSize: 'medium' as const,
  animations: true,
  animationSpeed: 200,
  menuPosition: 'cursor' as const,
};

export const MENU_DIMENSIONS = {
  MIN_WIDTH: 200,
  MAX_WIDTH: 400,
  ITEM_HEIGHT: 40,
  PADDING: 8,
};

export const ANIMATION_DURATIONS = {
  FADE_IN: 200,
  FADE_OUT: 150,
  SLIDE_IN: 200,
};

export const Z_INDEX = {
  MENU: 999999,
  OVERLAY: 999998,
};

export const STORAGE_KEYS = {
  SETTINGS: 'customclick_settings',
  CUSTOM_ACTIONS: 'customclick_actions',
  AI_CONFIG: 'customclick_ai_config',
};