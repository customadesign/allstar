'use client';

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCardItem from './KanbanCardItem';
import type { KanbanCard, KanbanStage } from '@/lib/mock-data/kanban';

interface KanbanColumnProps {
  stage: {
    id: KanbanStage;
    name: string;
    color: string;
  };
  cards: KanbanCard[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onAddNote: (cardId: string, note: string) => void;
  onCardClick?: (card: KanbanCard) => void;
}

export default function KanbanColumn({
  stage,
  cards,
  isCollapsed,
  onToggleCollapse,
  onAddNote,
  onCardClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const handleAddNote = (cardId: string) => {
    setSelectedCardId(cardId);
    setShowNoteModal(true);
  };

  const handleSaveNote = () => {
    if (selectedCardId && noteText.trim()) {
      onAddNote(selectedCardId, noteText.trim());
      setNoteText('');
      setShowNoteModal(false);
      setSelectedCardId(null);
    }
  };

  return (
    <div className={`flex-shrink-0 ${isCollapsed ? 'w-16' : 'w-80'} transition-all duration-200`}>
      <div className="bg-neutral-white rounded-lg shadow-md border border-gray-200 h-full flex flex-col">
        {/* Column Header */}
        <div
          className={`${stage.color} px-4 py-3 rounded-t-lg border-b border-gray-200 flex items-center justify-between`}
        >
          {!isCollapsed ? (
            <>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                <p className="text-xs text-gray-600 mt-0.5">{cards.length} jobs</p>
              </div>
              <button
                onClick={onToggleCollapse}
                className="p-1 hover:bg-white/50 rounded transition-colors"
                aria-label="Collapse column"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </>
          ) : (
            <button
              onClick={onToggleCollapse}
              className="w-full flex flex-col items-center py-2"
              aria-label={`Expand ${stage.name} column`}
            >
              <svg className="w-5 h-5 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-xs font-medium text-gray-700 transform -rotate-90 whitespace-nowrap">
                {stage.name}
              </span>
              <span className="mt-2 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                {cards.length}
              </span>
            </button>
          )}
        </div>

        {/* Column Content */}
        {!isCollapsed && (
          <div
            ref={setNodeRef}
            className={`flex-1 overflow-y-auto p-3 space-y-2 min-h-[200px] transition-colors ${
              isOver ? 'bg-primary/5' : ''
            }`}
          >
            {cards.length > 0 ? (
              <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
                {cards.map(card => (
                  <KanbanCardItem
                    key={card.id}
                    card={card}
                    onAddNote={() => handleAddNote(card.id)}
                    onCardClick={onCardClick}
                  />
                ))}
              </SortableContext>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                Drop cards here
              </div>
            )}
          </div>
        )}
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Note</h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter your note..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              rows={4}
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowNoteModal(false);
                  setNoteText('');
                  setSelectedCardId(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                disabled={!noteText.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}