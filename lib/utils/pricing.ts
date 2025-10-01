import type { QuoteFormData, PricingResult, PricingConfig, Material } from '@/components/quote-builder/types';

// Default pricing configuration
export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  targetMargin: 0.55, // 55% target margin
  warningMargin: 0.45, // 45% warning threshold
  dangerMargin: 0.35, // 35% danger threshold
  secondSideMultiplier: 0.70, // 70% of first side cost for second side
  laborRatePerSqFt: 8.50, // $8.50 per square foot for labor
};

// Mock materials database
export const MATERIALS: Material[] = [
  {
    id: 'aluminum',
    name: 'Aluminum',
    costPerSqFt: 12.50,
    finishes: ['Brushed', 'Polished', 'Painted']
  },
  {
    id: 'acrylic',
    name: 'Acrylic',
    costPerSqFt: 8.75,
    finishes: ['Clear', 'Frosted', 'Colored']
  },
  {
    id: 'pvc',
    name: 'PVC',
    costPerSqFt: 5.25,
    finishes: ['White', 'Black', 'Colored']
  },
  {
    id: 'vinyl',
    name: 'Vinyl',
    costPerSqFt: 3.50,
    finishes: ['Matte', 'Glossy', 'Textured']
  },
  {
    id: 'dibond',
    name: 'Dibond',
    costPerSqFt: 10.00,
    finishes: ['White', 'Silver', 'Black']
  }
];

/**
 * Convert dimensions to square feet
 */
function calculateArea(width: number, height: number, unit: 'inches' | 'feet'): number {
  if (unit === 'inches') {
    return (width * height) / 144; // Convert square inches to square feet
  }
  return width * height;
}

/**
 * Calculate quote pricing with all adjustments
 */
export function calculateQuotePrice(
  formData: QuoteFormData,
  config: PricingConfig = DEFAULT_PRICING_CONFIG
): PricingResult {
  // Calculate base area
  const area = calculateArea(formData.width, formData.height, formData.unit);
  
  // Find material cost per sqft
  const material = MATERIALS.find(m => m.id === formData.material);
  const materialCostPerSqFt = material?.costPerSqFt || 0;
  
  // Calculate material cost with waste factor
  const materialCost = area * materialCostPerSqFt * formData.wasteFactor * formData.quantity;
  
  // Calculate labor cost
  const laborCost = area * config.laborRatePerSqFt * formData.quantity;
  
  // Calculate second side cost (70% of first side for materials and labor)
  const secondSideCost = formData.sides === 2 
    ? (materialCost + laborCost) * config.secondSideMultiplier 
    : 0;
  
  // Calculate setup cost
  let setupCost = 0;
  if (formData.setupFee > 0) {
    if (formData.setupType === 'per-piece') {
      setupCost = formData.setupFee * formData.quantity;
    } else {
      setupCost = formData.setupFee;
    }
  }
  
  // Calculate rush cost
  let rushCost = 0;
  if (formData.rushFee > 0) {
    if (formData.rushType === 'flat') {
      rushCost = formData.rushFee;
    } else if (formData.rushType === 'percentage') {
      const baseCost = materialCost + laborCost + secondSideCost;
      rushCost = baseCost * (formData.rushFee / 100);
    }
  }
  
  // Calculate install cost
  const installCost = formData.installFee || 0;
  
  // Calculate total cost
  const totalCost = materialCost + laborCost + secondSideCost + setupCost + rushCost + installCost;
  
  // Calculate price with target margin
  const basePrice = totalCost / (1 - config.targetMargin);
  
  // Round to nearest dollar
  const price = Math.round(basePrice);
  
  // Calculate actual margin
  const margin = price - totalCost;
  const marginPercentage = totalCost > 0 ? (margin / price) * 100 : 0;
  
  return {
    materialCost,
    laborCost,
    secondSideCost,
    setupCost,
    rushCost,
    installCost,
    totalCost,
    price,
    margin,
    marginPercentage,
    area,
    basePrice
  };
}

/**
 * Get margin status color based on thresholds
 */
export function getMarginStatus(
  marginPercentage: number,
  config: PricingConfig = DEFAULT_PRICING_CONFIG
): 'success' | 'warning' | 'danger' {
  const marginDecimal = marginPercentage / 100;
  
  if (marginDecimal >= config.targetMargin) {
    return 'success';
  } else if (marginDecimal >= config.warningMargin) {
    return 'warning';
  } else {
    return 'danger';
  }
}

/**
 * Format currency value
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Validate form data for calculations
 */
export function validateQuoteForm(formData: QuoteFormData, currentStep?: number): string[] {
  const errors: string[] = [];
  
  // Step 1: Dimensions and quantity
  if (!currentStep || currentStep === 1) {
    if (formData.width <= 0) errors.push('Width must be greater than 0');
    if (formData.height <= 0) errors.push('Height must be greater than 0');
    if (formData.quantity <= 0) errors.push('Quantity must be at least 1');
  }
  
  // Step 2: Material selection
  if (!currentStep || currentStep === 2) {
    if (!formData.material) errors.push('Please select a material');
    if (!formData.finish) errors.push('Please select a finish');
  }
  
  // Step 3: Options (all optional, no validation needed)
  // Step 4: Review (no validation needed)
  
  return errors;
}