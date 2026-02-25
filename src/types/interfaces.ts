export type Role = 'user' | 'assistant';

export interface Message {
  id?: string;
  role: Role;
  content: string;
  timestamp?: string;
  isStreaming?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt?: string;
}