'use client';

import { useEffect, useMemo, useState } from 'react';
import { createContact, getCompanies, findDuplicateContactsByEmail } from '@/lib/data/store';
import type { Company, Contact } from '@/lib/types/entities';
import { trackEvent } from '@/lib/utils/analytics';
import { useToast } from '@/components/ui/ToastProvider';

interface ContactFormProps {
  onSuccess: (contact: Contact) => void;
  onCancel?: () => void;
}

function validateEmail(email?: string): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function ContactForm({ onSuccess, onCancel }: ContactFormProps) {
  const showToast = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyQuery, setCompanyQuery] = useState('');
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const companies = useMemo<Company[]>(() => getCompanies(), []);
  const filteredCompanies = useMemo(() => {
    const q = companyQuery.trim().toLowerCase();
    if (!q) return companies.slice(0, 20);
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q)
    ).slice(0, 20);
  }, [companies, companyQuery]);

  const duplicates = useMemo(() => {
    return email ? findDuplicateContactsByEmail(email) : [];
  }, [email]);

  // Keep companyId in sync when query changes (if exact match selected)
  useEffect(() => {
    if (!companyQuery) {
      setCompanyId(undefined);
      return;
    }
    const exact = companies.find((c) => c.name.toLowerCase() === companyQuery.trim().toLowerCase());
    if (exact) {
      setCompanyId(exact.id);
    }
  }, [companyQuery, companies]);

  useEffect(() => {
    setErrorMsg(null);
  }, [firstName, lastName, email, phone, companyQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    trackEvent('contact_new_click', { source: 'quick_action_modal' });

    if (!firstName.trim()) {
      setErrorMsg('First name is required.');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg('A valid email address is required.');
      return;
    }

    if (duplicates.length > 0) {
      const proceed = window.confirm(
        `A contact with this email already exists (${duplicates[0].email}). Do you want to update association information by creating anyway?`
      );
      if (!proceed) {
        return;
      }
    }

    setLoading(true);
    try {
      const result = createContact({
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        email: email.trim(),
        phone: phone.trim() || undefined,
        companyId,
      });

      if (!result.ok) {
        setErrorMsg(result.error);
        trackEvent('contact_new_error', { error: result.error, field: result.field });
        showToast({
          title: 'Could not create contact',
          description: result.error,
          variant: 'error',
        });
        setLoading(false);
        return;
      }

      trackEvent('contact_new_success', { id: result.data.id });
      showToast({
        title: 'Contact created',
        description: `${firstName}${lastName ? ' ' + lastName : ''} has been added.`,
        variant: 'success',
      });

      onSuccess(result.data);
    } catch (err: any) {
      const msg = err?.message || 'Unexpected error creating contact.';
      setErrorMsg(msg);
      trackEvent('contact_new_error', { error: msg });
      showToast({
        title: 'Unexpected error',
        description: msg,
        variant: 'error',
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-describedby={errorMsg ? 'contact-form-error' : undefined}>
      <div className="space-y-4">
        {errorMsg && (
          <div id="contact-form-error" className="p-3 rounded-md border border-red-300 bg-red-50 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {duplicates.length > 0 && (
          <div className="p-3 rounded-md border border-yellow-300 bg-yellow-50 text-sm text-yellow-900">
            A contact with this email exists already. Creating may result in duplicates.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-first-name">
              First Name<span className="text-red-600"> *</span>
            </label>
            <input
              id="contact-first-name"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Jane"
              aria-invalid={!!errorMsg && !firstName.trim()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-last-name">
              Last Name
            </label>
            <input
              id="contact-last-name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-email">
              Email<span className="text-red-600"> *</span>
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="jane.doe@acme.com"
              aria-invalid={!!email && !validateEmail(email)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-phone">
              Phone
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="+1 (555) 555-5555"
            />
          </div>
        </div>

        {/* Company association search/select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-company">
            Company (search & select)
          </label>
          <input
            id="contact-company"
            type="text"
            value={companyQuery}
            onChange={(e) => setCompanyQuery(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Type to search company…"
            aria-autocomplete="list"
            aria-controls="company-options"
            role="combobox"
            aria-expanded={!!companyQuery}
          />
          {filteredCompanies.length > 0 && (
            <div
              id="company-options"
              role="listbox"
              className="mt-2 max-h-48 overflow-auto rounded-md border border-gray-200 bg-white shadow"
            >
              {filteredCompanies.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="option"
                  aria-selected={companyId === c.id}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                    companyId === c.id ? 'bg-primary/10 text-primary' : 'text-gray-900'
                  }`}
                  onClick={() => {
                    setCompanyQuery(c.name);
                    setCompanyId(c.id);
                  }}
                >
                  <div className="font-medium">{c.name}</div>
                  {c.email && <div className="text-gray-500">{c.email}</div>}
                </button>
              ))}
            </div>
          )}
          {companyId && (
            <p className="mt-1 text-xs text-gray-500">Selected company ID: {companyId}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
          aria-busy={loading}
        >
          {loading ? 'Creating…' : 'Create Contact'}
        </button>
      </div>
    </form>
  );
}