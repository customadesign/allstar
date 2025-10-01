# Product Requirements Document
## Contacts & Companies Management Modules

**Version:** 1.0  
**Date:** January 2025  
**Author:** Product Team  
**Status:** Draft for Review

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [Business Objectives](#3-business-objectives)
4. [User Personas & Use Cases](#4-user-personas--use-cases)
5. [Contacts Management Module](#5-contacts-management-module)
6. [Companies Management Module](#6-companies-management-module)
7. [Navigation Integration](#7-navigation-integration)
8. [Data Schema](#8-data-schema)
9. [UI/UX Specifications](#9-uiux-specifications)
10. [Functional Requirements](#10-functional-requirements)
11. [Technical Architecture](#11-technical-architecture)
12. [User Permissions & Access Control](#12-user-permissions--access-control)
13. [Import/Export Functionality](#13-importexport-functionality)
14. [Error Handling & User States](#14-error-handling--user-states)
15. [Performance Requirements](#15-performance-requirements)
16. [Accessibility Requirements](#16-accessibility-requirements)
17. [Success Criteria & KPIs](#17-success-criteria--kpis)
18. [Implementation Phases](#18-implementation-phases)
19. [Dependencies & Risks](#19-dependencies--risks)
20. [Appendices](#20-appendices)

---

## 1. Executive Summary

This PRD defines the requirements for implementing two interconnected customer relationship management (CRM) modules: **Contacts Management** and **Companies Management**. These modules will enable users to centralize, organize, and manage business relationships within the All Star Signs application.

### Key Features
- Comprehensive contact and company data management
- Advanced search, filtering, and sorting capabilities
- CSV/Excel import functionality with data validation
- Relationship mapping between contacts and companies
- Integration with existing application workflows
- Role-based access control
- Mobile-responsive design

### Business Value
- Centralized customer data repository
- Improved customer relationship tracking
- Enhanced quote-to-customer linking
- Data-driven business insights
- Reduced duplicate data entry

---

## 2. Product Overview

### 2.1 Vision
Create a robust CRM foundation that enables All Star Signs to manage customer relationships effectively, track interactions, and leverage customer data for business growth.

### 2.2 Goals
1. Provide a single source of truth for contact and company information
2. Enable efficient data entry through bulk imports
3. Support quick access to customer information during quote creation
4. Facilitate relationship tracking between contacts and companies
5. Ensure data integrity and prevent duplicates

### 2.3 Scope

#### In Scope
- Contacts list view with search, filter, and sort
- Contact detail view with full information
- Companies list view with search, filter, and sort
- Company detail view with associated contacts
- CSV/Excel import for both contacts and companies
- Data validation and duplicate detection
- Navigation integration in top menu
- Mobile-responsive design
- Role-based permissions

#### Out of Scope (Future Phases)
- Email integration
- Activity timeline/history
- Advanced reporting and analytics
- CRM workflow automation
- Third-party CRM integrations (Salesforce, HubSpot)
- Custom fields builder UI
- Mass email campaigns
- SMS integration

---

## 3. Business Objectives

### 3.1 Primary Objectives
1. **Reduce data entry time** by 40% through bulk import features
2. **Improve data accuracy** with validation and duplicate detection
3. **Increase quote conversion** by 15% through better customer tracking
4. **Enhance user productivity** with quick search and filtering

### 3.2 Success Metrics
- Time to add 100 contacts (target: < 5 minutes via import)
- Data accuracy rate (target: > 95%)
- User adoption rate (target: > 80% within 30 days)
- Search response time (target: < 500ms)
- Mobile usability score (target: > 85%)

---

## 4. User Personas & Use Cases

### 4.1 Primary Personas

#### Persona 1: Sales Manager (Sarah)
- **Role:** Manages customer relationships and quotes
- **Goals:** Quick access to customer info, track quote history
- **Pain Points:** Scattered customer data, duplicate entries
- **Technical Proficiency:** Medium

#### Persona 2: Operations Coordinator (Mike)
- **Role:** Processes orders and manages production
- **Goals:** Link orders to correct customers, track company contacts
- **Pain Points:** Can't find customer contact info quickly
- **Technical Proficiency:** Medium

#### Persona 3: Admin (Alex)
- **Role:** System administration and data management
- **Goals:** Import/maintain customer data, ensure data quality
- **Pain Points:** Manual data entry, no bulk operations
- **Technical Proficiency:** High

### 4.2 Use Cases

#### UC-1: Import Contacts from Spreadsheet
**Actor:** Admin  
**Preconditions:** User has CSV/Excel file with contact data  
**Flow:**
1. User navigates to Contacts section
2. Clicks "Import Contacts" button
3. Selects CSV/Excel file
4. Reviews field mapping
5. System validates data
6. User confirms import
7. System imports valid records and reports errors

**Success Criteria:** Contacts imported with < 5% error rate

#### UC-2: Search for Contact During Quote Creation
**Actor:** Sales Manager  
**Preconditions:** User is creating a new quote  
**Flow:**
1. User enters customer name in quote form
2. System suggests matching contacts
3. User selects contact
4. Quote auto-fills with contact information

**Success Criteria:** Contact found in < 3 seconds

#### UC-3: View Company with All Associated Contacts
**Actor:** Operations Coordinator  
**Preconditions:** Company exists with linked contacts  
**Flow:**
1. User navigates to Companies section
2. Searches for specific company
3. Opens company detail view
4. Views all associated contacts
5. Clicks contact to view details

**Success Criteria:** All associated contacts displayed correctly

---

## 5. Contacts Management Module

### 5.1 Contact Data Model

#### Core Fields (Required)
- **Contact ID** (auto-generated, UUID)
- **First Name** (required, string, 50 chars max)
- **Last Name** (required, string, 50 chars max)
- **Email** (required, email format, unique)
- **Created Date** (auto-generated, ISO 8601)
- **Modified Date** (auto-updated, ISO 8601)

#### Additional Fields (Optional)
- **Phone** (string, formatted)
- **Mobile** (string, formatted)
- **Company** (relationship, link to Company ID)
- **Job Title** (string, 100 chars max)
- **Department** (string, 50 chars max)
- **Address Line 1** (string, 100 chars max)
- **Address Line 2** (string, 100 chars max)
- **City** (string, 50 chars max)
- **State/Province** (string, 50 chars max)
- **Postal Code** (string, 20 chars max)
- **Country** (string, 50 chars max)
- **Tags** (array of strings, for categorization)
- **Status** (enum: Active, Inactive, Lead)
- **Source** (enum: Website, Referral, Import, Manual)
- **Notes** (text, rich text supported)
- **Custom Fields** (JSON object for extensibility)

### 5.2 Contacts List View

#### Layout
- Full-width table layout
- Sticky header on scroll
- 20 rows per page (configurable in settings)
- Pagination controls at bottom

#### Columns (Default View)
1. Checkbox (for bulk actions)
2. Name (First + Last, clickable)
3. Email (with mailto link)
4. Phone (formatted)
5. Company (linked, if exists)
6. Status (badge with color coding)
7. Tags (compact pill display)
8. Actions (quick actions dropdown)

#### Features
- **Column Customization:** Show/hide columns
- **Sorting:** Click column headers to sort (asc/desc)
- **Filtering:** Filter panel with multiple criteria
- **Search:** Global search across all text fields
- **Bulk Actions:** Delete, export, update tags
- **Quick View:** Hover preview of contact details

### 5.3 Contact Detail View

#### Layout Structure
```
┌─────────────────────────────────────────────┐
│ Header (Name, Status, Actions)              │
├──────────────────┬──────────────────────────┤
│                  │                          │
│  Contact Info    │  Activity Timeline       │
│  (Left Column)   │  (Right Column)          │
│                  │                          │
│  - Basic Info    │  - Recent Quotes         │
│  - Contact       │  - Last Contact          │
│  - Address       │  - Notes History         │
│  - Company Link  │  - File Attachments      │
│  - Tags          │                          │
│  - Custom Fields │                          │
│                  │                          │
└──────────────────┴──────────────────────────┘
```

#### Action Buttons
- **Edit Contact** (pencil icon)
- **Delete Contact** (trash icon, with confirmation)
- **Send Email** (envelope icon, opens email client)
- **Export vCard** (download icon)
- **Add Note** (note icon)

### 5.4 Contact Form (Add/Edit)

#### Form Sections
1. **Basic Information**
   - First Name*, Last Name*, Email*
   - Status dropdown, Source dropdown

2. **Contact Details**
   - Phone, Mobile
   - Job Title, Department

3. **Company Relationship**
   - Company search/select dropdown
   - Auto-complete with company suggestions

4. **Address**
   - Address Line 1, Address Line 2
   - City, State/Province, Postal Code, Country

5. **Categorization**
   - Tags (multi-select with auto-complete)
   - Custom fields (dynamic based on configuration)

6. **Notes**
   - Rich text editor for notes

#### Validation Rules
- Email must be valid format
- Email must be unique (show warning if duplicate)
- Phone numbers formatted automatically
- Required fields marked with asterisk
- Real-time validation feedback

---

## 6. Companies Management Module

### 6.1 Company Data Model

#### Core Fields (Required)
- **Company ID** (auto-generated, UUID)
- **Company Name** (required, string, 100 chars max, unique)
- **Created Date** (auto-generated, ISO 8601)
- **Modified Date** (auto-updated, ISO 8601)

#### Additional Fields (Optional)
- **Industry** (dropdown, predefined list)
- **Company Size** (enum: 1-10, 11-50, 51-200, 201-500, 501+)
- **Website** (URL format)
- **Primary Phone** (string, formatted)
- **Address Line 1** (string, 100 chars max)
- **Address Line 2** (string, 100 chars max)
- **City** (string, 50 chars max)
- **State/Province** (string, 50 chars max)
- **Postal Code** (string, 20 chars max)
- **Country** (string, 50 chars max)
- **Relationship Status** (enum: Prospect, Active, Inactive, Lost)
- **Annual Revenue** (number, optional)
- **Tags** (array of strings)
- **Description** (text, rich text supported)
- **Logo URL** (string, optional)
- **Custom Fields** (JSON object for extensibility)

### 6.2 Companies List View

#### Layout
- Card grid view (default) or table view (toggle)
- 16 cards per page in grid view
- 20 rows per page in table view

#### Grid View Card
```
┌─────────────────────────┐
│ [Logo] Company Name     │
│ Industry • Size         │
│ Location                │
│ ──────────────────────  │
│ 👤 X Contacts           │
│ 📊 X Active Quotes      │
│ [View] [Edit]           │
└─────────────────────────┘
```

#### Table View Columns
1. Checkbox (for bulk actions)
2. Company Name (with logo thumbnail, clickable)
3. Industry
4. Location (City, State)
5. Contact Count
6. Relationship Status (badge)
7. Actions (dropdown)

#### Features
- **View Toggle:** Switch between grid and table
- **Sorting:** By name, size, contacts, status
- **Filtering:** Industry, size, status, location
- **Search:** Across company name, industry
- **Bulk Actions:** Delete, export, update status

### 6.3 Company Detail View

#### Layout Structure
```
┌─────────────────────────────────────────────────────┐
│ Header (Logo, Name, Status, Actions)                │
├────────────────────┬────────────────────────────────┤
│                    │                                │
│  Company Info      │  Contacts at Company           │
│  (Left Column)     │  (Right Column - 60% width)    │
│                    │                                │
│  - Industry        │  ┌──────────────────────────┐ │
│  - Size            │  │ Contact Card 1           │ │
│  - Website         │  └──────────────────────────┘ │
│  - Phone           │  ┌──────────────────────────┐ │
│  - Address         │  │ Contact Card 2           │ │
│  - Revenue         │  └──────────────────────────┘ │
│  - Tags            │                                │
│  - Description     │  [+ Add New Contact]           │
│                    │                                │
├────────────────────┴────────────────────────────────┤
│  Activity & Quotes Tab Section                      │
│  - Recent Quotes                                    │
│  - Project History                                  │
│  - Notes & Files                                    │
└─────────────────────────────────────────────────────┘
```

#### Contact Card in Company View
```
┌─────────────────────────────────┐
│ John Doe                        │
│ 📧 john@company.com             │
│ 📞 (555) 123-4567              │
│ Senior Manager                  │
│ [View Details] [Email]          │
└─────────────────────────────────┘
```

#### Action Buttons
- **Edit Company** (pencil icon)
- **Delete Company** (trash icon, with confirmation)
- **Add Contact** (plus icon, opens contact form pre-filled with company)
- **Export Company Data** (download icon)
- **Add Note** (note icon)

### 6.4 Company Form (Add/Edit)

#### Form Sections
1. **Basic Information**
   - Company Name*, Industry
   - Website, Logo Upload

2. **Business Details**
   - Company Size, Annual Revenue
   - Relationship Status

3. **Contact Information**
   - Primary Phone
   - Address (same fields as Contact)

4. **Categorization**
   - Tags (multi-select)
   - Description (rich text)

5. **Associated Contacts**
   - List of linked contacts (during edit)
   - Quick-add contact button

#### Validation Rules
- Company name required and unique
- Website must be valid URL format
- Phone formatted automatically
- Logo must be image file (JPG, PNG) < 2MB

---

## 7. Navigation Integration

### 7.1 Primary Navigation Update

#### Current Navigation
```tsx
const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Quote Builder', href: '/quote-builder' },
  { name: 'Job Board', href: '/job-board' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Reports', href: '/reports' },
];
```

#### Updated Navigation
```tsx
const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Quote Builder', href: '/quote-builder' },
  { name: 'Contacts', href: '/contacts' },        // NEW
  { name: 'Companies', href: '/companies' },       // NEW
  { name: 'Job Board', href: '/job-board' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Reports', href: '/reports' },
];
```

### 7.2 Navigation Hierarchy

#### Route Structure
```
/contacts
  /contacts                    → Contacts list view
  /contacts/new                → New contact form
  /contacts/[id]               → Contact detail view
  /contacts/[id]/edit          → Edit contact form
  /contacts/import             → Import wizard

/companies
  /companies                   → Companies list view
  /companies/new               → New company form
  /companies/[id]              → Company detail view
  /companies/[id]/edit         → Edit company form
  /companies/import            → Import wizard
```

### 7.3 Active State Indication

- Current page tab highlighted with blue underline
- Active state: `border-blue-500 text-blue-600`
- Inactive state: `border-transparent text-gray-500`
- Hover state: `hover:text-gray-700 hover:border-gray-300`

### 7.4 Mobile Navigation

- Hamburger menu on mobile devices
- Contacts and Companies shown in mobile menu
- Same order as desktop navigation
- Touch-friendly tap targets (minimum 44x44px)

---

## 8. Data Schema

### 8.1 Database Schema

#### contacts Table
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  mobile VARCHAR(20),
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  job_title VARCHAR(100),
  department VARCHAR(50),
  address_line1 VARCHAR(100),
  address_line2 VARCHAR(100),
  city VARCHAR(50),
  state VARCHAR(50),
  postal_code VARCHAR(20),
  country VARCHAR(50),
  status VARCHAR(20) DEFAULT 'Active',
  source VARCHAR(50) DEFAULT 'Manual',
  tags TEXT[],
  notes TEXT,
  custom_fields JSONB,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_company_id ON contacts(company_id);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX idx_contacts_full_name ON contacts(first_name, last_name);
CREATE INDEX idx_contacts_tags ON contacts USING GIN(tags);
```

#### companies Table
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(100) NOT NULL UNIQUE,
  industry VARCHAR(50),
  company_size VARCHAR(20),
  website VARCHAR(255),
  primary_phone VARCHAR(20),
  address_line1 VARCHAR(100),
  address_line2 VARCHAR(100),
  city VARCHAR(50),
  state VARCHAR(50),
  postal_code VARCHAR(20),
  country VARCHAR(50),
  relationship_status VARCHAR(20) DEFAULT 'Prospect',
  annual_revenue DECIMAL(15,2),
  logo_url VARCHAR(500),
  description TEXT,
  tags TEXT[],
  custom_fields JSONB,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_companies_name ON companies(company_name);
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_status ON companies(relationship_status);
CREATE INDEX idx_companies_created_at ON companies(created_at DESC);
CREATE INDEX idx_companies_tags ON companies USING GIN(tags);
```

#### contact_notes Table
```sql
CREATE TABLE contact_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contact_notes_contact_id ON contact_notes(contact_id);
CREATE INDEX idx_contact_notes_created_at ON contact_notes(created_at DESC);
```

#### company_notes Table
```sql
CREATE TABLE company_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_company_notes_company_id ON company_notes(company_id);
CREATE INDEX idx_company_notes_created_at ON company_notes(created_at DESC);
```

### 8.2 TypeScript Interfaces

```typescript
// Contact Types
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  companyId?: string;
  company?: Company;
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

// Company Types
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
  contacts?: Contact[];
  contactCount?: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

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

// List/Filter Types
export interface ContactFilters {
  search?: string;
  status?: ContactStatus[];
  companyId?: string;
  tags?: string[];
  source?: ContactSource[];
  createdAfter?: string;
  createdBefore?: string;
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

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

## 9. UI/UX Specifications

### 9.1 Design System

#### Color Palette
Based on existing All Star Signs design system:

- **Primary:** `#0F172A` (dark blue, from existing theme)
- **Secondary:** `#F5F5F5` (neutral light)
- **Accent:** `#3B82F6` (blue for links and active states)
- **Success:** `#10B981` (green for active status)
- **Warning:** `#F59E0B` (orange for pending/lead)
- **Error:** `#EF4444` (red for inactive/errors)
- **Text Primary:** `#1F2937`
- **Text Secondary:** `#6B7280`
- **Border:** `#E5E7EB`
- **Background:** `#FFFFFF`

#### Status Badge Colors
```tsx
const statusColors = {
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-gray-100 text-gray-800',
  Lead: 'bg-yellow-100 text-yellow-800',
  Prospect: 'bg-blue-100 text-blue-800',
  Lost: 'bg-red-100 text-red-800',
};
```

#### Typography
- **Headings:** Inter font family (existing)
- **H1:** 2.5rem (40px), bold
- **H2:** 2rem (32px), bold
- **H3:** 1.5rem (24px), semibold
- **Body:** 1rem (16px), regular
- **Small:** 0.875rem (14px), regular

#### Spacing
- **XS:** 0.25rem (4px)
- **SM:** 0.5rem (8px)
- **MD:** 1rem (16px)
- **LG:** 1.5rem (24px)
- **XL:** 2rem (32px)
- **2XL:** 3rem (48px)

#### Border Radius
- **Small:** 0.375rem (6px)
- **Medium:** 0.5rem (8px)
- **Large:** 0.75rem (12px)
- **Full:** 9999px (pills/badges)

### 9.2 Component Library

#### Button Variants
```tsx
// Primary Button
<button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 
                   transition-colors font-medium shadow-sm">
  Primary Action
</button>

// Secondary Button
<button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 
                   rounded-lg hover:bg-gray-50 transition-colors font-medium">
  Secondary Action
</button>

// Danger Button
<button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                   transition-colors font-medium">
  Delete
</button>
```

#### Input Fields
```tsx
// Text Input
<input 
  type="text"
  className="w-full px-3 py-2 border border-gray-300 rounded-lg 
             focus:outline-none focus:ring-2 focus:ring-blue-500 
             focus:border-transparent"
  placeholder="Enter text..."
/>

// With Label
<label className="block text-sm font-medium text-gray-700 mb-1">
  Email Address *
  <input 
    type="email"
    required
    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg..."
  />
</label>
```

#### Search Bar
```tsx
<div className="relative">
  <input 
    type="search"
    placeholder="Search contacts..."
    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg..."
  />
  <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
       fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
</div>
```

#### Status Badge
```tsx
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full 
                 text-xs font-medium bg-green-100 text-green-800">
  Active
</span>
```

#### Tag Pill
```tsx
<span className="inline-flex items-center px-2 py-1 rounded-full text-xs 
                 font-medium bg-blue-100 text-blue-700">
  VIP
  <button className="ml-1 hover:text-blue-900">
    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  </button>
</span>
```

### 9.3 Wireframes

#### Contacts List View
```
┌────────────────────────────────────────────────────────────────────┐
│ All Star Signs                                  👤 User ▼         │
│ [Dashboard] [Quote Builder] [Contacts*] [Companies] [Job Board]   │
└────────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────┐
│ Contacts                                    [+ New Contact] [Import]│
├────────────────────────────────────────────────────────────────────┤
│ 🔍 Search contacts...                       [Filter ▼] [⚙ Columns]│
├────────────────────────────────────────────────────────────────────┤
│ ☐ Name ↑          Email          Phone         Company    Status  │
├────────────────────────────────────────────────────────────────────┤
│ ☐ John Doe        john@ex.com    555-1234      Acme Corp  🟢 Active│
│ ☐ Jane Smith      jane@test.com  555-5678      Tech Inc   🟢 Active│
│ ☐ Bob Johnson     bob@email.com  555-9012      StartupCo  🟡 Lead  │
│ ...                                                                 │
├────────────────────────────────────────────────────────────────────┤
│ Showing 1-20 of 156        [← Previous]  1  2  3 ... 8  [Next →] │
└────────────────────────────────────────────────────────────────────┘
```

#### Contact Detail View
```
┌────────────────────────────────────────────────────────────────────┐
│ ← Back to Contacts                          [Edit] [Delete] [⋯]   │
├────────────────────────────────────────────────────────────────────┤
│ John Doe                                              🟢 Active     │
│ Senior Manager at Acme Corp                                        │
├─────────────────────────────┬──────────────────────────────────────┤
│ CONTACT INFORMATION         │ ACTIVITY TIMELINE                    │
│                             │                                      │
│ 📧 john@example.com         │ ┌──────────────────────────────────┐│
│ 📞 (555) 123-4567          │ │ Quote #1234 - $5,000            ││
│ 📱 (555) 987-6543          │ │ 2 days ago                       ││
│                             │ └──────────────────────────────────┘│
│ COMPANY                     │ ┌──────────────────────────────────┐│
│ 🏢 Acme Corp               │ │ Note added by Sarah              ││
│    View Company →           │ │ 1 week ago                       ││
│                             │ └──────────────────────────────────┘│
│ ADDRESS                     │                                      │
│ 123 Main Street            │ [+ Add Note]                         │
│ Suite 100                   │                                      │
│ New York, NY 10001         │                                      │
│                             │                                      │
│ TAGS                        │                                      │
│ [VIP] [Wholesale]          │                                      │
│                             │                                      │
│ NOTES                       │                                      │
│ Prefers email contact...    │                                      │
└─────────────────────────────┴──────────────────────────────────────┘
```

#### Companies List View (Grid)
```
┌────────────────────────────────────────────────────────────────────┐
│ Companies                              [+ New Company] [Import]     │
├────────────────────────────────────────────────────────────────────┤
│ 🔍 Search companies...              [Grid ⊞] [Table ☰] [Filter ▼] │
├────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │
│ │ [Logo] Acme Corp│  │ [Logo] Tech Inc │  │ [Logo] StartupCo│   │
│ │ Manufacturing   │  │ Technology      │  │ Software        │   │
│ │ 📍 NY, USA      │  │ 📍 CA, USA      │  │ 📍 TX, USA      │   │
│ │ ───────────────│  │ ───────────────│  │ ───────────────│   │
│ │ 👤 12 Contacts  │  │ 👤 8 Contacts   │  │ 👤 5 Contacts   │   │
│ │ 🟢 Active       │  │ 🟢 Active       │  │ 🟡 Prospect     │   │
│ │ [View] [Edit]   │  │ [View] [Edit]   │  │ [View] [Edit]   │   │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘   │
│                                                                    │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │
│ │ ...             │  │ ...             │  │ ...             │   │
└────────────────────────────────────────────────────────────────────┘
```

#### Import Wizard
```
┌────────────────────────────────────────────────────────────────────┐
│ Import Contacts                                            [✕ Close]│
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Step 1 of 3: Select File                                          │
│                                                                     │
│ ┌───────────────────────────────────────────────────────────────┐ │
│ │                                                               │ │
│ │    📁 Drag & Drop your CSV or Excel file here               │ │
│ │                 or click to browse                           │ │
│ │                                                               │ │
│ │    Supported formats: .csv, .xlsx, .xls                     │ │
│ │    Maximum file size: 5MB                                    │ │
│ │                                                               │ │
│ └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ Download sample template                                           │
│                                                                     │
│                              [Cancel]  [Next: Map Fields →]        │
└────────────────────────────────────────────────────────────────────┘
```

### 9.4 Responsive Design

#### Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

#### Mobile Adaptations
- **List View:** Cards instead of tables
- **Actions:** Bottom sheet for action menus
- **Forms:** Single column layout
- **Navigation:** Hamburger menu
- **Search:** Full-width with expandable filters

#### Touch Targets
- Minimum touch target: 44x44px
- Spacing between touch targets: 8px minimum
- Swipe gestures for card actions on mobile

### 9.5 Loading & Empty States

#### Loading States
```tsx
// Skeleton Loader for List
<div className="animate-pulse space-y-4">
  {[1,2,3].map(i => (
    <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
  ))}
</div>

// Spinner for Actions
<div className="flex justify-center py-8">
  <svg className="animate-spin h-8 w-8 text-blue-600" 
       xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" 
            stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962..."></path>
  </svg>
</div>
```

#### Empty States
```tsx
// No Contacts
<div className="text-center py-12">
  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" 
       viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
  <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts</h3>
  <p className="mt-1 text-sm text-gray-500">
    Get started by creating a new contact or importing from a file.
  </p>
  <div className="mt-6">
    <button className="btn-primary">
      + New Contact
    </button>
  </div>
</div>

// No Search Results
<div className="text-center py-12">
  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" 
       viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
  <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
  <p className="mt-1 text-sm text-gray-500">
    Try adjusting your search or filter criteria.
  </p>
  <button className="mt-4 text-sm text-blue-600 hover:text-blue-700">
    Clear all filters
  </button>
</div>
```

---

## 10. Functional Requirements

### 10.1 Contacts Module Requirements

#### FR-C-001: View Contacts List
- **Priority:** P0 (Must Have)
- **Description:** Users can view a paginated list of all contacts
- **Acceptance Criteria:**
  - List displays contacts in table format
  - Shows key fields: name, email, phone, company, status
  - Supports pagination (20 items per page default)
  - Loads within 500ms for up to 10,000 records
  - Displays appropriate loading state during fetch

#### FR-C-002: Search Contacts
- **Priority:** P0 (Must Have)
- **Description:** Users can search contacts by text
- **Acceptance Criteria:**
  - Search bar at top of list
  - Searches across: first name, last name, email, phone, company name
  - Results update in real-time (debounced 300ms)
  - Shows "No results" message when no matches
  - Maintains search term in URL query parameter

#### FR-C-003: Filter Contacts
- **Priority:** P0 (Must Have)
- **Description:** Users can filter contacts by multiple criteria
- **Acceptance Criteria:**
  - Filter panel accessible via button
  - Filter by: status, company, tags, date range
  - Multiple filters can be applied simultaneously
  - Filter count badge shows active filters
  - "Clear filters" button available
  - Filters persist in URL parameters

#### FR-C-004: Sort Contacts
- **Priority:** P0 (Must Have)
- **Description:** Users can sort contacts by column
- **Acceptance Criteria:**
  - Click column header to toggle sort
  - Supports ascending/descending sort
  - Visual indicator shows sort column and direction
  - Sortable columns: name, email, company, created date
  - Sort state persists in URL parameters

#### FR-C-005: Create Contact
- **Priority:** P0 (Must Have)
- **Description:** Users can create a new contact
- **Acceptance Criteria:**
  - "New Contact" button prominent at top
  - Form includes all required fields
  - Real-time validation on form fields
  - Email uniqueness validation
  - Phone number formatting automatic
  - Success message shown on save
  - Redirects to contact detail view after creation

#### FR-C-006: Edit Contact
- **Priority:** P0 (Must Have)
- **Description:** Users can edit existing contact
- **Acceptance Criteria:**
  - Edit button on detail view and in list actions
  - Form pre-populated with existing data
  - Same validation as create
  - "Save" and "Cancel" buttons
  - Confirmation prompt if unsaved changes
  - Success message on save
  - Returns to detail view after save

#### FR-C-007: Delete Contact
- **Priority:** P0 (Must Have)
- **Description:** Users can delete contacts
- **Acceptance Criteria:**
  - Delete button on detail view and list actions
  - Confirmation modal before deletion
  - "Are you sure?" message with contact name
  - Soft delete (sets deleted_at timestamp)
  - Success message after deletion
  - Redirects to list view after deletion
  - Admin users can view/restore deleted contacts

#### FR-C-008: View Contact Details
- **Priority:** P0 (Must Have)
- **Description:** Users can view full contact information
- **Acceptance Criteria:**
  - All contact fields displayed
  - Company link clickable (if exists)
  - Activity timeline shows related records
  - Edit and Delete buttons accessible
  - Contact information formatted properly
  - Email and phone clickable (mailto/tel links)

#### FR-C-009: Bulk Actions
- **Priority:** P1 (Should Have)
- **Description:** Users can perform actions on multiple contacts
- **Acceptance Criteria:**
  - Checkboxes in list view
  - "Select all" checkbox in header
  - Bulk action menu appears when items selected
  - Supported actions: delete, export, update tags
  - Confirmation required for destructive actions
  - Progress indicator for bulk operations
  - Success message with count of affected records

#### FR-C-010: Export Contacts
- **Priority:** P1 (Should Have)
- **Description:** Users can export contact data
- **Acceptance Criteria:**
  - Export button in list view
  - Exports selected contacts or all filtered
  - Format: CSV with all fields
  - File name includes timestamp
  - Downloads immediately
  - Includes headers row

### 10.2 Companies Module Requirements

#### FR-CO-001: View Companies List
- **Priority:** P0 (Must Have)
- **Description:** Users can view list of companies
- **Acceptance Criteria:**
  - Default: grid view with cards
  - Toggle between grid and table view
  - Shows key info: name, industry, location, contact count
  - Supports pagination
  - Loads within 500ms

#### FR-CO-002: Search Companies
- **Priority:** P0 (Must Have)
- **Description:** Users can search companies
- **Acceptance Criteria:**
  - Search bar at top
  - Searches: company name, industry
  - Real-time results (debounced)
  - Search persists in URL

#### FR-CO-003: Filter Companies
- **Priority:** P0 (Must Have)
- **Description:** Users can filter companies
- **Acceptance Criteria:**
  - Filter by: industry, size, status, location
  - Multiple filters supported
  - Visual indicator for active filters
  - Filters persist in URL

#### FR-CO-004: Create Company
- **Priority:** P0 (Must Have)
- **Description:** Users can create companies
- **Acceptance Criteria:**
  - "New Company" button accessible
  - Required fields enforced
  - Company name uniqueness validation
  - Logo upload supported (optional)
  - Success message on creation
  - Redirects to company detail

#### FR-CO-005: Edit Company
- **Priority:** P0 (Must Have)
- **Description:** Users can edit companies
- **Acceptance Criteria:**
  - Edit button on detail/list
  - Form pre-populated
  - Same validation as create
  - Success message on save

#### FR-CO-006: Delete Company
- **Priority:** P0 (Must Have)
- **Description:** Users can delete companies
- **Acceptance Criteria:**
  - Delete button with confirmation
  - Warning if company has contacts
  - Option to reassign or remove contacts
  - Soft delete
  - Success message

#### FR-CO-007: View Company Details
- **Priority:** P0 (Must Have)
- **Description:** Users can view company information
- **Acceptance Criteria:**
  - All company fields displayed
  - Associated contacts shown
  - Website clickable
  - Phone clickable
  - Recent quotes/activity displayed

#### FR-CO-008: Manage Company Contacts
- **Priority:** P0 (Must Have)
- **Description:** Users can view/manage contacts at company
- **Acceptance Criteria:**
  - Contacts section on company detail
  - "Add Contact" button present
  - Contact cards show key info
  - Click contact to view details
  - Remove contact from company option

#### FR-CO-009: Export Companies
- **Priority:** P1 (Should Have)
- **Description:** Users can export company data
- **Acceptance Criteria:**
  - Export button in list view
  - CSV format with all fields
  - Includes contact count
  - Downloads immediately

---

## 11. Technical Architecture

### 11.1 Technology Stack

#### Frontend
- **Framework:** Next.js 15.5.4 (App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 4.x
- **State Management:** React Context + Hooks
- **Forms:** React Hook Form (to be added)
- **Validation:** Zod (to be added)
- **Data Fetching:** Native fetch with error handling
- **File Upload:** React Dropzone (to be added)
- **CSV Parsing:** PapaParse 5.5.3 (already installed)
- **Excel Parsing:** XLSX 0.18.5 (already installed)

#### Backend (Future - Currently Client-Side)
- **Runtime:** Node.js with Next.js API Routes
- **Database:** PostgreSQL (or MongoDB alternative)
- **ORM:** Prisma or Drizzle (TBD)
- **API:** RESTful endpoints
- **Authentication:** NextAuth.js (future)
- **File Storage:** Local/S3 for logos (future)

### 11.2 Project Structure

```
all-star-signs-demo/
├── app/
│   ├── contacts/
│   │   ├── page.tsx                    # Contacts list view
│   │   ├── new/
│   │   │   └── page.tsx                # New contact form
│   │   ├── [id]/
│   │   │   ├── page.tsx                # Contact detail view
│   │   │   └── edit/
│   │   │       └── page.tsx            # Edit contact form
│   │   └── import/
│   │       └── page.tsx                # Import wizard
│   ├── companies/
│   │   ├── page.tsx                    # Companies list view
│   │   ├── new/
│   │   │   └── page.tsx                # New company form
│   │   ├── [id]/
│   │   │   ├── page.tsx                # Company detail view
│   │   │   └── edit/
│   │   │       └── page.tsx            # Edit company form
│   │   └── import/
│   │       └── page.tsx                # Import wizard
│   └── api/
│       ├── contacts/
│       │   ├── route.ts                # GET, POST /api/contacts
│       │   ├── [id]/
│       │   │   └── route.ts            # GET, PUT, DELETE /api/contacts/[id]
│       │   └── import/
│       │       └── route.ts            # POST /api/contacts/import
│       └── companies/
│           ├── route.ts                # GET, POST /api/companies
│           ├── [id]/
│           │   └── route.ts            # GET, PUT, DELETE /api/companies/[id]
│           └── import/
│               └── route.ts            # POST /api/companies/import
├── components/
│   ├── contacts/
│   │   ├── ContactsList.tsx            # Contacts table component
│   │   ├── ContactCard.tsx             # Contact card for grid view
│   │   ├── ContactForm.tsx             # Shared contact form
│   │   ├── ContactDetail.tsx           # Contact detail layout
│   │   ├── ContactFilters.tsx          # Filter panel
│   │   └── ContactImportWizard.tsx     # Import flow
│   ├── companies/
│   │   ├── CompaniesList.tsx           # Companies grid/table
│   │   ├── CompanyCard.tsx             # Company card component
│   │   ├── CompanyForm.tsx             # Shared company form
│   │   ├── CompanyDetail.tsx           # Company detail layout
│   │   ├── CompanyFilters.tsx          # Filter panel
│   │   └── CompanyImportWizard.tsx     # Import flow
│   ├── shared/
│   │   ├── SearchBar.tsx               # Reusable search
│   │   ├── StatusBadge.tsx             # Status badges
│   │   ├── TagPills.tsx                # Tag display
│   │   ├── Pagination.tsx              # Pagination controls
│   │   ├── EmptyState.tsx              # Empty states
│   │   ├── LoadingSpinner.tsx          # Loading states
│   │   └── ConfirmDialog.tsx           # Confirmation modals
│   └── layout/
│       └── BaseLayout.tsx              # Main layout (update nav)
├── lib/
│   ├── types/
│   │   ├── contact.ts                  # Contact types
│   │   └── company.ts                  # Company types
│   ├── services/
│   │   ├── contactService.ts           # Contact API calls
│   │   ├── companyService.ts           # Company API calls
│   │   └── importService.ts            # Import logic
│   ├── utils/
│   │   ├── formatters.ts               # Phone, date formatting
│   │   ├── validators.ts               # Validation helpers
│   │   └── csvHelpers.ts               # CSV parsing utilities
│   └── hooks/
│       ├── useContacts.ts              # Contact data hook
│       ├── useCompanies.ts             # Company data hook
│       └── usePagination.ts            # Pagination hook
├── public/
│   └── templates/
│       ├── contacts-template.csv       # Import template
│       └── companies-template.csv      # Import template
└── prisma/ (future)
    └── schema.prisma                   # Database schema
```

### 11.3 Data Flow Architecture

```
┌─────────────┐
│   Browser   │
│  (React)    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│     Components Layer                │
│  - ContactsList                     │
│  - CompanyDetail                    │
│  - ContactForm                      │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│     Custom Hooks                    │
│  - useContacts()                    │
│  - useCompanies()                   │
│  - usePagination()                  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│     Service Layer                   │
│  - contactService.ts                │
│  - companyService.ts                │
│  - importService.ts                 │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│     API Routes (Next.js)            │
│  - GET /api/contacts                │
│  - POST /api/contacts               │
│  - PUT /api/contacts/[id]           │
│  - DELETE /api/contacts/[id]        │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│     Database (Future)               │
│  - PostgreSQL                       │
│  - Prisma ORM                       │
└─────────────────────────────────────┘
```

### 11.4 State Management Strategy

#### Phase 1: Local State (MVP)
```typescript
// Client-side only with React hooks
const [contacts, setContacts] = useState<Contact[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// Store in localStorage for persistence
useEffect(() => {
  localStorage.setItem('contacts', JSON.stringify(contacts));
}, [contacts]);
```

#### Phase 2: Server State (Future)
```typescript
// React Context for global state
export const ContactsContext = createContext<ContactsContextType>({});

export function ContactsProvider({ children }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filters, setFilters] = useState<ContactFilters>({});
  
  // API integration
  const fetchContacts = async () => {
    const response = await fetch('/api/contacts');
    const data = await response.json();
    setContacts(data);
  };
  
  return (
    <ContactsContext.Provider value={{ contacts, filters, fetchContacts }}>
      {children}
    </ContactsContext.Provider>
  );
}
```

### 11.5 API Endpoints Specification

#### Contacts Endpoints

```typescript
// GET /api/contacts
// Query parameters: page, limit, search, status, companyId, sortBy, sortOrder
Response: {
  data: Contact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// GET /api/contacts/[id]
Response: Contact

// POST /api/contacts
Body: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>
Response: Contact

// PUT /api/contacts/[id]
Body: Partial<Contact>
Response: Contact

// DELETE /api/contacts/[id]
Response: { success: boolean; message: string }

// POST /api/contacts/import
Body: FormData with CSV/Excel file
Response: {
  success: number;
  failed: number;
  errors: Array<{ row: number; error: string }>;
}
```

#### Companies Endpoints

```typescript
// GET /api/companies
// Query parameters: page, limit, search, industry, size, status, sortBy, sortOrder
Response: {
  data: Company[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// GET /api/companies/[id]
// Includes associated contacts
Response: Company & { contacts: Contact[] }

// POST /api/companies
Body: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>
Response: Company

// PUT /api/companies/[id]
Body: Partial<Company>
Response: Company

// DELETE /api/companies/[id]
Response: { success: boolean; message: string }

// POST /api/companies/import
Body: FormData with CSV/Excel file
Response: {
  success: number;
  failed: number;
  errors: Array<{ row: number; error: string }>;
}
```

### 11.6 Error Handling Strategy

```typescript
// Standard error response format
interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: any;
}

// HTTP Status Codes
// 200 - Success
// 201 - Created
// 400 - Bad Request (validation errors)
// 401 - Unauthorized
// 403 - Forbidden
// 404 - Not Found
// 409 - Conflict (duplicate email, etc.)
// 500 - Internal Server Error

// Client-side error handling
try {
  const response = await fetch('/api/contacts', {
    method: 'POST',
    body: JSON.stringify(contact),
  });
  
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message);
  }
  
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Failed to create contact:', error);
  // Show user-friendly error message
  toast.error(error.message || 'Failed to create contact');
}
```

---

## 12. User Permissions & Access Control

### 12.1 User Roles

#### Administrator
- **Full Access** to all features
- Can manage all contacts and companies
- Can import/export data
- Can delete records
- Can manage user permissions
- Can access deleted records

#### Manager
- Can view all contacts and companies
- Can create, edit contacts and companies
- Can import/export data
- Cannot delete records (soft delete only)
- Can manage own team's data

#### User (Standard)
- Can view all contacts and companies
- Can create new contacts and companies
- Can edit own created records
- Cannot delete records
- Cannot import data
- Can export filtered views only

#### Read-Only (Viewer)
- Can view contacts and companies
- Cannot create, edit, or delete
- Cannot import/export
- Can search and filter

### 12.2 Permission Matrix

| Feature | Admin | Manager | User | Viewer |
|---------|-------|---------|------|--------|
| View Contacts | ✅ | ✅ | ✅ | ✅ |
| View Companies | ✅ | ✅ | ✅ | ✅ |
| Create Contact | ✅ | ✅ | ✅ | ❌ |
| Create Company | ✅ | ✅ | ✅ | ❌ |
| Edit Any Record | ✅ | ✅ | ⚠️ Own Only | ❌ |
| Delete Record | ✅ | ⚠️ Soft Only | ❌ | ❌ |
| Import Data | ✅ | ✅ | ❌ | ❌ |
| Export All Data | ✅ | ✅ | ⚠️ Filtered | ⚠️ Filtered |
| Bulk Actions | ✅ | ✅ | ⚠️ Limited | ❌ |
| View Deleted | ✅ | ❌ | ❌ | ❌ |
| Restore Deleted | ✅ | ❌ | ❌ | ❌ |

### 12.3 Implementation

```typescript
// User type definition
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  VIEWER = 'viewer'
}

// Permission check utilities
function canEditRecord(user: User, record: Contact | Company): boolean {
  if (user.role === UserRole.ADMIN || user.role === UserRole.MANAGER) {
    return true;
  }
  if (user.role === UserRole.USER) {
    return record.createdBy === user.id;
  }
  return false;
}

function canDeleteRecord(user: User): boolean {
  return user.role === UserRole.ADMIN;
}

function canImportData(user: User): boolean {
  return [UserRole.ADMIN, UserRole.MANAGER].includes(user.role);
}

// UI permission checks
<button
  disabled={!canEditRecord(currentUser, contact)}
  onClick={handleEdit}
>
  Edit Contact
</button>

{canDeleteRecord(currentUser) && (
  <button onClick={handleDelete}>
    Delete
  </button>
)}
```

### 12.4 Row-Level Security (Future)

```sql
-- PostgreSQL RLS policies (when backend implemented)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY contacts_view_policy ON contacts
  FOR SELECT
  USING (
    auth.role() IN ('admin', 'manager', 'user', 'viewer')
  );

CREATE POLICY contacts_create_policy ON contacts
  FOR INSERT
  WITH CHECK (
    auth.role() IN ('admin', 'manager', 'user')
  );

CREATE POLICY contacts_update_policy ON contacts
  FOR UPDATE
  USING (
    auth.role() = 'admin' OR
    auth.role() = 'manager' OR
    (auth.role() = 'user' AND created_by = auth.uid())
  );

CREATE POLICY contacts_delete_policy ON contacts
  FOR DELETE
  USING (
    auth.role() = 'admin'
  );
```

---

## 13. Import/Export Functionality

### 13.1 Import Wizard Flow

#### Step 1: File Upload
- Drag-and-drop or click to browse
- Supported formats: CSV, Excel (.xlsx, .xls)
- Maximum file size: 5MB
- File validation before proceeding
- Preview of first 5 rows

#### Step 2: Field Mapping
- Auto-detect common field names
- Manual mapping for unmatched fields
- Preview mapped data
- Required fields must be mapped
- Warning for unmapped fields

#### Step 3: Validation & Import
- Validate all rows
- Show validation errors by row
- Option to skip invalid rows
- Progress bar during import
- Summary report after completion

### 13.2 Import Templates

#### Contacts Template (CSV)
```csv
First Name,Last Name,Email,Phone,Mobile,Company Name,Job Title,Department,Address Line 1,Address Line 2,City,State,Postal Code,Country,Status,Tags,Notes
John,Doe,john@example.com,(555) 123-4567,(555) 987-6543,Acme Corp,Senior Manager,Sales,123 Main St,Suite 100,New York,NY,10001,USA,Active,"VIP,Wholesale",Prefers email contact
Jane,Smith,jane@test.com,(555) 234-5678,,,Sales Manager,Operations,456 Oak Ave,,Los Angeles,CA,90001,USA,Active,Referral,Key decision maker
```

#### Companies Template (CSV)
```csv
Company Name,Industry,Company Size,Website,Primary Phone,Address Line 1,Address Line 2,City,State,Postal Code,Country,Relationship Status,Annual Revenue,Tags,Description
Acme Corporation,Manufacturing,201-500,https://acme.com,(555) 100-2000,789 Industrial Blvd,,Detroit,MI,48201,USA,Active,5000000,"Enterprise,Manufacturing",Leading manufacturer of widgets
Tech Innovations Inc,Technology,51-200,https://techinnovations.com,(555) 300-4000,321 Tech Park,,San Francisco,CA,94102,USA,Prospect,2000000,"SaaS,Startup",Promising tech startup
```

### 13.3 Import Validation Rules

#### Contacts
- **Email:** Required, valid format, unique
- **First Name:** Required, max 50 chars
- **Last Name:** Required, max 50 chars
- **Phone/Mobile:** Optional, auto-format to (XXX) XXX-XXXX
- **Company Name:** Optional, match to existing or create new
- **Status:** Must be one of: Active, Inactive, Lead
- **Tags:** Comma-separated, create if not exists

#### Companies
- **Company Name:** Required, unique, max 100 chars
- **Website:** Optional, valid URL format
- **Company Size:** Must be one of: 1-10, 11-50, 51-200, 201-500, 501+
- **Industry:** Optional, suggest from predefined list
- **Relationship Status:** Must be one of: Prospect, Active, Inactive, Lost
- **Annual Revenue:** Optional, numeric only

### 13.4 Import Error Handling

```typescript
interface ImportError {
  row: number;
  field: string;
  value: any;
  error: string;
}

interface ImportResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  skippedCount: number;
  errors: ImportError[];
  createdRecords: string[]; // IDs of created records
}

// Example error messages
const errors = [
  { row: 5, field: 'email', value: 'invalid', error: 'Invalid email format' },
  { row: 12, field: 'email', value: 'john@example.com', error: 'Email already exists' },
  { row: 18, field: 'firstName', value: '', error: 'First name is required' },
];

// UI display
<div className="mt-4">
  <h3 className="text-lg font-semibold text-red-600">
    Import Errors ({errors.length})
  </h3>
  <div className="mt-2 space-y-2">
    {errors.map((error, idx) => (
      <div key={idx} className="flex items-start space-x-2 text-sm">
        <span className="text-red-600">Row {error.row}:</span>
        <span className="text-gray-700">
          {error.field} - {error.error}
        </span>
      </div>
    ))}
  </div>
  <button className="mt-4 btn-secondary">
    Download Error Report
  </button>
</div>
```

### 13.5 Duplicate Detection

```typescript
interface DuplicateCheck {
  field: 'email' | 'companyName';
  existingRecord: Contact | Company;
  importedValue: string;
  action: 'skip' | 'update' | 'create_new';
}

// Duplicate handling options
const duplicateOptions = [
  {
    label: 'Skip duplicates',
    value: 'skip',
    description: 'Keep existing records, ignore imports'
  },
  {
    label: 'Update existing',
    value: 'update',
    description: 'Update existing records with imported data'
  },
  {
    label: 'Create new',
    value: 'create_new',
    description: 'Create new records even if duplicates exist'
  }
];

// UI for duplicate handling
<div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
  <div className="flex">
    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
    <div className="ml-3">
      <h3 className="text-sm font-medium text-yellow-800">
        {duplicateCount} potential duplicates found
      </h3>
      <p className="mt-2 text-sm text-yellow-700">
        How would you like to handle duplicate records?
      </p>
      <div className="mt-4 space-y-2">
        {duplicateOptions.map((option) => (
          <label key={option.value} className="flex items-center">
            <input
              type="radio"
              name="duplicate-action"
              value={option.value}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-700">
              <strong>{option.label}</strong> - {option.description}
            </span>
          </label>
        ))}
      </div>
    </div>
  </div>
</div>
```

### 13.6 Export Functionality

```typescript
interface ExportOptions {
  format: 'csv' | 'excel';
  fields: string[]; // Selected fields to export
  filters: ContactFilters | CompanyFilters; // Current filters
  includeNotes: boolean;
  includeDeleted: boolean;
}

async function exportContacts(options: ExportOptions) {
  // Fetch filtered data
  const contacts = await fetchContacts({
    filters: options.filters,
    limit: 10000 // Export all matching
  });
  
  // Format data based on selected fields
  const data = contacts.map(contact => {
    const row: any = {};
    options.fields.forEach(field => {
      row[field] = contact[field];
    });
    return row;
  });
  
  // Generate file
  if (options.format === 'csv') {
    const csv = Papa.unparse(data);
    downloadFile(csv, `contacts_export_${Date.now()}.csv`, 'text/csv');
  } else {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
    XLSX.writeFile(workbook, `contacts_export_${Date.now()}.xlsx`);
  }
}

// Export button UI
<button onClick={handleExport} className="btn-secondary">
  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
  Export Contacts
</button>
```

---

## 14. Error Handling & User States

### 14.1 Loading States

#### List View Loading
```tsx
<div className="space-y-4">
  {[...Array(5)].map((_, i) => (
    <div key={i} className="animate-pulse">
      <div className="h-16 bg-gray-200 rounded-lg"></div>
    </div>
  ))}
</div>
```

#### Detail View Loading
```tsx
<div className="animate-pulse">
  <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
  <div className="space-y-3">
    <div className="h-4 bg-gray-200 rounded"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
  </div>
</div>
```

#### Button Loading
```tsx
<button disabled className="btn-primary">
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" 
       xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" 
            stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
  Processing...
</button>
```

### 14.2 Empty States

Already covered in section 9.5

### 14.3 Error States

#### Form Validation Errors
```tsx
<div>
  <label className="block text-sm font-medium text-gray-700">
    Email Address *
  </label>
  <input
    type="email"
    className={`mt-1 w-full px-3 py-2 border rounded-lg ${
      error ? 'border-red-500' : 'border-gray-300'
    }`}
  />
  {error && (
    <p className="mt-1 text-sm text-red-600">{error}</p>
  )}
</div>
```

#### API Error Messages
```tsx
{apiError && (
  <div className="rounded-md bg-red-50 p-4">
    <div className="flex">
      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">
          Error Loading Data
        </h3>
        <p className="mt-2 text-sm text-red-700">
          {apiError.message}
        </p>
        <button onClick={retry} className="mt-3 text-sm font-medium text-red-600 hover:text-red-500">
          Try Again →
        </button>
      </div>
    </div>
  </div>
)}
```

#### Network Error (Offline)
```tsx
{isOffline && (
  <div className="rounded-md bg-yellow-50 p-4">
    <div className="flex">
      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-yellow-800">
          No Internet Connection
        </h3>
        <p className="mt-2 text-sm text-yellow-700">
          You're currently offline. Some features may not be available.
        </p>
      </div>
    </div>
  </div>
)}
```

### 14.4 Success States

#### Toast Notifications
```tsx
import { toast } from 'react-hot-toast';

// Success
toast.success('Contact created successfully');

// Error
toast.error('Failed to save contact');

// Loading
const toastId = toast.loading('Saving contact...');
// Later...
toast.success('Contact saved!', { id: toastId });

// Custom
toast.custom((t) => (
  <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
                   bg-white shadow-lg rounded-lg p-4`}>
    <div className="flex items-center">
      <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <p className="ml-3 text-sm font-medium text-gray-900">
        Contact created successfully!
      </p>
    </div>
  </div>
));
```

#### Inline Success Messages
```tsx
{showSuccess && (
  <div className="rounded-md bg-green-50 p-4">
    <div className="flex">
      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <p className="ml-3 text-sm font-medium text-green-800">
        Successfully uploaded 156 contacts
      </p>
    </div>
  </div>
)}
```

### 14.5 Confirmation Dialogs

```tsx
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger'
}: ConfirmDialogProps) {
  if (!isOpen) return null;
  
  const colors = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
             onClick={onCancel}></div>
        
        {/* Dialog */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
                variant === 'danger' ? 'bg-red-100' : 
                variant === 'warning' ? 'bg-yellow-100' : 
                'bg-blue-100'
              } sm:mx-0 sm:h-10 sm:w-10`}>
                <svg className={`h-6 w-6 ${
                  variant === 'danger' ? 'text-red-600' : 
                  variant === 'warning' ? 'text-yellow-600' : 
                  'text-blue-600'
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${colors[variant]} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Usage
<ConfirmDialog
  isOpen={showDeleteConfirm}
  title="Delete Contact"
  message={`Are you sure you want to delete ${contact.firstName} ${contact.lastName}? This action cannot be undone.`}
  confirmLabel="Delete"
  cancelLabel="Cancel"
  variant="danger"
  onConfirm={handleDelete}
  onCancel={() => setShowDeleteConfirm(false)}
/>
```

---

## 15. Performance Requirements

### 15.1 Load Time Targets

| Metric | Target | Acceptable | Poor |
|--------|--------|------------|------|
| Initial Page Load | < 1s | < 2s | > 2s |
| List View Render | < 500ms | < 1s | > 1s |
| Detail View Load | < 300ms | < 500ms | > 500ms |
| Search Results | < 200ms | < 500ms | > 500ms |
| Form Submission | < 1s | < 2s | > 2s |
| Import (100 rows) | < 3s | < 5s | > 5s |
| Import (1000 rows) | < 15s | < 30s | > 30s |

### 15.2 Optimization Strategies

#### Code Splitting
```typescript
// Lazy load import wizard
const ImportWizard = dynamic(() => import('@/components/contacts/ContactImportWizard'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

// Lazy load heavy components
const CompanyDetail = dynamic(() => import('@/components/companies/CompanyDetail'), {
  loading: () => <DetailSkeleton />
});
```

#### Pagination
- Limit list views to 20 items per page
- Implement cursor-based pagination for large datasets
- Virtualize long lists (react-window) if > 100 items

#### Search Debouncing
```typescript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);

useEffect(() => {
  if (debouncedSearch) {
    performSearch(debouncedSearch);
  }
}, [debouncedSearch]);
```

#### Data Caching
```typescript
// Cache contact list
const { data, isLoading } = useSWR(
  `/api/contacts?${queryParams}`,
  fetcher,
  {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // 1 minute
  }
);
```

#### Image Optimization
- Logos compressed to < 100KB
- Use Next.js Image component for optimization
- Lazy load images below fold

### 15.3 Database Performance

#### Indexing Strategy (Future)
```sql
-- Essential indexes
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_company_id ON contacts(company_id);
CREATE INDEX idx_companies_name ON companies(company_name);

-- Composite indexes for common queries
CREATE INDEX idx_contacts_status_created ON contacts(status, created_at DESC);
CREATE INDEX idx_companies_industry_status ON companies(industry, relationship_status);

-- Full-text search indexes
CREATE INDEX idx_contacts_search ON contacts 
  USING GIN(to_tsvector('english', first_name || ' ' || last_name || ' ' || email));
```

#### Query Optimization
- Use SELECT only required fields
- Implement pagination at database level
- Use connection pooling
- Cache frequent queries

### 15.4 Monitoring

```typescript
// Performance monitoring
if (typeof window !== 'undefined' && window.performance) {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    // Send to analytics
    trackMetric('page_load_time', pageLoadTime);
  });
}

// Component render tracking
function ContactsList() {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const renderTime = performance.now() - startTime;
      if (renderTime > 1000) {
        console.warn('ContactsList slow render:', renderTime);
      }
    };
  }, []);
  
  // ... component code
}
```

---

## 16. Accessibility Requirements

### 16.1 WCAG 2.1 Level AA Compliance

#### Keyboard Navigation
- All interactive elements accessible via keyboard
- Tab order follows logical flow
- Focus visible on all interactive elements
- Escape key closes modals/dialogs
- Enter key activates primary actions
- Arrow keys navigate lists

#### Screen Reader Support
```tsx
// Semantic HTML
<nav aria-label="Primary navigation">
  {/* navigation items */}
</nav>

<main>
  <h1>Contacts</h1>
  {/* content */}
</main>

// ARIA labels
<button aria-label="Delete contact John Doe">
  <TrashIcon />
</button>

<input
  type="search"
  aria-label="Search contacts"
  aria-describedby="search-help"
/>
<span id="search-help" className="sr-only">
  Search by name, email, or company
</span>

// Live regions for dynamic updates
<div aria-live="polite" aria-atomic="true">
  {successMessage}
</div>

// Skip links
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

#### Color Contrast
- Text: minimum 4.5:1 ratio for normal text
- Large text (18pt+): minimum 3:1 ratio
- Interactive elements: minimum 3:1 ratio
- Never rely on color alone for information

```tsx
// Good: Icon + Text + Color
<span className="inline-flex items-center text-green-700">
  <CheckIcon className="h-4 w-4 mr-1" />
  Active
</span>

// Bad: Color only
<span className="text-green-700">Active</span>
```

#### Forms
```tsx
<label htmlFor="email" className="block text-sm font-medium">
  Email Address *
</label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? 'email-error' : undefined}
  className="..."
/>
{hasError && (
  <p id="email-error" className="text-sm text-red-600" role="alert">
    Please enter a valid email address
  </p>
)}
```

### 16.2 Testing Checklist

- [ ] All functionality accessible via keyboard
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader announces page title and headings
- [ ] Form labels properly associated with inputs
- [ ] Error messages announced to screen readers
- [ ] Color contrast meets WCAG AA standards
- [ ] Images have alt text (or empty alt if decorative)
- [ ] Tables have proper headers
- [ ] Modals trap focus and return focus on close
- [ ] Loading states announced to screen readers

### 16.3 Accessibility Tools

- **axe DevTools** - Browser extension for automated testing
- **WAVE** - Web accessibility evaluation tool
- **Lighthouse** - Chrome DevTools audit
- **NVDA/JAWS** - Screen reader testing
- **Keyboard Only** - Navigate site without mouse

---

## 17. Success Criteria & KPIs

### 17.1 Launch Criteria

Before launching to production, the following must be met:

#### Functional Requirements
- [ ] All P0 features implemented and tested
- [ ] Import functionality working for CSV and Excel
- [ ] Search and filter performing < 500ms
- [ ] Forms validating correctly
- [ ] Navigation integrated in main menu
- [ ] Mobile responsive on iOS and Android

#### Quality Requirements
- [ ] 0 critical bugs
- [ ] < 5 high-priority bugs
- [ ] Unit test coverage > 70%
- [ ] E2E tests passing for critical paths
- [ ] Accessibility audit score > 85%
- [ ] Performance metrics meeting targets

#### Documentation
- [ ] User guide completed
- [ ] API documentation published
- [ ] Admin documentation for imports
- [ ] Release notes prepared

### 17.2 Success Metrics (30 Days Post-Launch)

#### Usage Metrics
- **User Adoption:** > 80% of users have accessed Contacts or Companies
- **Daily Active Users:** > 50% of total users
- **Feature Usage:** Import feature used by > 30% of users
- **Session Duration:** Average time in sections > 5 minutes

#### Performance Metrics
- **Page Load Time:** < 1s for 95th percentile
- **Search Response:** < 300ms for 95th percentile
- **Error Rate:** < 1% of requests
- **Uptime:** > 99.5%

#### Data Quality
- **Data Completeness:** > 80% of contacts have phone and company
- **Duplicate Rate:** < 2% of total records
- **Import Success Rate:** > 95% of imported records successful

#### User Satisfaction
- **User Satisfaction Score:** > 4.0/5.0
- **Support Tickets:** < 10 per week
- **Feature Requests:** Documented and prioritized
- **Bug Reports:** < 5 per week

### 17.3 KPI Dashboard

```typescript
interface KPIs {
  // Usage
  totalContacts: number;
  totalCompanies: number;
  activeUsers: number;
  dailyActiveUsers: number;
  
  // Performance
  avgLoadTime: number;
  avgSearchTime: number;
  errorRate: number;
  
  // Data Quality
  contactsWithCompany: number;
  contactsWithPhone: number;
  duplicateContacts: number;
  
  // Features
  importsLastWeek: number;
  exportsLastWeek: number;
  bulkActionsLastWeek: number;
}

// KPI tracking
function trackKPI(metric: string, value: number) {
  // Send to analytics service
  analytics.track(metric, { value, timestamp: new Date() });
}
```

---

## 18. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

#### Week 1: Core Setup
- [ ] Set up project structure
- [ ] Create database schema (if backend)
- [ ] Implement data models and types
- [ ] Create base components (buttons, inputs, etc.)
- [ ] Update BaseLayout navigation

#### Week 2: Basic Contacts
- [ ] Contacts list view (table only)
- [ ] Basic search functionality
- [ ] Contact detail view (read-only)
- [ ] Create contact form
- [ ] Local storage persistence

**Deliverable:** MVP with basic contact viewing and creation

### Phase 2: Companies Module (Weeks 3-4)

#### Week 3: Companies Foundation
- [ ] Companies list view (grid and table)
- [ ] Company detail view
- [ ] Create company form
- [ ] Company-Contact relationships

#### Week 4: Enhanced Features
- [ ] Advanced filtering for both modules
- [ ] Sorting functionality
- [ ] Edit forms for contacts and companies
- [ ] Delete functionality with confirmations

**Deliverable:** Full CRUD for both Contacts and Companies

### Phase 3: Import/Export (Weeks 5-6)

#### Week 5: Import Wizard
- [ ] File upload component
- [ ] CSV parsing with PapaParse
- [ ] Excel parsing with XLSX
- [ ] Field mapping interface
- [ ] Data validation logic

#### Week 6: Advanced Import & Export
- [ ] Duplicate detection
- [ ] Error handling and reporting
- [ ] Progress indicators
- [ ] Export functionality
- [ ] Import templates

**Deliverable:** Complete import/export functionality

### Phase 4: Polish & Optimization (Week 7-8)

#### Week 7: UX Enhancement
- [ ] Loading states for all actions
- [ ] Empty states with helpful CTAs
- [ ] Success/error messaging
- [ ] Mobile responsive refinements
- [ ] Accessibility improvements

#### Week 8: Performance & Testing
- [ ] Code splitting and lazy loading
- [ ] Performance optimization
- [ ] Unit tests for critical functions
- [ ] E2E tests for user flows
- [ ] Cross-browser testing

**Deliverable:** Production-ready, polished application

### Phase 5: Backend Integration (Future)

#### Week 9-10: API Development
- [ ] Set up backend (Prisma + PostgreSQL)
- [ ] Implement REST API endpoints
- [ ] Authentication and authorization
- [ ] Database migrations

#### Week 11-12: Integration
- [ ] Connect frontend to API
- [ ] Implement server-side pagination
- [ ] Real-time updates
- [ ] User role management

**Deliverable:** Full-stack application with persistent database

---

## 19. Dependencies & Risks

### 19.1 Technical Dependencies

#### External Libraries
- **papaparse** (5.5.3) - CSV parsing ✅ Already installed
- **xlsx** (0.18.5) - Excel file handling ✅ Already installed
- **react-hook-form** - Form management (to be added)
- **zod** - Schema validation (to be added)
- **react-hot-toast** - Toast notifications (to be added)
- **react-dropzone** - File uploads (to be added)

#### Infrastructure
- **Database** - PostgreSQL or MongoDB (future phase)
- **Storage** - S3 or local for file uploads (future)
- **CDN** - For serving static assets (future)

### 19.2 Technical Risks

#### High Risk
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Large CSV imports cause browser freeze | High | Medium | Implement Web Workers for parsing, chunk processing |
| localStorage size limits exceeded | Medium | High | Implement pagination, add "Archive old records" feature |
| Poor mobile performance on old devices | Medium | Medium | Implement virtual scrolling, reduce bundle size |

#### Medium Risk
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Duplicate detection performance issues | Low | Medium | Index on email field, batch checking |
| Excel file compatibility issues | Medium | Low | Support only modern Excel formats (.xlsx), not .xls |
| Form validation edge cases | Low | Medium | Comprehensive test coverage |

#### Low Risk
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Browser compatibility issues | Low | Low | Test on major browsers, polyfills as needed |
| Accessibility issues | Low | Medium | Regular audits, automated testing |

### 19.3 Business Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Low user adoption | High | User training, intuitive design, gradual rollout |
| Data migration errors | High | Thorough testing, backup procedures, rollback plan |
| Feature scope creep | Medium | Strict phase gates, MVP-first approach |
| Timeline delays | Medium | Buffer time in schedule, prioritize P0 features |

### 19.4 Mitigation Strategies

#### Large File Imports
```typescript
// Use Web Workers for CSV parsing
const worker = new Worker('/workers/csv-parser.worker.js');
worker.postMessage({ file, chunkSize: 100 });

worker.onmessage = (e) => {
  const { chunk, progress } = e.data;
  processChunk(chunk);
  updateProgress(progress);
};
```

#### Storage Limits
```typescript
// Check storage before saving
function checkStorageSpace() {
  const estimate = await navigator.storage.estimate();
  const percentUsed = (estimate.usage / estimate.quota) * 100;
  
  if (percentUsed > 80) {
    showWarning('Storage almost full. Consider archiving old records.');
  }
}

// Implement pagination
const ITEMS_PER_PAGE = 20;
const paginatedContacts = contacts.slice(
  (page - 1) * ITEMS_PER_PAGE,
  page * ITEMS_PER_PAGE
);
```

---

## 20. Appendices

### Appendix A: Glossary

- **CRM:** Customer Relationship Management
- **UUID:** Universally Unique Identifier
- **CSV:** Comma-Separated Values
- **CRUD:** Create, Read, Update, Delete
- **API:** Application Programming Interface
- **UI/UX:** User Interface / User Experience
- **WCAG:** Web Content Accessibility Guidelines
- **KPI:** Key Performance Indicator
- **MVP:** Minimum Viable Product
- **P0/P1:** Priority 0 (Must Have) / Priority 1 (Should Have)

### Appendix B: References

- Next.js Documentation: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React Hook Form: https://react-hook-form.com
- PapaParse: https://www.papaparse.com
- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- React Best Practices: https://react.dev/learn

### Appendix C: Related Documents

- Technical Specification (to be created)
- Database Schema Design (to be created)
- API Documentation (to be created)
- User Guide (to be created)
- Test Plan (to be created)

### Appendix D: Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-01 | Product Team | Initial draft |

### Appendix E: Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Technical Lead | | | |
| UX Lead | | | |
| Stakeholder | | | |

---

**End of Product Requirements Document**

---

## Next Steps

1. **Review & Approval:** Circulate this PRD to stakeholders for feedback
2. **Technical Specification:** Create detailed technical spec based on this PRD
3. **Design Mockups:** Create high-fidelity designs for key screens
4. **Task Breakdown:** Create detailed Taskmaster task list for implementation
5. **Sprint Planning:** Allocate resources and set sprint goals
6. **Development Kickoff:** Begin Phase 1 implementation

For questions or clarifications, please contact the Product Team.