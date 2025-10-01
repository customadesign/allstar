import { Contact, ContactStatus, ContactSource } from '../types';

const CONTACTS_STORAGE_KEY = 'all-star-signs-contacts';

// Mock data for demo purposes
const mockContacts: Contact[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@acmecorp.com',
    phone: '(555) 123-4567',
    mobile: '(555) 987-6543',
    companyId: '1',
    company: { id: '1', companyName: 'Acme Corporation' },
    jobTitle: 'Marketing Director',
    department: 'Marketing',
    addressLine1: '123 Main Street',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'USA',
    status: ContactStatus.Active,
    source: ContactSource.Referral,
    tags: ['VIP', 'Decision Maker'],
    notes: 'Key contact for large orders',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@techstart.io',
    phone: '(555) 234-5678',
    companyId: '2',
    company: { id: '2', companyName: 'TechStart Inc' },
    jobTitle: 'Operations Manager',
    department: 'Operations',
    city: 'San Francisco',
    state: 'CA',
    status: ContactStatus.Active,
    source: ContactSource.Website,
    tags: ['Tech', 'Fast Response'],
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString()
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.j@globalretail.com',
    phone: '(555) 345-6789',
    companyId: '3',
    company: { id: '3', companyName: 'Global Retail Group' },
    jobTitle: 'Store Manager',
    city: 'Chicago',
    state: 'IL',
    status: ContactStatus.Lead,
    source: ContactSource.Manual,
    tags: ['Retail', 'Large Account'],
    createdAt: new Date('2024-03-10').toISOString(),
    updatedAt: new Date('2024-03-10').toISOString()
  }
];

export const contactsStorage = {
  getAll(): Contact[] {
    if (typeof window === 'undefined') return mockContacts;
    
    const stored = localStorage.getItem(CONTACTS_STORAGE_KEY);
    if (!stored) {
      // Initialize with mock data
      this.setAll(mockContacts);
      return mockContacts;
    }
    return JSON.parse(stored);
  },

  setAll(contacts: Contact[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
  },

  getById(id: string): Contact | undefined {
    return this.getAll().find(contact => contact.id === id);
  },

  create(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact {
    const contacts = this.getAll();
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    contacts.push(newContact);
    this.setAll(contacts);
    return newContact;
  },

  update(id: string, updates: Partial<Contact>): Contact | undefined {
    const contacts = this.getAll();
    const index = contacts.findIndex(c => c.id === id);
    
    if (index === -1) return undefined;
    
    const updatedContact = {
      ...contacts[index],
      ...updates,
      id: contacts[index].id, // Preserve ID
      updatedAt: new Date().toISOString()
    };
    
    contacts[index] = updatedContact;
    this.setAll(contacts);
    return updatedContact;
  },

  delete(id: string): boolean {
    const contacts = this.getAll();
    const filtered = contacts.filter(c => c.id !== id);
    
    if (filtered.length === contacts.length) return false;
    
    this.setAll(filtered);
    return true;
  },

  search(query: string): Contact[] {
    const contacts = this.getAll();
    const lowerQuery = query.toLowerCase();
    
    return contacts.filter(contact =>
      contact.firstName.toLowerCase().includes(lowerQuery) ||
      contact.lastName.toLowerCase().includes(lowerQuery) ||
      contact.email.toLowerCase().includes(lowerQuery) ||
      contact.company?.companyName.toLowerCase().includes(lowerQuery) ||
      (contact.phone && contact.phone.includes(query))
    );
  }
};