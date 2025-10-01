'use client';

import { EmptyState } from '@/components/shared';
import Link from 'next/link';

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
              <p className="mt-2 text-sm text-gray-700">
                Manage all your business companies and organizations in one place.
              </p>
            </div>
          </div>

          <div className="bg-neutral-white rounded-lg shadow-md border border-gray-200">
            <EmptyState
              icon={
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              }
              title="Companies module coming soon"
              description="The Companies management section is currently under development. This feature will allow you to manage business entities, track relationships, and link contacts to companies."
              action={
                <Link
                  href="/contacts"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-neutral-white bg-primary hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  View Contacts
                </Link>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}