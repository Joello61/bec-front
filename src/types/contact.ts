export interface Contact {
  id: number;
  nom: string;
  email: string;
  sujet: string;
  message: string;
  createdAt: string;
}

export interface CreateContactInput {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}

// Types d'export
export type { Contact as default };