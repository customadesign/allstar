'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatCurrency } from '@/lib/mock-data';
import type { KanbanCard } from '@/lib/mock-data/kanban';

interface KanbanCardItemProps {
  card: KanbanCard;
  isDragging?: boolean;
  onAddNote?: () => void;
  onCardClick?: (card: KanbanCard) => void;
}

export default function KanbanCardItem({ card, isDragging, onAddNote, onCardClick }: KanbanCardItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  };

  const getDaysUntilDue = () => {
    if (!card.dueDate) return null;
    const days = Math.ceil((card.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysUntilDue = getDaysUntilDue();

  const getDueDateColor = () => {
    if (card.isOverdue) return 'bg-danger text-white';
    if (daysUntilDue !== null && daysUntilDue <= 3) return 'bg-orange-500 text-white';
    return 'bg-gray-200 text-gray-700';
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on Add Note button or if dragging
    if ((e.target as HTMLElement).closest('button') || isSortableDragging) {
      return;
    }
    
    if (onCardClick) {
      onCardClick(card);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
      className={`bg-white rounded-lg border-2 border-gray-200 p-3 cursor-pointer hover:border-primary hover:shadow-md transition-all ${
        isDragging ? 'shadow-2xl' : ''
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
              {card.jobNumber}
            </span>
            {card.isRush && (
              <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded flex items-center gap-1">
                🔥 Rush
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {card.customer}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{card.title}</p>

      {/* Card Footer */}
      <div className="space-y-2">
        {/* Assignee */}
        {card.assignee && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="truncate">{card.assignee}</span>
          </div>
        )}

        {/* Due Date & Value */}
        <div className="flex items-center justify-between gap-2">
          {daysUntilDue !== null && (
            <span className={`text-xs px-2 py-1 rounded font-medium ${getDueDateColor()}`}>
              {card.isOverdue
                ? `${Math.abs(daysUntilDue)}d overdue`
                : daysUntilDue === 0
                ? 'Due today'
                : `${daysUntilDue}d left`}
            </span>
          )}
          {card.value && (
            <span className="text-xs text-gray-500">{formatCurrency(card.value)}</span>
          )}
        </div>

        {/* Badges */}
        {card.needsProofApproval && (
          <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Proof Needed</span>
          </div>
        )}

        {/* Notes indicator */}
        {card.notes && card.notes.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <span>{card.notes.length} note{card.notes.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Add Note Button */}
        {onAddNote && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddNote();
            }}
            className="w-full text-xs text-primary hover:text-primary/80 font-medium py-1 hover:bg-primary/5 rounded transition-colors"
          >
            + Add Note
          </button>
        )}
      </div>
    </div>
  );
}