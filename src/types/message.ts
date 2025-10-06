import type { User } from './user';

export interface Message {
  id: number;
  expediteur: User;
  destinataire: User;
  contenu: string;
  lu: boolean;
  luAt?: string;
  createdAt: string;
}

export interface SendMessageInput {
  destinataireId: number;
  contenu: string;
}

export interface Conversation {
  id: number;
  participant1: User;
  participant2: User;
  dernierMessage?: Message;
  messagesNonLus: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationDetail {
  id: number;
  participant1: User;
  participant2: User;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}