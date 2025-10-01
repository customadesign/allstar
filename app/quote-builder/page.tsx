'use client';

import { useState, useMemo } from 'react';
import QuoteWizard from '@/components/quote-builder/QuoteWizard';
import PricingHUD from '@/components/quote-builder/PricingHUD';
import { calculateQuotePrice } from '@/lib/utils/pricing';
import type { QuoteFormData } from '@/components/quote-builder/types';

export default function QuoteBuilderPage() {
  const [formData, setFormData] = useState<QuoteFormData>({
    // Step 1: Details
    width: 0,
    height: 0,
    unit: 'inches',
    quantity: 1,
    sides: 1,
    
    // Step 2: Materials
    material: '',
    finish: '',
    wasteFactor: 1.1,
    
    // Step 3: Options
    setupFee: 0,
    setupType: 'one-time',
    rushFee: 0,
    rushType: 'none',
    installFee: 0,
    
    // Metadata
    customerName: '',
    projectName: '',
  });

  // Calculate pricing in real-time
  const pricingData = useMemo(() => {
    return calculateQuotePrice(formData);
  }, [formData]);

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Pricing HUD - Sticky on desktop, fixed on mobile */}
      <PricingHUD pricing={pricingData} />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Quote Builder</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create a professional quote in 4 easy steps
          </p>
        </div>

        {/* Quote Wizard */}
        <QuoteWizard 
          formData={formData}
          setFormData={setFormData}
          pricing={pricingData}
        />
      </div>
    </div>
  );
}