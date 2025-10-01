import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompanyForm from '@/components/forms/CompanyForm';
import * as store from '@/lib/data/store';
import * as analytics from '@/lib/utils/analytics';

// Mock dependencies
vi.mock('@/lib/data/store');
vi.mock('@/lib/utils/analytics');
vi.mock('@/components/ui/ToastProvider', () => ({
  useToast: () => vi.fn(),
}));

describe('CompanyForm', () => {
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(store.findDuplicateCompaniesByNameOrEmail).mockReturnValue([]);
  });

  it('renders all form fields', () => {
    render(<CompanyForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Website/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
  });

  it('validates required company name', async () => {
    render(<CompanyForm onSuccess={mockOnSuccess} />);

    const submitBtn = screen.getByRole('button', { name: /Create Company/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Company name is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<CompanyForm onSuccess={mockOnSuccess} />);

    const nameInput = screen.getByLabelText(/Company Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    
    fireEvent.change(nameInput, { target: { value: 'Test Co' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const submitBtn = screen.getByRole('button', { name: /Create Company/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    });
  });

  it('shows duplicate warning when company exists', async () => {
    const existing = [{ id: '1', name: 'Existing Co', email: 'test@example.com', createdAt: Date.now() }];
    vi.mocked(store.findDuplicateCompaniesByNameOrEmail).mockReturnValue(existing);

    render(<CompanyForm onSuccess={mockOnSuccess} />);

    const nameInput = screen.getByLabelText(/Company Name/i);
    fireEvent.change(nameInput, { target: { value: 'Existing Co' } });

    await waitFor(() => {
      expect(screen.getByText(/Possible duplicates found/i)).toBeInTheDocument();
      expect(screen.getByText(/Existing Co/i)).toBeInTheDocument();
    });
  });

  it('calls createCompany and onSuccess when valid', async () => {
    const newCompany = { id: 'co_123', name: 'New Co', email: 'new@example.com', createdAt: Date.now() };
    vi.mocked(store.createCompany).mockReturnValue({ ok: true, data: newCompany });

    render(<CompanyForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'New Co' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'new@example.com' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Company/i }));

    await waitFor(() => {
      expect(store.createCompany).toHaveBeenCalledWith({
        name: 'New Co',
        email: 'new@example.com',
        phone: undefined,
        website: undefined,
        address: undefined,
      });
      expect(mockOnSuccess).toHaveBeenCalledWith(newCompany);
      expect(analytics.trackEvent).toHaveBeenCalledWith('company_new_success', { id: 'co_123' });
    });
  });

  it('handles creation errors gracefully', async () => {
    vi.mocked(store.createCompany).mockReturnValue({
      ok: false,
      error: 'Company already exists',
      field: 'name',
    });

    render(<CompanyForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'Duplicate' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Company/i }));

    await waitFor(() => {
      expect(screen.getByText(/Company already exists/i)).toBeInTheDocument();
      expect(analytics.trackEvent).toHaveBeenCalledWith('company_new_error', {
        error: 'Company already exists',
        field: 'name',
      });
    });
  });
});