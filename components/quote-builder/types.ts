export interface QuoteFormData {
  // Step 1: Details
  width: number;
  height: number;
  unit: 'inches' | 'feet';
  quantity: number;
  sides: 1 | 2;
  
  // Step 2: Materials
  material: string;
  finish: string;
  wasteFactor: number;
  
  // Step 3: Options
  setupFee: number;
  setupType: 'per-piece' | 'one-time';
  rushFee: number;
  rushType: 'none' | 'flat' | 'percentage';
  installFee: number;
  
  // Metadata
  customerName: string;
  projectName: string;
}

export interface PricingResult {
  // Base costs
  materialCost: number;
  laborCost: number;
  
  // Adjustments
  secondSideCost: number;
  setupCost: number;
  rushCost: number;
  installCost: number;
  
  // Totals
  totalCost: number;
  price: number;
  margin: number;
  marginPercentage: number;
  
  // Details for breakdown
  area: number;
  basePrice: number;
}

export interface Material {
  id: string;
  name: string;
  costPerSqFt: number;
  finishes: string[];
}

export interface PricingConfig {
  targetMargin: number;
  warningMargin: number;
  dangerMargin: number;
  secondSideMultiplier: number;
  laborRatePerSqFt: number;
}