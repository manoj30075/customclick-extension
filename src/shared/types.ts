// Shared TypeScript types for CustomClick extension

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  action: string;
  enabled: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  iconSize: 'small' | 'medium' | 'large';
  animations: boolean;
  animationSpeed: number;
  menuPosition: 'cursor' | 'fixed';
}

export interface ContextInfo {
  selectedText?: string;
  linkUrl?: string;
  imageUrl?: string;
  pageUrl: string;
  elementTag?: string;
}

export interface CustomAction {
  id: string;
  name: string;
  description: string;
  icon: string;
  script: string;
  enabled: boolean;
  contextTypes: string[];
}

export interface AIConfig {
  apiKey?: string;
  model: 'gpt-3.5-turbo' | 'gpt-4';
  temperature: number;
  maxTokens: number;
}

export type MessageType =
  | 'SHOW_MENU'
  | 'HIDE_MENU'
  | 'EXECUTE_ACTION'
  | 'GET_SETTINGS'
  | 'UPDATE_SETTINGS';

export interface Message {
  type: MessageType;
  payload?: unknown;
}
