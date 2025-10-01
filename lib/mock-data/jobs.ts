/**
 * Mock data generator for active jobs
 * Provides seedable, deterministic job data for dashboard demos
 */

export interface Job {
  id: string;
  customer: string;
  type: string;
  status: 'active' | 'pending' | 'alert';
  value?: number;
  startDate?: Date;
  dueDate?: Date;
}

const jobTypes = [
  'Channel Letters',
  'Monument Sign',
  'Wayfinding',
  'Pylon Sign',
  'ADA Signage',
  'Building Letters',
  'Cabinet Sign',
  'Digital Display',
  'Vehicle Graphics',
  'Window Graphics',
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
];

/**
 * Seedable random number generator
 * Returns consistent values for same seed
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

/**
 * Generate array of mock jobs
 * @param count - Number of jobs to generate
 * @param seed - Seed for deterministic output (default: 42)
 * @returns Array of Job objects
 */
export function generateJobs(count: number, seed: number = 42): Job[] {
  const random = seededRandom(seed);
  const jobs: Job[] = [];

  for (let i = 0; i < count; i++) {
    const jobNumber = 2400 + i;
    const customerIndex = Math.floor(random() * customerNames.length);
    const typeIndex = Math.floor(random() * jobTypes.length);
    const statusRand = random();

    let status: 'active' | 'pending' | 'alert';
    if (statusRand < 0.7) {
      status = 'active';
    } else if (statusRand < 0.9) {
      status = 'pending';
    } else {
      status = 'alert';
    }

    const value = Math.floor(random() * 50000) + 5000;
    const daysAgo = Math.floor(random() * 30);
    const daysUntilDue = Math.floor(random() * 45) + 5;

    jobs.push({
      id: `J-${jobNumber}`,
      customer: customerNames[customerIndex],
      type: jobTypes[typeIndex],
      status,
      value,
      startDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + daysUntilDue * 24 * 60 * 60 * 1000),
    });
  }

  return jobs;
}

/**
 * Get active jobs (status: 'active')
 */
export function getActiveJobs(count: number = 12, seed: number = 42): Job[] {
  return generateJobs(count * 2, seed).filter(job => job.status === 'active').slice(0, count);
}

/**
 * Get jobs with bottlenecks (status: 'alert')
 */
export function getBottleneckJobs(count: number = 3, seed: number = 42): Job[] {
  return generateJobs(count * 5, seed).filter(job => job.status === 'alert').slice(0, count);
}
