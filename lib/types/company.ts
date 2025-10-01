export enum CompanySize {
  XSmall = '1-10',
  Small = '11-50',
  Medium = '51-200',
  Large = '201-500',
  XLarge = '501+'
}

export enum RelationshipStatus {
  Prospect = 'Prospect',
  Active = 'Active',
  Inactive = 'Inactive',
  Lost = 'Lost'
}

export interface Company {
  id: string;
  companyName: string;
  industry?: string;
  companySize?: CompanySize;
  website?: string;
  primaryPhone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  relationshipStatus: RelationshipStatus;
  annualRevenue?: number;
  logoUrl?: string;
  description?: string;
  tags: string[];
  customFields?: Record<string, any>;
  contactCount?: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CompanyFilters {
  search?: string;
  industry?: string[];
  companySize?: CompanySize[];
  relationshipStatus?: RelationshipStatus[];
  tags?: string[];
  createdAfter?: string;
  createdBefore?: string;
}

export interface CompanyFormData {
  companyName: string;
  industry?: string;
  companySize?: CompanySize;
  website?: string;
  primaryPhone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  relationshipStatus: RelationshipStatus;
  annualRevenue?: number;
  description?: string;
  tags: string[];
}