export enum Role {
  USER = 'user',
  ASSISTANT = 'assistant'
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface Memory {
  id: string;
  topic: string;
  summary: string;
  timestamp: number;
}

export interface ThemeConfig {
  id: string;
  name: string;
  bg: string;
  sidebar: string;
  accent: string;
  text: string;
}

export const THEMES: ThemeConfig[] = [
  { id: 'warm', name: '暖阳', bg: '#f8f7f2', sidebar: 'rgba(255,255,255,0.3)', accent: '#334155', text: '#475569' },
  { id: 'morning', name: '晨曦', bg: '#f0f9f8', sidebar: 'rgba(255,255,255,0.4)', accent: '#2d3748', text: '#4a5568' },
  { id: 'twilight', name: '暮色', bg: '#f2f1f8', sidebar: 'rgba(255,255,255,0.3)', accent: '#2e3a4e', text: '#4e5a6e' },
  { id: 'minimal', name: '素雅', bg: '#f1f1f1', sidebar: 'rgba(0,0,0,0.02)', accent: '#1a202c', text: '#2d3748' }
];