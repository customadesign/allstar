'use client';

import { useMemo } from 'react';
import RevenueChart from '@/components/reporting/RevenueChart';
import JobCompletionChart from '@/components/reporting/JobCompletionChart';
import ProfitabilityChart from '@/components/reporting/ProfitabilityChart';
import ReportsTable from '@/components/reporting/ReportsTable';
import { generateDashboardData, generateJobs } from '@/lib/mock-data';

export default function ReportsPage() {
  const dashboardData = useMemo(() => generateDashboardData(), []);
  const allJobs = useMemo(() => generateJobs(100), []);

  return (
    <>
      <style jsx global>{`
        /* Print-specific styles */
        @media print {
          body {
            background: white !important;
          }
          
          /* Hide everything except report content */
          body > :not(.reports-print-container),
          header,
          nav,
          aside,
          footer,
          .no-print {
            display: none !important;
          }
          
          .reports-print-container {
            display: block !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Widget print styles */
          .report-widget {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 1rem;
          }
          
          /* Page margins */
          @page {
            margin: 0.75in;
          }
          
          /* Ensure charts render properly */
          canvas {
            max-width: 100% !important;
            height: auto !important;
          }
          
          /* Table print styles */
          table {
            page-break-inside: auto;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          thead {
            display: table-header-group;
          }
          
          tfoot {
            display: table-footer-group;
          }
        }
        
        /* Screen styles for bare layout */
        @media screen {
          .reports-print-container {
            background: white;
            min-height: 100vh;
            padding: 2rem;
          }
        }
      `}</style>
      
      <div className="reports-print-container">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="report-widget bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Jobs</h3>
            <p className="text-3xl font-bold text-primary">{allJobs.length}</p>
          </div>
          <div className="report-widget bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Active Jobs</h3>
            <p className="text-3xl font-bold text-success">
              {allJobs.filter(j => j.status === 'active').length}
            </p>
          </div>
          <div className="report-widget bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Value</h3>
            <p className="text-3xl font-bold text-gray-900">
              ${Math.round(allJobs.reduce((sum, j) => sum + (j.value || 0), 0)).toLocaleString()}
            </p>
          </div>
          <div className="report-widget bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Avg Job Value</h3>
            <p className="text-3xl font-bold text-gray-900">
              ${allJobs.length > 0 ? Math.round(allJobs.reduce((sum, j) => sum + (j.value || 0), 0) / allJobs.length).toLocaleString() : 0}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="report-widget">
            <RevenueChart revenueHistory={dashboardData.revenueHistory} />
          </div>
          <div className="report-widget">
            <JobCompletionChart jobs={allJobs} />
          </div>
        </div>

        <div className="report-widget mb-6">
          <ProfitabilityChart jobs={allJobs} />
        </div>

        {/* Data Table */}
        <div className="report-widget">
          <ReportsTable jobs={allJobs} />
        </div>
      </div>
    </>
  );
}