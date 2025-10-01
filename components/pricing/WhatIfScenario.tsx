'use client';

import { useState } from 'react';
import { formatCurrency, formatPercentage } from '@/lib/mock-data';
import type { PricingConfig, PricingResult } from '@/components/quote-builder/types';

interface WhatIfScenarioProps {
  config: PricingConfig;
  onConfigChange: (config: PricingConfig) => void;
  currentPricing: PricingResult;
}

export default function WhatIfScenario({ config, onConfigChange, currentPricing }: WhatIfScenarioProps) {
  const [comparisonScenarios, setComparisonScenarios] = useState<{
    name: string;
    config: PricingConfig;
  }[]>([
    { name: 'Conservative', config: { ...config, targetMargin: 0.60 } },
    { name: 'Competitive', config: { ...config, targetMargin: 0.45 } },
  ]);

  const updateConfig = (updates: Partial<PricingConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  const resetToDefaults = () => {
    onConfigChange({
      targetMargin: 0.55,
      warningMargin: 0.45,
      dangerMargin: 0.35,
      secondSideMultiplier: 0.70,
      laborRatePerSqFt: 8.50,
    });
  };

  return (
    <div className="space-y-6">
      {/* What-If Controls */}
      <div className="bg-neutral-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">What-If Scenarios</h2>
          <button
            onClick={resetToDefaults}
            className="text-xs text-primary hover:text-primary/80 font-medium"
          >
            Reset Defaults
          </button>
        </div>

        <div className="space-y-4">
          {/* Target Margin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Margin: {(config.targetMargin * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="30"
              max="70"
              step="1"
              value={config.targetMargin * 100}
              onChange={(e) => updateConfig({ targetMargin: parseInt(e.target.value) / 100 })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-700 mt-1">
              <span>30%</span>
              <span>70%</span>
            </div>
          </div>

          {/* Labor Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Labor Rate: {formatCurrency(config.laborRatePerSqFt)}/sq ft
            </label>
            <input
              type="range"
              min="5"
              max="15"
              step="0.50"
              value={config.laborRatePerSqFt}
              onChange={(e) => updateConfig({ laborRatePerSqFt: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-700 mt-1">
              <span>$5.00</span>
              <span>$15.00</span>
            </div>
          </div>

          {/* Second Side Multiplier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Second Side: {(config.secondSideMultiplier * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={config.secondSideMultiplier * 100}
              onChange={(e) => updateConfig({ secondSideMultiplier: parseInt(e.target.value) / 100 })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-700 mt-1">
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Current Impact */}
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Current Scenario</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-700">Price:</dt>
              <dd className="font-bold text-primary">{formatCurrency(currentPricing.price)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-700">Margin:</dt>
              <dd className="font-bold text-gray-900">{currentPricing.marginPercentage.toFixed(1)}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-700">Profit:</dt>
              <dd className="font-bold text-success">{formatCurrency(currentPricing.margin)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Comparison Scenarios */}
      <div className="bg-neutral-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Strategy Comparison</h2>
        
        <div className="space-y-3">
          {comparisonScenarios.map((scenario, index) => {
            const scenarioPrice = currentPricing.totalCost / (1 - scenario.config.targetMargin);
            const scenarioMargin = scenarioPrice - currentPricing.totalCost;
            const priceDiff = scenarioPrice - currentPricing.price;

            return (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => onConfigChange(scenario.config)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{scenario.name}</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    priceDiff > 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                  }`}>
                    {priceDiff > 0 ? '+' : ''}{formatCurrency(priceDiff)}
                  </span>
                </div>
                <dl className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <dt className="text-gray-700">Price</dt>
                    <dd className="font-semibold text-gray-900">{formatCurrency(scenarioPrice)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-700">Margin</dt>
                    <dd className="font-semibold text-gray-900">{(scenario.config.targetMargin * 100).toFixed(0)}%</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-gray-700">Profit</dt>
                    <dd className="font-semibold text-success">{formatCurrency(scenarioMargin)}</dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            const name = prompt('Enter scenario name:');
            if (name) {
              setComparisonScenarios([...comparisonScenarios, { name, config: { ...config } }]);
            }
          }}
          className="mt-4 w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-800 hover:border-primary hover:text-primary transition-colors"
        >
          + Save Current as Scenario
        </button>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pricing Tips
        </h3>
        <ul className="text-xs text-blue-900 space-y-1">
          <li>• Higher margins = more profit but may be less competitive</li>
          <li>• Lower margins = more competitive but less profit</li>
          <li>• Adjust labor rates based on complexity</li>
          <li>• Second side typically costs 50-70% of first side</li>
        </ul>
      </div>
    </div>
  );
}