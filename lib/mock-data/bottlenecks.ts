/**
 * Mock data generator for production bottlenecks
 * Provides seedable, deterministic bottleneck data for dashboard demos
 */

export interface Bottleneck {
  id: string;
  customer: string;
  type: string; // Description of the bottleneck issue
  status: 'alert';
  severity: 'high' | 'medium' | 'low';
  daysDelayed?: number;
}

const bottleneckReasons = [
  'Awaiting Design Approval',
  'Material Delayed',
  'Permit Pending',
  'Weather Hold',
  'Client Revision Requested',
  'Installation Crew Unavailable',
  'Supplier Backorder',
  'Engineering Review Required',
  'Site Access Restricted',
  'Electrical Inspection Needed',
];

const affectedCustomers = [
  'Tech Solutions',
  'City Hall',
  'Metro Bank',
  'Summit Healthcare',
  'Retail Plaza',
  'Westside Auto',
  'Mountain Resort',
  'Coastal Marina',
  'Prime Real Estate',
  'Global Logistics',
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
 * Generate array of mock bottlenecks
 * @param count - Number of bottlenecks to generate
 * @param seed - Seed for deterministic output (default: 300)
 * @returns Array of Bottleneck objects
 */
export function generateBottlenecks(count: number, seed: number = 300): Bottleneck[] {
  const random = seededRandom(seed);
  const bottlenecks: Bottleneck[] = [];

  for (let i = 0; i < count; i++) {
    const jobNumber = 2390 + i;
    const customerIndex = Math.floor(random() * affectedCustomers.length);
    const reasonIndex = Math.floor(random() * bottleneckReasons.length);
    const severityRand = random();

    let severity: 'high' | 'medium' | 'low';
    if (severityRand < 0.3) {
      severity = 'high';
    } else if (severityRand < 0.7) {
      severity = 'medium';
    } else {
      severity = 'low';
    }

    const daysDelayed = Math.floor(random() * 14) + 1;

    bottlenecks.push({
      id: `J-${jobNumber}`,
      customer: affectedCustomers[customerIndex],
      type: bottleneckReasons[reasonIndex],
      status: 'alert',
      severity,
      daysDelayed,
    });
  }

  return bottlenecks;
}

/**
 * Get high severity bottlenecks
 */
export function getHighSeverityBottlenecks(count: number = 5, seed: number = 300): Bottleneck[] {
  return generateBottlenecks(count * 3, seed)
    .filter(b => b.severity === 'high')
    .slice(0, count);
}

/**
 * Get bottlenecks sorted by days delayed (descending)
 */
export function getBottlenecksByDelay(count: number = 10, seed: number = 300): Bottleneck[] {
  return generateBottlenecks(count * 2, seed)
    .sort((a, b) => (b.daysDelayed || 0) - (a.daysDelayed || 0))
    .slice(0, count);
}
