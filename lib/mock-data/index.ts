/**
 * Mock Data Generator Library
 * Central export for all seedable, deterministic mock data generators
 *
 * Usage:
 * import { generateJobs, getPendingQuotes, generateRevenueMetrics } from '@/lib/mock-data';
 *
 * All generators support seeding for consistent, reproducible data:
 * const jobs = generateJobs(100, 42); // Always generates same 100 jobs
 */

// Jobs
export {
  generateJobs,
  getActiveJobs,
  getBottleneckJobs,
  type Job,
} from './jobs';

// Quotes
export {
  generateQuotes,
  getPendingQuotes,
  getApprovedQuotes,
  type Quote,
} from './quotes';

// Revenue
export {
  generateRevenueMetrics,
  generateDailyRevenueHistory,
  formatCurrency,
  formatPercentage,
  type RevenueData,
  type DailyRevenue,
} from './revenue';

// Bottlenecks
export {
  generateBottlenecks,
  getHighSeverityBottlenecks,
  getBottlenecksByDelay,
  type Bottleneck,
} from './bottlenecks';

// Kanban
export {
  generateKanbanCards,
  getCardsByStage,
  getRushCards,
  getOverdueCards,
  getCardsByAssignee,
  KANBAN_STAGES,
  type KanbanCard,
  type KanbanStage,
} from './kanban';

// Import functions for use in generateDashboardData
import { getActiveJobs } from './jobs';
import { getPendingQuotes, generateQuotes } from './quotes';
import { generateRevenueMetrics, generateDailyRevenueHistory } from './revenue';
import { getBottlenecksByDelay } from './bottlenecks';
import { generateJobs } from './jobs';

/**
 * Default seeds for consistent demo data
 */
export const DEFAULT_SEEDS = {
  jobs: 42,
  quotes: 100,
  revenue: 200,
  bottlenecks: 300,
  kanban: 400,
} as const;

/**
 * Generate complete dashboard dataset
 * Returns all data needed for dashboard with consistent seeding
 */
export function generateDashboardData(customSeeds?: Partial<typeof DEFAULT_SEEDS>) {
  const seeds = { ...DEFAULT_SEEDS, ...customSeeds };

  return {
    activeJobs: getActiveJobs(12, seeds.jobs),
    pendingQuotes: getPendingQuotes(8, seeds.quotes),
    revenue: generateRevenueMetrics(seeds.revenue),
    bottlenecks: getBottlenecksByDelay(3, seeds.bottlenecks),
    allJobs: generateJobs(50, seeds.jobs),
    allQuotes: generateQuotes(30, seeds.quotes),
    revenueHistory: generateDailyRevenueHistory(30, seeds.revenue),
  };
}
