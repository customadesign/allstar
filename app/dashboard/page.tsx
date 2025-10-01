'use client';

import { useState, useMemo } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import GlobalSearch from '@/components/dashboard/GlobalSearch';
import { generateDashboardData } from '@/lib/mock-data';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const dashboardData = useMemo(() => generateDashboardData(), []);

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header with Global Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <GlobalSearch 
            value={searchQuery}
            onChange={setSearchQuery}
            data={dashboardData}
          />
        </div>

        {/* Dashboard Component */}
        <Dashboard data={dashboardData} searchQuery={searchQuery} />
      </div>
    </div>
  );
}