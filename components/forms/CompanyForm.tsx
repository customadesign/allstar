'use client';

import { useEffect, useMemo, useState } from 'react';
import { createCompany, findDuplicateCompaniesByNameOrEmail } from '@/lib/data/store';
import type { Company } from '@/lib/types/entities';
import { trackEvent } from '@/lib/utils/analytics';
import { useToast } from '@/components/ui/ToastProvider';

interface CompanyFormProps {
  onSuccess: (company: Company) => void;
  onCancel?: () => void;
}

function validateEmail(email?: string): boolean {
  if (!email) return true;
  // Simple email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function CompanyForm({ onSuccess, onCancel }: CompanyFormProps) {
  const showToast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const duplicates = useMemo(() => {
    if (!name && !email) return [];
    return findDuplicateCompaniesByNameOrEmail(name, email);
  }, [name, email]);

  useEffect(() => {
    setErrorMsg(null);
  }, [name, email, phone, website, address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    trackEvent('company_new_click', { source: 'quick_action_modal' });

    // Client-side validation
    if (!name.trim()) {
      setErrorMsg('Company name is required.');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // Graceful duplicate detection hint (does not block, store enforces uniqueness)
    if (duplicates.length > 0) {
      // Let user confirm they want to proceed
      const proceed = window.confirm(
        `We found ${duplicates.length} existing compan${duplicates.length === 1 ? 'y' : 'ies'} with the same name or email. Continue anyway?`
      );
      if (!proceed) {
        return;
      }
    }

    setLoading(true);
    try {
      const result = createCompany({
        name,
        email: email || undefined,
        phone: phone || undefined,
        website: website || undefined,
        address: address || undefined,
      });
      if (!result.ok) {
        setErrorMsg(result.error);
        trackEvent('company_new_error', { error: result.error, field: result.field });
        showToast({
          title: 'Could not create company',
          description: result.error,
          variant: 'error',
        });
        setLoading(false);
        return;
      }

      trackEvent('company_new_success', { id: result.data.id });
      showToast({
        title: 'Company created',
        description: `${result.data.name} has been added.`,
        variant: 'success',
        actionLabel: 'View',
        onAction: () => {
          // In this demo, we don't have a company detail route; keep as a no-op or log
          // eslint-disable-next-line no-console
          console.info('View company', result.data);
        },
      });

      onSuccess(result.data);
    } catch (err: any) {
      const msg = err?.message || 'Unexpected error creating company.';
      setErrorMsg(msg);
      trackEvent('company_new_error', { error: msg });
      showToast({
        title: 'Unexpected error',
        description: msg,
        variant: 'error',
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-describedby={errorMsg ? 'company-form-error' : undefined}>
      <div className="space-y-4">
        {errorMsg && (
          <div id="company-form-error" className="p-3 rounded-md border border-red-300 bg-red-50 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {duplicates.length > 0 && (
          <div className="p-3 rounded-md border border-yellow-300 bg-yellow-50 text-sm text-yellow-900">
            Possible duplicates found:
            <ul className="mt-1 list-disc list-inside">
              {duplicates.slice(0, 3).map((d) => (
                <li key={d.id}>
                  {d.name} {d.email ? `(${d.email})` : ''}
                </li>
              ))}
              {duplicates.length > 3 && <li>and {duplicates.length - 3} more…</li>}
            </ul>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company-name">
            Company Name<span className="text-red-600"> *</span>
          </label>
          <input
            id="company-name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Acme Corporation"
            aria-invalid={!!errorMsg && !name.trim()}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company-email">
              Email
            </label>
            <input
              id="company-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="info@acme.com"
              aria-invalid={!!email && !validateEmail(email)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company-phone">
              Phone
            </label>
            <input
              id="company-phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="+1 (555) 555-5555"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company-website">
            Website
          </label>
          <input
            id="company-website"
            name="website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="https://www.acme.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company-address">
            Address
          </label>
          <textarea
            id="company-address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            rows={3}
            placeholder="123 Main St, Springfield, USA"
          />
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
          {loading ? 'Creating…' : 'Create Company'}
        </button>
      </div>
    </form>
  );
}