import type { User } from './user';

export interface Message {
  id: number;
  expediteur: User;
  destinataire: User;
  contenu: string;
  lu: boolean;
  createdAt: string;
}

export interface SendMessageInput {
  destinataireId: number;
  contenu: string;
}

export interface Conversation {
  user: User;
  lastMessage: Message;
}