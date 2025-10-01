export enum ContactStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Lead = 'Lead'
}

export enum ContactSource {
  Website = 'Website',
  Referral = 'Referral',
  Import = 'Import',
  Manual = 'Manual'
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  companyId?: string;
  company?: {
    id: string;
    companyName: string;
  };
  jobTitle?: string;
  department?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  status: ContactStatus;
  source: ContactSource;
  tags: string[];
  notes?: string;
  customFields?: Record<string, any>;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface ContactFilters {
  search?: string;
  status?: ContactStatus[];
  companyId?: string;
  tags?: string[];
  source?: ContactSource[];
  createdAfter?: string;
  createdBefore?: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  companyId?: string;
  jobTitle?: string;
  department?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  status: ContactStatus;
  tags: string[];
  notes?: string;
}