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