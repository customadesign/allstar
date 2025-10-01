'use client';

import { useState, useMemo } from 'react';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import KanbanStackView from '@/components/kanban/KanbanStackView';
import ViewSwitcher from '@/components/kanban/ViewSwitcher';
import { generateKanbanCards } from '@/lib/mock-data/kanban';
import type { KanbanCard } from '@/lib/mock-data/kanban';

type KanbanView = 'board' | 'stack' | 'card';

export default function KanbanPage() {
  const [allCards] = useState<KanbanCard[]>(() => generateKanbanCards(200));
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRush, setFilterRush] = useState(false);
  const [filterOverdue, setFilterOverdue] = useState(false);
  const [filterMine, setFilterMine] = useState(false);
  const [myName] = useState('John Smith'); // Mock current user
  const [currentView, setCurrentView] = useState<KanbanView>('board');

  // Apply filters
  const filteredCards = useMemo(() => {
    let filtered = [...allCards];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        card =>
          card.jobNumber.toLowerCase().includes(query) ||
          card.customer.toLowerCase().includes(query) ||
          card.title.toLowerCase().includes(query)
      );
    }

    // Rush filter
    if (filterRush) {
      filtered = filtered.filter(card => card.isRush);
    }

    // Overdue filter
    if (filterOverdue) {
      filtered = filtered.filter(card => card.isOverdue);
    }

    // Mine filter
    if (filterMine) {
      filtered = filtered.filter(card => card.assignee === myName);
    }

    return filtered;
  }, [allCards, searchQuery, filterRush, filterOverdue, filterMine, myName]);

  const activeFilterCount = [filterRush, filterOverdue, filterMine].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-[1800px] mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Production Board</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage jobs across the production workflow
          </p>
        </div>

        {/* View Switcher */}
        <div className="mb-4">
          <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-neutral-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFilterRush(!filterRush)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterRush
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔥 Rush
              </button>
              <button
                onClick={() => setFilterOverdue(!filterOverdue)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterOverdue
                    ? 'bg-danger text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⚠️ Overdue
              </button>
              <button
                onClick={() => setFilterMine(!filterMine)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterMine
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👤 Mine
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setFilterRush(false);
                    setFilterOverdue(false);
                    setFilterMine(false);
                    setSearchQuery('');
                  }}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Clear ({activeFilterCount})
                </button>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredCards.length} of {allCards.length} jobs
          </div>
        </div>

        {/* Kanban Views */}
        {currentView === 'board' && <KanbanBoard cards={filteredCards} />}
        {currentView === 'stack' && <KanbanStackView cards={filteredCards} />}
        {currentView === 'card' && (
          <div className="text-center py-12 text-gray-500">
            Card View - Coming Soon
          </div>
        )}
      </div>
    </div>
  );
}