/**
 * Mock data generator for revenue data
 * Provides seedable, deterministic revenue metrics for dashboard demos
 */

export interface RevenueData {
  daily: number;
  weekly: number;
  monthly: number;
  dailyChange: number; // Percentage change from previous day
  weeklyChange: number; // Percentage change from previous week
  monthlyChange: number; // Percentage change from previous month
}

export interface DailyRevenue {
  date: Date;
  amount: number;
}

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
 * Generate current revenue metrics
 * @param seed - Seed for deterministic output (default: 200)
 * @returns RevenueData object with current metrics
 */
export function generateRevenueMetrics(seed: number = 200): RevenueData {
  const random = seededRandom(seed);

  const daily = Math.floor(random() * 30000) + 15000; // $15k-$45k
  const weekly = Math.floor(random() * 150000) + 80000; // $80k-$230k
  const monthly = Math.floor(random() * 600000) + 300000; // $300k-$900k

  const dailyChange = Math.floor(random() * 40) - 10; // -10% to +30%
  const weeklyChange = Math.floor(random() * 30) - 5; // -5% to +25%
  const monthlyChange = Math.floor(random() * 25) - 5; // -5% to +20%

  return {
    daily,
    weekly,
    monthly,
    dailyChange,
    weeklyChange,
    monthlyChange,
  };
}

/**
 * Generate historical daily revenue data
 * @param days - Number of days to generate (default: 30)
 * @param seed - Seed for deterministic output (default: 200)
 * @returns Array of DailyRevenue objects
 */
export function generateDailyRevenueHistory(
  days: number = 30,
  seed: number = 200
): DailyRevenue[] {
  const random = seededRandom(seed);
  const history: DailyRevenue[] = [];
  const baseRevenue = 25000;

  for (let i = days - 1; i >= 0; i--) {
    const variance = (random() - 0.5) * 10000; // +/- $5k variance
    const trend = (days - i) * 100; // Slight upward trend
    const amount = Math.max(5000, baseRevenue + variance + trend);

    const date = new Date();
    date.setDate(date.getDate() - i);

    history.push({
      date,
      amount: Math.floor(amount),
    });
  }

  return history;
}

/**
 * Format currency value
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage change
 */
export function formatPercentage(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}%`;
}
