'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { KanbanCard } from '@/lib/mock-data/kanban';

interface BusinessDetailsModalProps {
  card: KanbanCard | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (cardId: string, updates: Partial<KanbanCard>) => void;
  isAdmin?: boolean;
}

export default function BusinessDetailsModal({
  card,
  isOpen,
  onClose,
  onUpdate,
  isAdmin = true,
}: BusinessDetailsModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<Partial<KanbanCard>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when card changes
  useEffect(() => {
    if (card) {
      setFormData({
        customer: card.customer,
        title: card.title,
        assignee: card.assignee,
        dueDate: card.dueDate,
        isRush: card.isRush,
        value: card.value,
        notes: card.notes,
      });
      setHasUnsavedChanges(false);
    }
  }, [card]);

  // Handle deep-linking
  useEffect(() => {
    const businessId = searchParams.get('businessId');
    if (businessId && !isOpen) {
      // Modal should be opened by parent component based on URL param
    }
  }, [searchParams, isOpen]);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmClose) return;
    }
    
    // Clear URL param
    const params = new URLSearchParams(searchParams.toString());
    params.delete('businessId');
    router.replace(`/kanban${params.toString() ? `?${params.toString()}` : ''}`);
    
    onClose();
  };

  const handleFieldChange = (field: string, value: any) => {
    if (!isAdmin) return; // Prevent changes for non-admins
    
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customer?.trim()) {
      newErrors.customer = 'Customer name is required';
    }
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Job title is required';
    }
    
    if (formData.value && formData.value < 0) {
      newErrors.value = 'Value must be positive';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!card || !isAdmin) return;
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the card
      onUpdate(card.id, formData);
      
      // Log audit entry
      console.log('Audit log:', {
        action: 'update_business',
        businessId: card.id,
        userId: 'admin-user',
        timestamp: new Date().toISOString(),
        changes: formData,
      });
      
      setHasUnsavedChanges(false);
      
      // Show success notification
      alert('Business details updated successfully');
    } catch (error) {
      console.error('Failed to update business:', error);
      alert('Failed to update business details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !card) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="business-details-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 id="business-details-title" className="text-xl font-bold text-gray-900">
              Business Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {card.jobNumber} • {isAdmin ? 'Admin View' : 'Read-Only View'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4 space-y-6">
          {/* Basic Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  id="customer"
                  type="text"
                  value={formData.customer || ''}
                  onChange={(e) => handleFieldChange('customer', e.target.value)}
                  disabled={!isAdmin}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                    !isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''
                  } ${errors.customer ? 'border-red-500' : 'border-gray-300'}`}
                  aria-invalid={!!errors.customer}
                />
                {errors.customer && <p className="mt-1 text-sm text-red-600">{errors.customer}</p>}
              </div>

              <div>
                <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
                  Assignee
                </label>
                <input
                  id="assignee"
                  type="text"
                  value={formData.assignee || ''}
                  onChange={(e) => handleFieldChange('assignee', e.target.value)}
                  disabled={!isAdmin}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                    !isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  disabled={!isAdmin}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                    !isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''
                  } ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  aria-invalid={!!errors.title}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Value ($)
                </label>
                <input
                  id="value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.value || ''}
                  onChange={(e) => handleFieldChange('value', parseFloat(e.target.value) || 0)}
                  disabled={!isAdmin}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                    !isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''
                  } ${errors.value ? 'border-red-500' : 'border-gray-300'}`}
                  aria-invalid={!!errors.value}
                />
                {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value}</p>}
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleFieldChange('dueDate', e.target.value ? new Date(e.target.value) : null)}
                  disabled={!isAdmin}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                    !isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="isRush" className="flex items-center gap-2">
                  <input
                    id="isRush"
                    type="checkbox"
                    checked={formData.isRush || false}
                    onChange={(e) => handleFieldChange('isRush', e.target.checked)}
                    disabled={!isAdmin}
                    className={`w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded ${
                      !isAdmin ? 'cursor-not-allowed' : ''
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700">Rush Order</span>
                </label>
              </div>
            </div>
          </section>

          {/* Notes Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            {formData.notes && formData.notes.length > 0 ? (
              <div className="space-y-2">
                {formData.notes.map((note, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700">{note}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No notes yet</p>
            )}
          </section>

          {/* Metadata */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Job Number:</span>
                  <span className="ml-2 text-gray-600">{card.jobNumber}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Stage:</span>
                  <span className="ml-2 text-gray-600">{card.stage}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="ml-2 text-gray-600">
                    {card.isOverdue ? 'Overdue' : 'On Track'}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {isAdmin && hasUnsavedChanges ? 'Cancel' : 'Close'}
          </button>
          
          {isAdmin && (
            <button
              onClick={handleSave}
              disabled={isSubmitting || !hasUnsavedChanges}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}