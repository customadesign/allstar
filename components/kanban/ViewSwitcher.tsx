'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

type KanbanView = 'board' | 'stack' | 'card';

interface ViewSwitcherProps {
  currentView?: KanbanView;
  onViewChange?: (view: KanbanView) => void;
}

export default function ViewSwitcher({ currentView = 'board', onViewChange }: ViewSwitcherProps) {
  const [view, setView] = useState<KanbanView>(currentView);

  const handleViewChange = (newView: KanbanView) => {
    setView(newView);
    if (onViewChange) {
      onViewChange(newView);
    }
  };

  const views: { id: KanbanView; label: string; icon: ReactNode }[] = [
    {
      id: 'board',
      label: 'Board View',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      ),
    },
    {
      id: 'stack',
      label: 'Stack View',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
    {
      id: 'card',
      label: 'Card View',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-md border border-gray-200 p-1">
      <span className="text-sm font-medium text-gray-700 px-2">View:</span>
      {views.map((viewOption) => (
        <button
          key={viewOption.id}
          onClick={() => handleViewChange(viewOption.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            view === viewOption.id
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          aria-label={viewOption.label}
          aria-pressed={view === viewOption.id}
        >
          {viewOption.icon}
          <span>{viewOption.label}</span>
        </button>
      ))}
    </div>
  );
}