'use client';

import { Company, Contact } from '@/lib/types/entities';

const KEY_COMPANIES = 'ass_demo_companies_v1';
const KEY_CONTACTS = 'ass_demo_contacts_v1';

type Listener = (payload: { type: 'company' | 'contact'; action: 'create' | 'update' | 'delete'; data: Company | Contact }) => void;

let listeners: Set<Listener> = new Set();

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit(payload: Parameters<Listener>[0]) {
  listeners.forEach((l) => l(payload));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('store:update', { detail: payload }));
  }
}

// Public API

export function getCompanies(): Company[] {
  return read<Company[]>(KEY_COMPANIES, []);
}

export function getContacts(): Contact[] {
  return read<Contact[]>(KEY_CONTACTS, []);
}

export interface CreateCompanyInput {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
}

export interface CreateContactInput {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  companyId?: string;
}

export type CreateResult<T> = { ok: true; data: T } | { ok: false; error: string; field?: string };

export function createCompany(input: CreateCompanyInput): CreateResult<Company> {
  const companies = getCompanies();

  // Client-side validation
  if (!input.name?.trim()) {
    return { ok: false, error: 'Company name is required.', field: 'name' };
  }

  // Uniqueness: name and/or email
  const nameExists = companies.some((c) => c.name.trim().toLowerCase() === input.name.trim().toLowerCase());
  if (nameExists) {
    return { ok: false, error: 'A company with this name already exists.', field: 'name' };
  }

  if (input.email) {
    const emailExists = companies.some((c) => (c.email || '').trim().toLowerCase() === input.email!.trim().toLowerCase());
    if (emailExists) {
      return { ok: false, error: 'A company with this email already exists.', field: 'email' };
    }
  }

  const company: Company = {
    id: uid('co'),
    name: input.name.trim(),
    email: input.email?.trim(),
    phone: input.phone?.trim(),
    website: input.website?.trim(),
    address: input.address?.trim(),
    createdAt: Date.now(),
  };

  const next = [company, ...companies];
  write(KEY_COMPANIES, next);

  emit({ type: 'company', action: 'create', data: company });

  return { ok: true, data: company };
}

export function createContact(input: CreateContactInput): CreateResult<Contact> {
  const contacts = getContacts();

  // Validation
  if (!input.firstName?.trim()) {
    return { ok: false, error: 'First name is required.', field: 'firstName' };
  }
  if (!input.email?.trim()) {
    return { ok: false, error: 'Email is required.', field: 'email' };
  }
  const emailNorm = input.email.trim().toLowerCase();
  const emailExists = contacts.some((c) => c.email.trim().toLowerCase() === emailNorm);
  if (emailExists) {
    return { ok: false, error: 'A contact with this email already exists.', field: 'email' };
  }

  const contact: Contact = {
    id: uid('ct'),
    firstName: input.firstName.trim(),
    lastName: input.lastName?.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim(),
    companyId: input.companyId,
    createdAt: Date.now(),
  };

  const next = [contact, ...contacts];
  write(KEY_CONTACTS, next);

  emit({ type: 'contact', action: 'create', data: contact });

  return { ok: true, data: contact };
}

export function findDuplicateCompaniesByNameOrEmail(name?: string, email?: string): Company[] {
  const companies = getCompanies();
  const n = name?.trim().toLowerCase();
  const e = email?.trim().toLowerCase();
  return companies.filter((c) => {
    const cn = c.name.trim().toLowerCase();
    const ce = (c.email || '').trim().toLowerCase();
    return (n && cn === n) || (e && ce && ce === e);
  });
}

export function findDuplicateContactsByEmail(email?: string): Contact[] {
  if (!email) return [];
  const contacts = getContacts();
  const e = email.trim().toLowerCase();
  return contacts.filter((c) => c.email.trim().toLowerCase() === e);
}

export function upsertCompanyByEmailOrName(input: CreateCompanyInput): { created: boolean; data: Company } {
  const companies = getCompanies();
  const n = input.name.trim().toLowerCase();
  const e = input.email?.trim().toLowerCase();

  const idx = companies.findIndex((c) => c.name.trim().toLowerCase() === n || (!!e && (c.email || '').trim().toLowerCase() === e));
  if (idx >= 0) {
    const updated: Company = {
      ...companies[idx],
      // Only overwrite when provided
      email: input.email ?? companies[idx].email,
      phone: input.phone ?? companies[idx].phone,
      website: input.website ?? companies[idx].website,
      address: input.address ?? companies[idx].address,
    };
    const next = [...companies];
    next[idx] = updated;
    write(KEY_COMPANIES, next);
    emit({ type: 'company', action: 'update', data: updated });
    return { created: false, data: updated };
  }
  const created = createCompany(input);
  if (created.ok) return { created: true, data: created.data };
  // If failed validation fallback to throw for import caller to handle row error
  throw new Error(created.error);
}

export function upsertContactByEmail(input: CreateContactInput): { created: boolean; data: Contact } {
  const contacts = getContacts();
  const e = input.email.trim().toLowerCase();

  const idx = contacts.findIndex((c) => c.email.trim().toLowerCase() === e);
  if (idx >= 0) {
    const updated: Contact = {
      ...contacts[idx],
      firstName: input.firstName || contacts[idx].firstName,
      lastName: input.lastName ?? contacts[idx].lastName,
      phone: input.phone ?? contacts[idx].phone,
      companyId: input.companyId ?? contacts[idx].companyId,
    };
    const next = [...contacts];
    next[idx] = updated;
    write(KEY_CONTACTS, next);
    emit({ type: 'contact', action: 'update', data: updated });
    return { created: false, data: updated };
  }
  const created = createContact(input);
  if (created.ok) return { created: true, data: created.data };
  throw new Error(created.error);
}