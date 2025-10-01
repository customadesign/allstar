/**
 * Mock data generator for Kanban board
 * Provides seedable, deterministic kanban card data
 */

export interface KanbanCard {
  id: string;
  jobNumber: string;
  customer: string;
  title: string;
  stage: KanbanStage;
  assignee?: string;
  dueDate?: Date;
  isRush?: boolean;
  isOverdue?: boolean;
  needsProofApproval?: boolean;
  value?: number;
  notes?: string[];
}

export type KanbanStage =
  | 'request'
  | 'estimate-created'
  | 'estimate-sent'
  | 'estimate-approved'
  | 'work-order'
  | 'design'
  | 'flatbed'
  | 'print'
  | 'vinyl'
  | 'build'
  | 'ada'
  | 'install'
  | 'ship'
  | 'invoice';

export const KANBAN_STAGES: { id: KanbanStage; name: string; color: string }[] = [
  { id: 'request', name: 'Request', color: 'bg-gray-100' },
  { id: 'estimate-created', name: 'Estimate Created', color: 'bg-blue-100' },
  { id: 'estimate-sent', name: 'Estimate Sent', color: 'bg-indigo-100' },
  { id: 'estimate-approved', name: 'Estimate Approved', color: 'bg-purple-100' },
  { id: 'work-order', name: 'Work Order', color: 'bg-green-100' },
  { id: 'design', name: 'Design', color: 'bg-yellow-100' },
  { id: 'flatbed', name: 'Flatbed', color: 'bg-orange-100' },
  { id: 'print', name: 'Print', color: 'bg-red-100' },
  { id: 'vinyl', name: 'Vinyl', color: 'bg-pink-100' },
  { id: 'build', name: 'Build', color: 'bg-teal-100' },
  { id: 'ada', name: 'ADA', color: 'bg-cyan-100' },
  { id: 'install', name: 'Install', color: 'bg-emerald-100' },
  { id: 'ship', name: 'Ship', color: 'bg-lime-100' },
  { id: 'invoice', name: 'Invoice', color: 'bg-green-200' },
];

const jobTitles = [
  'Channel Letters',
  'Monument Sign',
  'Wayfinding System',
  'Pylon Sign',
  'ADA Signage Package',
  'Building Letters',
  'Cabinet Sign',
  'Digital Display',
  'Vehicle Wrap',
  'Window Graphics',
  'Lobby Signage',
  'Directional Signs',
  'Menu Boards',
  'Storefront Graphics',
  'Trade Show Booth',
];

const customerNames = [
  'Acme Corp',
  'Smith Industries',
  'Tech Solutions',
  'Downtown Restaurant',
  'Medical Center',
  'Retail Plaza',
  'City Hall',
  'Metro Bank',
  'Global Logistics',
  'Summit Healthcare',
  'Prime Real Estate',
  'Coastal Marina',
  'Westside Auto',
  'Central Library',
  'Mountain Resort',
  'Urban Dental',
  'Sunrise Cafe',
  'Pacific Insurance',
  'Riverside Hotel',
  'Valley Pharmacy',
];

const assignees = [
  'John Smith',
  'Sarah Johnson',
  'Mike Davis',
  'Emily Brown',
  'David Wilson',
  'Lisa Anderson',
];

/**
 * Seedable random number generator
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

/**
 * Generate array of mock Kanban cards
 * @param count - Number of cards to generate
 * @param seed - Seed for deterministic output (default: 400)
 * @returns Array of KanbanCard objects
 */
export function generateKanbanCards(count: number, seed: number = 400): KanbanCard[] {
  const random = seededRandom(seed);
  const cards: KanbanCard[] = [];
  const stages = KANBAN_STAGES.map(s => s.id);

  for (let i = 0; i < count; i++) {
    const jobNumber = `J-${2300 + i}`;
    const customerIndex = Math.floor(random() * customerNames.length);
    const titleIndex = Math.floor(random() * jobTitles.length);
    const stageIndex = Math.floor(random() * stages.length);
    const assigneeIndex = Math.floor(random() * assignees.length);

    const isRush = random() < 0.15; // 15% rush jobs
    const needsProofApproval = random() < 0.2 && stageIndex >= 5; // 20% need proof approval
    
    const daysUntilDue = Math.floor(random() * 30) - 5; // Some overdue
    const dueDate = new Date(Date.now() + daysUntilDue * 24 * 60 * 60 * 1000);
    const isOverdue = daysUntilDue < 0;

    const value = Math.floor(random() * 50000) + 5000;

    cards.push({
      id: `card-${i}`,
      jobNumber,
      customer: customerNames[customerIndex],
      title: jobTitles[titleIndex],
      stage: stages[stageIndex],
      assignee: random() < 0.8 ? assignees[assigneeIndex] : undefined, // 80% have assignee
      dueDate,
      isRush,
      isOverdue,
      needsProofApproval,
      value,
      notes: [],
    });
  }

  return cards;
}

/**
 * Get cards by stage
 */
export function getCardsByStage(cards: KanbanCard[], stage: KanbanStage): KanbanCard[] {
  return cards.filter(card => card.stage === stage);
}

/**
 * Get rush cards
 */
export function getRushCards(cards: KanbanCard[]): KanbanCard[] {
  return cards.filter(card => card.isRush);
}

/**
 * Get overdue cards
 */
export function getOverdueCards(cards: KanbanCard[]): KanbanCard[] {
  return cards.filter(card => card.isOverdue);
}

/**
 * Get cards assigned to specific person
 */
export function getCardsByAssignee(cards: KanbanCard[], assignee: string): KanbanCard[] {
  return cards.filter(card => card.assignee === assignee);
}