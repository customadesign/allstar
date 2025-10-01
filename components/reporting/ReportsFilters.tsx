'use client';

import { format } from 'date-fns';
import type { Job } from '@/lib/mock-data';

interface ReportsFiltersProps {
  filters: {
    startDate: Date;
    endDate: Date;
    customer: string;
    jobType: string;
    assignee: string;
    stage: string;
  };
  setFilters: (filters: any) => void;
  jobs: Job[];
}

export default function ReportsFilters({ filters, setFilters, jobs }: ReportsFiltersProps) {
  const customers = Array.from(new Set(jobs.map(j => j.customer))).sort();
  const jobTypes = Array.from(new Set(jobs.map(j => j.type))).sort();

  const setDateRange = (days: number) => {
    setFilters({
      ...filters,
      startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      endDate: new Date(),
    });
  };

  const clearFilters = () => {
    setFilters({
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
      customer: 'all',
      jobType: 'all',
      assignee: 'all',
      stage: 'all',
    });
  };

  return (
    <div className="bg-neutral-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-primary hover:text-primary/80 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range Presets */}
        <div className="md:col-span-2 lg:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDateRange(7)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setDateRange(30)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setDateRange(90)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              Last 90 Days
            </button>
            <button
              onClick={() => setDateRange(365)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              Last Year
            </button>
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={format(filters.startDate, 'yyyy-MM-dd')}
            onChange={(e) => setFilters({ ...filters, startDate: new Date(e.target.value) })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={format(filters.endDate, 'yyyy-MM-dd')}
            onChange={(e) => setFilters({ ...filters, endDate: new Date(e.target.value) })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          />
        </div>

        {/* Customer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer
          </label>
          <select
            value={filters.customer}
            onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          >
            <option value="all">All Customers</option>
            {customers.map(customer => (
              <option key={customer} value={customer}>{customer}</option>
            ))}
          </select>
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Type
          </label>
          <select
            value={filters.jobType}
            onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          >
            <option value="all">All Types</option>
            {jobTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}