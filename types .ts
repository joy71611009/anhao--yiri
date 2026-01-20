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
  isDark?: boolean;
}

export const THEMES: ThemeConfig[] = [
  { 
    id: 'warm', 
    name: '琥珀', 
    bg: '#ede7de', 
    sidebar: '#e3dbcc', 
    accent: '#5d4037', 
    text: '#3e2723',
    isDark: false
  },
  { 
    id: 'forest', 
    name: '松烟', 
    bg: '#dbe1da', 
    sidebar: '#d4dad2', 
    accent: '#2d3e2d', 
    text: '#1b261b',
    isDark: false
  },
  { 
    id: 'night', 
    name: '深邃', 
    bg: '#1a1b1e', 
    sidebar: '#25262b', 
    accent: '#a5d8ff', 
    text: '#c1c2c5',
    isDark: true
  },
  { 
    id: 'minimal', 
    name: '素荷', 
    bg: '#e8e4db', 
    sidebar: '#ded9cd', 
    accent: '#4a4a4a', 
    text: '#333333',
    isDark: false
  }
];