'use client';

import { useState, useEffect, useRef } from 'react';
import type { Job, Quote } from '@/lib/mock-data';

interface GlobalSearchProps {
  value: string;
  onChange: (value: string) => void;
  data: {
    allJobs: Job[];
    allQuotes: Quote[];
  };
}

interface SearchResult {
  type: 'job' | 'quote' | 'customer';
  id: string;
  title: string;
  subtitle: string;
  status?: string;
}

export default function GlobalSearch({ value, onChange, data }: GlobalSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
      if (e.key === 'Escape') {
        setShowResults(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Generate search results
  const searchResults: SearchResult[] = [];
  
  if (value.trim()) {
    const query = value.toLowerCase();
    
    // Search jobs
    data.allJobs
      .filter(job => 
        job.id.toLowerCase().includes(query) ||
        job.customer.toLowerCase().includes(query) ||
        job.type.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .forEach(job => {
        searchResults.push({
          type: 'job',
          id: job.id,
          title: `${job.id} - ${job.customer}`,
          subtitle: job.type,
          status: job.status,
        });
      });

    // Search quotes
    data.allQuotes
      .filter(quote => 
        quote.id.toLowerCase().includes(query) ||
        quote.customer.toLowerCase().includes(query) ||
        quote.type.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .forEach(quote => {
        searchResults.push({
          type: 'quote',
          id: quote.id,
          title: `${quote.id} - ${quote.customer}`,
          subtitle: quote.type,
          status: quote.status,
        });
      });

    // Extract unique customers for search
    const customers = new Set([
      ...data.allJobs.map(j => j.customer),
      ...data.allQuotes.map(q => q.customer)
    ]);
    
    Array.from(customers)
      .filter(customer => customer.toLowerCase().includes(query))
      .slice(0, 3)
      .forEach(customer => {
        searchResults.push({
          type: 'customer',
          id: customer,
          title: customer,
          subtitle: 'Customer',
        });
      });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowResults(true);
  };

  const getStatusColor = (status?: string) => {
    if (!status) return '';
    switch (status) {
      case 'active':
        return 'bg-primary/10 text-primary';
      case 'pending':
        return 'bg-gray-100 text-gray-700';
      case 'alert':
        return 'bg-danger/10 text-danger';
      case 'approved':
        return 'bg-success/10 text-success';
      case 'rejected':
        return 'bg-danger/10 text-danger';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'job':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'quote':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'customer':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            if (value.trim()) setShowResults(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => setShowResults(false), 200);
          }}
          placeholder="Search jobs, quotes, customers... (Press / to focus)"
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-neutral-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
          aria-label="Global search"
        />
        {isFocused && !value && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center border border-gray-200 rounded px-2 py-0.5 text-xs font-mono text-gray-500 bg-gray-50">
              /
            </kbd>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-neutral-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-auto">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 px-3 py-2">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </div>
            {searchResults.map((result, index) => (
              <button
                key={`${result.type}-${result.id}-${index}`}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-50 text-left transition-colors focus:outline-none focus:bg-gray-50"
                onClick={() => {
                  // Handle navigation here
                  console.log('Navigate to:', result);
                  setShowResults(false);
                }}
              >
                <div className="flex-shrink-0 text-gray-400">
                  {getTypeIcon(result.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {result.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {result.subtitle}
                  </p>
                </div>
                {result.status && (
                  <span className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(result.status)}`}>
                    {result.status}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && value.trim() && searchResults.length === 0 && (
        <div className="absolute z-50 mt-2 w-full bg-neutral-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="text-center text-sm text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">No results found</p>
            <p className="text-xs mt-1">Try searching for a job number, quote, or customer name</p>
          </div>
        </div>
      )}
    </div>
  );
}