'use client';

import { useMemo, useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@/components/icons/Icons';
import { formatCurrency, formatPercentage } from '@/lib/mock-data';
import type { Job, Quote, RevenueData, DailyRevenue, Bottleneck } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import CompanyForm from '@/components/forms/CompanyForm';
import ContactForm from '@/components/forms/ContactForm';
import { trackEvent } from '@/lib/utils/analytics';
import ImportWizard from '@/components/import/ImportWizard';

interface DashboardProps {
  data: {
    activeJobs: Job[];
    pendingQuotes: Quote[];
    revenue: RevenueData;
    bottlenecks: Bottleneck[];
    revenueHistory: DailyRevenue[];
    allJobs: Job[];
    allQuotes: Quote[];
  };
  searchQuery?: string;
}

// Mini Sparkline Component
function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 24;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Stat Card with Sparkline
function StatCard({ 
  title, 
  value, 
  change, 
  changeLabel, 
  variant = 'default',
  sparklineData 
}: { 
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  variant?: 'default' | 'success' | 'danger';
  sparklineData?: number[];
}) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  const variantColors = {
    default: 'text-gray-900',
    success: 'text-success',
    danger: 'text-danger'
  };

  return (
    <div className="bg-neutral-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <p className={`text-3xl font-bold ${variantColors[variant]}`}>
          {value}
        </p>
        {sparklineData && sparklineData.length > 0 && (
          <div className="text-primary opacity-60">
            <Sparkline data={sparklineData} />
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className="flex items-center mt-2 text-sm">
          {isPositive && (
            <>
              <ArrowUpIcon className="w-4 h-4 text-success mr-1" />
              <span className="text-success font-medium">{formatPercentage(change)}</span>
            </>
          )}
          {isNegative && (
            <>
              <ArrowDownIcon className="w-4 h-4 text-danger mr-1" />
              <span className="text-danger font-medium">{formatPercentage(change)}</span>
            </>
          )}
          {changeLabel && <span className="text-gray-500 ml-1">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}

// Job/Quote List Item
function ListItem({ 
  id, 
  customer, 
  type, 
  status,
  dueDate,
  value 
}: { 
  id: string;
  customer: string;
  type: string;
  status: 'active' | 'pending' | 'alert' | 'approved' | 'rejected';
  dueDate?: Date;
  value?: number;
}) {
  const statusColors = {
    active: 'bg-primary/10 text-primary',
    pending: 'bg-gray-100 text-gray-700',
    alert: 'bg-danger/10 text-danger',
    approved: 'bg-success/10 text-success',
    rejected: 'bg-danger/10 text-danger',
  };

  const getDaysUntilDue = () => {
    if (!dueDate) return null;
    const days = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return <span className="text-danger text-xs">Overdue</span>;
    if (days === 0) return <span className="text-danger text-xs">Due today</span>;
    if (days <= 3) return <span className="text-orange-600 text-xs">Due in {days}d</span>;
    return <span className="text-gray-500 text-xs">Due in {days}d</span>;
  };

  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors px-2 -mx-2 rounded">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900 truncate">{customer}</p>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {id}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-0.5">{type}</p>
        <div className="flex items-center gap-3 mt-1">
          {getDaysUntilDue()}
          {value && (
            <span className="text-xs text-gray-500">{formatCurrency(value)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ data, searchQuery = '' }: DashboardProps) {
  const router = useRouter();
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const handleNewQuote = () => {
    trackEvent('quote_new_click', { source: 'dashboard_quick_actions' });
    router.push('/quote-builder');
  };
  const openCompany = () => {
    trackEvent('quick_action_click', { action: 'new_company', source: 'dashboard_quick_actions' });
    setIsCompanyOpen(true);
  };
  const openContact = () => {
    trackEvent('quick_action_click', { action: 'new_contact', source: 'dashboard_quick_actions' });
    setIsContactOpen(true);
  };
  const openImport = () => {
    trackEvent('import_click', { source: 'dashboard_quick_actions' });
    setIsImportOpen(true);
  };

  // Filter data based on search
  const filteredJobs = useMemo(() => {
    if (!searchQuery) return data.activeJobs;
    const query = searchQuery.toLowerCase();
    return data.activeJobs.filter(job =>
      job.id.toLowerCase().includes(query) ||
      job.customer.toLowerCase().includes(query) ||
      job.type.toLowerCase().includes(query)
    );
  }, [data.activeJobs, searchQuery]);

  const filteredQuotes = useMemo(() => {
    if (!searchQuery) return data.pendingQuotes;
    const query = searchQuery.toLowerCase();
    return data.pendingQuotes.filter(quote =>
      quote.id.toLowerCase().includes(query) ||
      quote.customer.toLowerCase().includes(query) ||
      quote.type.toLowerCase().includes(query)
    );
  }, [data.pendingQuotes, searchQuery]);

  // Calculate quote aging buckets
  const quoteAgingBuckets = useMemo(() => {
    const buckets = { '0-3': 0, '4-7': 0, '8-14': 0, '15+': 0 };
    data.pendingQuotes.forEach(quote => {
      if (!quote.createdDate) return;
      const daysOld = Math.floor((Date.now() - quote.createdDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysOld <= 3) buckets['0-3']++;
      else if (daysOld <= 7) buckets['4-7']++;
      else if (daysOld <= 14) buckets['8-14']++;
      else buckets['15+']++;
    });
    return buckets;
  }, [data.pendingQuotes]);

  // Prepare sparkline data for revenue
  const revenueSparkline = useMemo(() => {
    return data.revenueHistory.slice(-7).map(d => d.amount);
  }, [data.revenueHistory]);

  return (
    <div className="space-y-6">
      {/* Stats Grid with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Jobs" 
          value={data.activeJobs.length} 
          change={8} 
          changeLabel="from last week" 
          variant="success" 
        />
        <StatCard 
          title="Pending Quotes" 
          value={data.pendingQuotes.length}
          change={-5}
          changeLabel="from last week"
        />
        <StatCard 
          title="Daily Revenue" 
          value={formatCurrency(data.revenue.daily)} 
          change={data.revenue.dailyChange} 
          changeLabel="from yesterday" 
          variant={data.revenue.dailyChange > 0 ? 'success' : 'danger'}
          sparklineData={revenueSparkline}
        />
        <StatCard 
          title="Bottlenecks" 
          value={data.bottlenecks.length} 
          variant={data.bottlenecks.length > 0 ? 'danger' : 'success'} 
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-neutral-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            className="bg-primary text-neutral-white px-4 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Create new quote"
            type="button"
            onClick={handleNewQuote}
          >
            + New Quote
          </button>
          <button
            className="bg-neutral-light text-gray-900 px-4 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            aria-label="Add new company"
            type="button"
            onClick={openCompany}
          >
            + New Company
          </button>
          <button
            className="bg-neutral-light text-gray-900 px-4 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            aria-label="Add new contact"
            type="button"
            onClick={openContact}
          >
            + New Contact
          </button>
          <button
            className="bg-neutral-light text-gray-900 px-4 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            aria-label="Import data"
            type="button"
            onClick={openImport}
          >
            📥 Import
          </button>
        </div>
      </div>

      {/* Quick Action Modals */}
      <Modal
        isOpen={isCompanyOpen}
        onClose={() => setIsCompanyOpen(false)}
        title="Add Company"
        subtitle="Create a new company record"
        size="lg"
      >
        <CompanyForm
          onSuccess={() => {
            setIsCompanyOpen(false);
          }}
          onCancel={() => {
            trackEvent('flow_cancel', { flow: 'company_new' });
            setIsCompanyOpen(false);
          }}
        />
      </Modal>

      <Modal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        title="Add Contact"
        subtitle="Create a new contact and optionally associate a company"
        size="lg"
      >
        <ContactForm
          onSuccess={() => {
            setIsContactOpen(false);
          }}
          onCancel={() => {
            trackEvent('flow_cancel', { flow: 'contact_new' });
            setIsContactOpen(false);
          }}
        />
      </Modal>

      <Modal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Import Data"
        subtitle="Upload a CSV or XLSX and map fields to the data model"
        size="xl"
      >
        <ImportWizard onClose={() => setIsImportOpen(false)} />
      </Modal>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Jobs Widget */}
        <div className="bg-neutral-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Active Jobs</h2>
              <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {filteredJobs.length}
              </span>
            </div>
          </div>
          <div className="p-6 max-h-96 overflow-y-auto">
            {filteredJobs.length > 0 ? (
              <>
                <div className="space-y-0">
                  {filteredJobs.slice(0, 5).map((job) => (
                    <ListItem 
                      key={job.id} 
                      id={job.id}
                      customer={job.customer}
                      type={job.type}
                      status={job.status}
                      dueDate={job.dueDate}
                      value={job.value}
                    />
                  ))}
                </div>
                {filteredJobs.length > 5 && (
                  <button className="mt-4 w-full text-center text-sm text-primary hover:text-primary/80 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded py-2">
                    View All {filteredJobs.length} Jobs →
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No active jobs found</p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Quotes Widget with Aging Buckets */}
        <div className="bg-neutral-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Pending Quotes</h2>
              <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {filteredQuotes.length}
              </span>
            </div>
            {/* Aging Buckets Bar */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Age Distribution</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden bg-gray-100">
                {Object.entries(quoteAgingBuckets).map(([bucket, count], index) => {
                  const colors = ['bg-success', 'bg-yellow-400', 'bg-orange-400', 'bg-danger'];
                  const total = Object.values(quoteAgingBuckets).reduce((a, b) => a + b, 0);
                  const width = total > 0 ? (count / total) * 100 : 0;
                  return width > 0 ? (
                    <div
                      key={bucket}
                      className={colors[index]}
                      style={{ width: `${width}%` }}
                      title={`${bucket} days: ${count} quotes`}
                    />
                  ) : null;
                })}
              </div>
              <div className="flex items-center justify-between text-xs">
                {Object.entries(quoteAgingBuckets).map(([bucket, count]) => (
                  <span key={bucket} className="text-gray-500">
                    {bucket}d: {count}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="p-6 max-h-96 overflow-y-auto">
            {filteredQuotes.length > 0 ? (
              <>
                <div className="space-y-0">
                  {filteredQuotes.slice(0, 5).map((quote) => (
                    <ListItem 
                      key={quote.id} 
                      id={quote.id}
                      customer={quote.customer}
                      type={quote.type}
                      status={quote.status}
                      dueDate={quote.expiresDate}
                      value={quote.value}
                    />
                  ))}
                </div>
                {filteredQuotes.length > 5 && (
                  <button className="mt-4 w-full text-center text-sm text-primary hover:text-primary/80 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded py-2">
                    View All {filteredQuotes.length} Quotes →
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No pending quotes found</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottlenecks Panel */}
        <div className="bg-neutral-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Production Bottlenecks</h2>
          </div>
          <div className="p-6 max-h-96 overflow-y-auto">
            {data.bottlenecks.length > 0 ? (
              <>
                <div className="space-y-3">
                  {data.bottlenecks.map((bottleneck) => {
                    const severityColors = {
                      high: 'bg-danger text-neutral-white',
                      medium: 'bg-orange-500 text-neutral-white',
                      low: 'bg-yellow-500 text-gray-900',
                    };
                    
                    return (
                      <div
                        key={bottleneck.id}
                        className="p-3 rounded-lg border-2 border-danger/20 bg-danger/5"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {bottleneck.customer}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityColors[bottleneck.severity]}`}>
                                {bottleneck.severity}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{bottleneck.type}</p>
                            <p className="text-xs text-danger mt-1">
                              ⚠️ Delayed {bottleneck.daysDelayed} days
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button className="mt-4 w-full text-center text-sm text-danger hover:text-danger/80 font-medium focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 rounded py-2">
                  View All Issues →
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/10 mb-3">
                  <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 font-medium">No bottlenecks detected</p>
                <p className="text-xs text-gray-500 mt-1">All jobs on track!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
