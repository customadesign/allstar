// Shared entity types for the demo app

export interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  createdAt: number; // epoch ms
}

export interface Contact {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  companyId?: string;
  createdAt: number; // epoch ms
}

export type ImportEntityType = 'companies' | 'contacts';

export function displayContactName(c: Contact): string {
  return [c.firstName, c.lastName].filter(Boolean).join(' ').trim() || c.email;
}