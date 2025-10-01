'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import KanbanCardItem from './KanbanCardItem';
import { KANBAN_STAGES } from '@/lib/mock-data/kanban';
import type { KanbanCard, KanbanStage } from '@/lib/mock-data/kanban';
import BusinessDetailsModal from './BusinessDetailsModal';

interface KanbanBoardProps {
  cards: KanbanCard[];
}

export default function KanbanBoard({ cards: initialCards }: KanbanBoardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cards, setCards] = useState<KanbanCard[]>(initialCards);
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);
  const [collapsedColumns, setCollapsedColumns] = useState<Set<KanbanStage>>(new Set());
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update cards when props change
  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kanban-collapsed-columns');
    if (saved) {
      try {
        setCollapsedColumns(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Failed to load collapsed state:', e);
      }
    }
  }, []);

  // Load persisted card positions from localStorage and merge with initialCards
  useEffect(() => {
    const savedPositions = localStorage.getItem('kanban-card-positions');
    if (savedPositions) {
      try {
        const positions: Record<string, KanbanStage> = JSON.parse(savedPositions);
        
        // Merge persisted positions with initialCards
        const mergedCards = initialCards.map(card => ({
          ...card,
          stage: positions[card.id] || card.stage
        }));
        
        setCards(mergedCards);
      } catch (e) {
        console.error('Failed to load card positions:', e);
        setCards(initialCards);
      }
    } else {
      setCards(initialCards);
    }
  }, [initialCards]);

  // Save collapsed state to localStorage
  const toggleColumn = (stage: KanbanStage) => {
    setCollapsedColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stage)) {
        newSet.delete(stage);
      } else {
        newSet.add(stage);
      }
      localStorage.setItem('kanban-collapsed-columns', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  // Handle deep-linking for business details
  useEffect(() => {
    const businessId = searchParams.get('businessId');
    if (businessId) {
      const card = cards.find(c => c.id === businessId);
      if (card) {
        setSelectedCard(card);
        setIsDetailsModalOpen(true);
      }
    } else {
      setIsDetailsModalOpen(false);
    }
  }, [searchParams, cards]);

  const handleCardClick = (card: KanbanCard) => {
    setSelectedCard(card);
    setIsDetailsModalOpen(true);
    
    // Update URL with businessId param
    const params = new URLSearchParams(searchParams.toString());
    params.set('businessId', card.id);
    router.replace(`/kanban?${params.toString()}`);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedCard(null);
    
    // Clear URL param
    const params = new URLSearchParams(searchParams.toString());
    params.delete('businessId');
    router.replace(`/kanban${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleUpdateCard = (cardId: string, updates: Partial<KanbanCard>) => {
    const updatedCards = cards.map(card =>
      card.id === cardId ? { ...card, ...updates } : card
    );
    setCards(updatedCards);
    
    // Persist stage changes to localStorage
    const positions: Record<string, KanbanStage> = {};
    updatedCards.forEach(card => {
      positions[card.id] = card.stage;
    });
    localStorage.setItem('kanban-card-positions', JSON.stringify(positions));
    
    // Update selectedCard to reflect changes
    if (selectedCard?.id === cardId) {
      setSelectedCard({ ...selectedCard, ...updates });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = cards.find(c => c.id === active.id);
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeCard = cards.find(c => c.id === active.id);
    if (!activeCard) return;

    // Check if dropped on a column
    const overStage = over.id as KanbanStage;
    if (KANBAN_STAGES.some(s => s.id === overStage)) {
      // Move card to new stage
      const updatedCards = cards.map(card =>
        card.id === active.id ? { ...card, stage: overStage } : card
      );
      setCards(updatedCards);
      
      // Persist to localStorage
      const positions: Record<string, KanbanStage> = {};
      updatedCards.forEach(card => {
        positions[card.id] = card.stage;
      });
      localStorage.setItem('kanban-card-positions', JSON.stringify(positions));
      
      return;
    }

    // Handle reordering within same stage
    const activeIndex = cards.findIndex(c => c.id === active.id);
    const overIndex = cards.findIndex(c => c.id === over.id);

    if (activeIndex !== overIndex) {
      const reorderedCards = arrayMove(cards, activeIndex, overIndex);
      setCards(reorderedCards);
      
      // Note: For now, we're only persisting stage changes, not order within stage
      // If you need to persist order, you'll need to save the full order array
    }
  };

  // Get cards by stage
  const getCardsByStage = (stage: KanbanStage) => {
    return cards.filter(card => card.stage === stage);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_STAGES.map(stage => {
          const stageCards = getCardsByStage(stage.id);
          const isCollapsed = collapsedColumns.has(stage.id);

          return (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              cards={stageCards}
              isCollapsed={isCollapsed}
              onToggleCollapse={() => toggleColumn(stage.id)}
              onCardClick={handleCardClick}
              onAddNote={(cardId: string, note: string) => {
                setCards(prev =>
                  prev.map(card =>
                    card.id === cardId
                      ? { ...card, notes: [...(card.notes || []), note] }
                      : card
                  )
                );
              }}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeCard ? (
          <div className="rotate-3 opacity-80">
            <KanbanCardItem card={activeCard} isDragging />
          </div>
        ) : null}
      </DragOverlay>

      <BusinessDetailsModal
        card={selectedCard}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        onUpdate={handleUpdateCard}
        isAdmin={true}
      />
    </DndContext>
  );
}