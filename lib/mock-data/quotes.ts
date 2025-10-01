/**
 * Mock data generator for pending quotes
 * Provides seedable, deterministic quote data for dashboard demos
 */

export interface Quote {
  id: string;
  customer: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  value?: number;
  createdDate?: Date;
  expiresDate?: Date;
}

const quoteTypes = [
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
  'Directional Signage',
];

const businessNames = [
  'Downtown Restaurant',
  'Medical Center',
  'Retail Plaza',
  'Tech Startup Inc',
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
 * Generate array of mock quotes
 * @param count - Number of quotes to generate
 * @param seed - Seed for deterministic output (default: 100)
 * @returns Array of Quote objects
 */
export function generateQuotes(count: number, seed: number = 100): Quote[] {
  const random = seededRandom(seed);
  const quotes: Quote[] = [];

  for (let i = 0; i < count; i++) {
    const quoteNumber = 5800 + i;
    const customerIndex = Math.floor(random() * businessNames.length);
    const typeIndex = Math.floor(random() * quoteTypes.length);
    const statusRand = random();

    let status: 'pending' | 'approved' | 'rejected';
    if (statusRand < 0.6) {
      status = 'pending';
    } else if (statusRand < 0.85) {
      status = 'approved';
    } else {
      status = 'rejected';
    }

    const value = Math.floor(random() * 75000) + 3000;
    const daysAgo = Math.floor(random() * 14);
    const daysUntilExpiry = Math.floor(random() * 30) + 15;

    quotes.push({
      id: `Q-${quoteNumber}`,
      customer: businessNames[customerIndex],
      type: quoteTypes[typeIndex],
      status,
      value,
      createdDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      expiresDate: new Date(Date.now() + daysUntilExpiry * 24 * 60 * 60 * 1000),
    });
  }

  return quotes;
}

/**
 * Get pending quotes (status: 'pending')
 */
export function getPendingQuotes(count: number = 8, seed: number = 100): Quote[] {
  return generateQuotes(count * 2, seed).filter(quote => quote.status === 'pending').slice(0, count);
}

/**
 * Get approved quotes
 */
export function getApprovedQuotes(count: number = 5, seed: number = 100): Quote[] {
  return generateQuotes(count * 2, seed).filter(quote => quote.status === 'approved').slice(0, count);
}
