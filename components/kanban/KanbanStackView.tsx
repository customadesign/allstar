'use client';

import { useState } from 'react';
import type { KanbanCard, KanbanStage } from '@/lib/mock-data/kanban';
import { KANBAN_STAGES } from '@/lib/mock-data/kanban';
import { formatCurrency } from '@/lib/mock-data';

interface KanbanStackViewProps {
  cards: KanbanCard[];
}

export default function KanbanStackView({ cards }: KanbanStackViewProps) {
  const [expandedStacks, setExpandedStacks] = useState<Set<KanbanStage>>(new Set(['request']));

  const toggleStack = (stageId: KanbanStage) => {
    setExpandedStacks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stageId)) {
        newSet.delete(stageId);
      } else {
        newSet.add(stageId);
      }
      return newSet;
    });
  };

  const getCardsByStage = (stage: KanbanStage) => {
    return cards.filter(card => card.stage === stage);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-3">
      {KANBAN_STAGES.map(stage => {
        const stageCards = getCardsByStage(stage.id);
        const isExpanded = expandedStacks.has(stage.id);
        const hasCards = stageCards.length > 0;

        return (
          <div
            key={stage.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all"
          >
            {/* Stack Header */}
            <button
              onClick={() => toggleStack(stage.id)}
              className={`w-full ${stage.color} px-4 py-3 flex items-center justify-between hover:opacity-90 transition-opacity`}
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${stage.name} stack`}
            >
              <div className="flex items-center gap-3">
                <svg
                  className={`w-5 h-5 text-gray-700 transition-transform duration-200 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {stageCards.length} job{stageCards.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {hasCards && (
                  <span className="px-3 py-1 bg-white rounded-full text-sm font-bold text-primary">
                    {stageCards.length}
                  </span>
                )}
              </div>
            </button>

            {/* Stack Content - Collapsible */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <div className="p-4 space-y-2 bg-gray-50">
                {stageCards.length > 0 ? (
                  stageCards.map((card) => {
                    const daysUntilDue = card.dueDate 
                      ? Math.ceil((card.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                      : null;

                    return (
                      <div
                        key={card.id}
                        className="bg-white rounded-lg border border-gray-200 p-3 hover:border-primary hover:shadow-sm transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Card Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                                {card.jobNumber}
                              </span>
                              {card.isRush && (
                                <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                                  🔥 Rush
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {card.customer}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-1">{card.title}</p>
                          </div>

                          {/* Assignee Avatar */}
                          {card.assignee && (
                            <div className="flex-shrink-0">
                              <div
                                className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold"
                                title={card.assignee}
                              >
                                {getInitials(card.assignee)}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Footer Info */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                          {daysUntilDue !== null && (
                            <span
                              className={`text-xs px-2 py-1 rounded font-medium ${
                                card.isOverdue
                                  ? 'bg-danger text-white'
                                  : daysUntilDue <= 3
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {card.isOverdue
                                ? `${Math.abs(daysUntilDue)}d overdue`
                                : daysUntilDue === 0
                                ? 'Due today'
                                : `${daysUntilDue}d left`}
                            </span>
                          )}
                          {card.value && (
                            <span className="text-xs text-gray-600 font-medium">
                              {formatCurrency(card.value)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No jobs in this stage
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}