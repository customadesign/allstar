'use client';

import { useState, useEffect } from 'react';
import { ContactsList } from '@/components/contacts';
import { ConfirmDialog } from '@/components/shared';
import { contactsStorage } from '@/lib/services/contactsStorage';
import { Contact } from '@/lib/types';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteContactId, setDeleteContactId] = useState<string | null>(null);

  useEffect(() => {
    // Load contacts from localStorage
    setIsLoading(true);
    const loadedContacts = contactsStorage.getAll();
    setContacts(loadedContacts);
    setIsLoading(false);
  }, []);

  const handleDeleteRequest = (id: string) => {
    setDeleteContactId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteContactId) {
      contactsStorage.delete(deleteContactId);
      setContacts(contactsStorage.getAll());
      setDeleteContactId(null);
    }
  };

  const contactToDelete = deleteContactId
    ? contacts.find(c => c.id === deleteContactId)
    : null;

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all your business contacts in one place. Search, filter, and organize your contact list.
          </p>
        </div>
      </div>

      <ContactsList
        contacts={contacts}
        isLoading={isLoading}
        onDelete={handleDeleteRequest}
      />

      <ConfirmDialog
        isOpen={deleteContactId !== null}
        title="Delete Contact"
        message={
          contactToDelete
            ? `Are you sure you want to delete ${contactToDelete.firstName} ${contactToDelete.lastName}? This action cannot be undone.`
            : 'Are you sure you want to delete this contact?'
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteContactId(null)}
      />
    </div>
  );
}