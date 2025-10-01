'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BaseLayout from '@/components/layout/BaseLayout';
import { StatusBadge, TagPills, LoadingSpinner, EmptyState, ConfirmDialog } from '@/components/shared';
import { contactsStorage } from '@/lib/services/contactsStorage';
import { Contact } from '@/lib/types';

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const loadedContact = contactsStorage.getById(params.id);
    setContact(loadedContact || null);
    setIsLoading(false);
  }, [params.id]);

  const handleDelete = () => {
    if (contact) {
      contactsStorage.delete(contact.id);
      router.push('/contacts');
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Lead':
        return 'info';
      case 'Inactive':
        return 'default';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <BaseLayout>
        <LoadingSpinner size="lg" className="py-12" />
      </BaseLayout>
    );
  }

  if (!contact) {
    return (
      <BaseLayout>
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
          title="Contact not found"
          description="The contact you're looking for doesn't exist or has been deleted."
          action={
            <Link
              href="/contacts"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
            >
              Back to Contacts
            </Link>
          }
        />
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {contact.firstName} {contact.lastName}
              </h1>
              {contact.jobTitle && (
                <p className="mt-1 text-sm text-gray-500">
                  {contact.jobTitle}
                  {contact.company && ` at ${contact.company.companyName}`}
                </p>
              )}
              <div className="mt-2">
                <StatusBadge
                  status={contact.status}
                  variant={getStatusVariant(contact.status)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/contacts/${contact.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </Link>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>

          {/* Contact Information Grid */}
          <div className="border-t border-gray-200">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
              {/* Email */}
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800">
                    {contact.email}
                  </a>
                </dd>
              </div>

              {/* Phone */}
              {contact.phone && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-800">
                      {contact.phone}
                    </a>
                  </dd>
                </div>
              )}

              {/* Mobile */}
              {contact.mobile && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Mobile</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a href={`tel:${contact.mobile}`} className="text-blue-600 hover:text-blue-800">
                      {contact.mobile}
                    </a>
                  </dd>
                </div>
              )}

              {/* Company */}
              {contact.company && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <Link
                      href={`/companies/${contact.companyId}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {contact.company.companyName}
                    </Link>
                  </dd>
                </div>
              )}

              {/* Department */}
              {contact.department && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Department</dt>
                  <dd className="mt-1 text-sm text-gray-900">{contact.department}</dd>
                </div>
              )}

              {/* Source */}
              <div>
                <dt className="text-sm font-medium text-gray-500">Source</dt>
                <dd className="mt-1 text-sm text-gray-900">{contact.source}</dd>
              </div>

              {/* Address */}
              {(contact.addressLine1 || contact.city) && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {contact.addressLine1 && <div>{contact.addressLine1}</div>}
                    {contact.addressLine2 && <div>{contact.addressLine2}</div>}
                    {(contact.city || contact.state || contact.postalCode) && (
                      <div>
                        {contact.city}
                        {contact.state && `, ${contact.state}`}
                        {contact.postalCode && ` ${contact.postalCode}`}
                      </div>
                    )}
                    {contact.country && <div>{contact.country}</div>}
                  </dd>
                </div>
              )}

              {/* Tags */}
              {contact.tags && contact.tags.length > 0 && (
                <div className="sm:col-span-3">
                  <dt className="text-sm font-medium text-gray-500 mb-2">Tags</dt>
                  <dd className="mt-1">
                    <TagPills tags={contact.tags} />
                  </dd>
                </div>
              )}

              {/* Notes */}
              {contact.notes && (
                <div className="sm:col-span-3">
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                    {contact.notes}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Activity Timeline Placeholder */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Activity Timeline</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Recent quotes and interactions</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="flex items-center justify-center h-48 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500 italic">Activity timeline coming soon</p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="flex justify-start">
          <Link
            href="/contacts"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Contacts
          </Link>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Contact"
        message={`Are you sure you want to delete ${contact.firstName} ${contact.lastName}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </BaseLayout>
  );
}