'use client';

import { useState } from 'react';
import PricingBreakdown from '@/components/pricing/PricingBreakdown';
import WhatIfScenario from '@/components/pricing/WhatIfScenario';
import { calculateQuotePrice, DEFAULT_PRICING_CONFIG, MATERIALS, formatCurrency } from '@/lib/utils/pricing';
import type { QuoteFormData } from '@/components/quote-builder/types';

export default function PricingPage() {
  const [sampleQuote, setSampleQuote] = useState<QuoteFormData>({
    width: 48,
    height: 24,
    unit: 'inches',
    quantity: 2,
    sides: 2,
    material: 'aluminum',
    finish: 'Brushed',
    wasteFactor: 1.1,
    setupFee: 150,
    setupType: 'one-time',
    rushFee: 0,
    rushType: 'none',
    installFee: 500,
    customerName: 'Sample Customer',
    projectName: 'Channel Letters',
  });

  const [config, setConfig] = useState(DEFAULT_PRICING_CONFIG);
  const pricing = calculateQuotePrice(sampleQuote, config);

  const handleMaterialChange = (materialId: string) => {
    const selectedMaterial = MATERIALS.find(m => m.id === materialId);
    if (selectedMaterial) {
      setSampleQuote(prev => ({
        ...prev,
        material: materialId,
        finish: selectedMaterial.finishes[0] // Auto-select first finish
      }));
    }
  };

  const selectedMaterial = MATERIALS.find(m => m.id === sampleQuote.material);

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Pricing Engine</h1>
          <p className="mt-1 text-sm text-gray-700">
            Transparent cost breakdowns and pricing scenarios
          </p>
        </div>

        {/* Material Selector */}
        <div className="mb-6 bg-neutral-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Material Selection</h3>
          <p className="text-sm text-gray-600 mb-4">
            Select a material to see how it affects pricing calculations
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {MATERIALS.map((material) => (
              <button
                key={material.id}
                onClick={() => handleMaterialChange(material.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                  sampleQuote.material === material.id
                    ? 'border-primary bg-primary/10 ring-2 ring-primary'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                aria-label={`Select ${material.name} material`}
                aria-pressed={sampleQuote.material === material.id}
              >
                <h4 className="font-semibold text-gray-900 mb-1">{material.name}</h4>
                <p className="text-sm text-primary font-medium">
                  {formatCurrency(material.costPerSqFt)}/sq ft
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {material.finishes.length} finishes
                </p>
              </button>
            ))}
          </div>

          {/* Selected Material Details */}
          {selectedMaterial && (
            <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Selected: <span className="text-primary">{selectedMaterial.name}</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Finish: {sampleQuote.finish}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-700">Base Material Cost</p>
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(selectedMaterial.costPerSqFt)}/sq ft
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Pricing Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <PricingBreakdown 
              formData={sampleQuote}
              pricing={pricing}
              config={config}
            />
          </div>

          {/* Sidebar - What-If Scenarios */}
          <div>
            <WhatIfScenario 
              config={config}
              onConfigChange={setConfig}
              currentPricing={pricing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}