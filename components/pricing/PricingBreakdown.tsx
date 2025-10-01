'use client';

import { useState } from 'react';
import { formatCurrency, MATERIALS, getMarginStatus } from '@/lib/utils/pricing';
import type { QuoteFormData, PricingResult, PricingConfig } from '@/components/quote-builder/types';

interface PricingBreakdownProps {
  formData: QuoteFormData;
  pricing: PricingResult;
  config: PricingConfig;
}

export default function PricingBreakdown({ formData, pricing, config }: PricingBreakdownProps) {
  const [expandedTooltip, setExpandedTooltip] = useState<string | null>(null);
  
  const material = MATERIALS.find(m => m.id === formData.material);
  const marginStatus = getMarginStatus(pricing.marginPercentage, config);

  const exportToCSV = () => {
    const rows = [
      ['Item', 'Formula', 'Amount'],
      ['Area', `${formData.width} × ${formData.height} ${formData.unit}`, `${pricing.area.toFixed(2)} sq ft`],
      ['Material Cost', `${pricing.area.toFixed(2)} sq ft × ${formatCurrency(material?.costPerSqFt || 0)}/sq ft × ${formData.wasteFactor} × ${formData.quantity}`, formatCurrency(pricing.materialCost)],
      ['Labor Cost', `${pricing.area.toFixed(2)} sq ft × ${formatCurrency(config.laborRatePerSqFt)}/sq ft × ${formData.quantity}`, formatCurrency(pricing.laborCost)],
    ];

    if (pricing.secondSideCost > 0) {
      rows.push(['Second Side', `(Material + Labor) × ${config.secondSideMultiplier}`, formatCurrency(pricing.secondSideCost)]);
    }
    if (pricing.setupCost > 0) {
      rows.push(['Setup Fee', formData.setupType === 'per-piece' ? `${formatCurrency(formData.setupFee)} × ${formData.quantity}` : formatCurrency(formData.setupFee), formatCurrency(pricing.setupCost)]);
    }
    if (pricing.rushCost > 0) {
      rows.push(['Rush Fee', formData.rushType === 'percentage' ? `Base Cost × ${formData.rushFee}%` : formatCurrency(formData.rushFee), formatCurrency(pricing.rushCost)]);
    }
    if (pricing.installCost > 0) {
      rows.push(['Installation', formatCurrency(formData.installFee), formatCurrency(pricing.installCost)]);
    }

    rows.push(['', '', '']);
    rows.push(['Total Cost', '', formatCurrency(pricing.totalCost)]);
    rows.push(['Target Margin', `${(config.targetMargin * 100).toFixed(0)}%`, '']);
    rows.push(['Price', `Cost / (1 - Margin)`, formatCurrency(pricing.price)]);
    rows.push(['Actual Margin', '', `${pricing.marginPercentage.toFixed(1)}%`]);

    const csv = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pricing-breakdown-${Date.now()}.csv`;
    a.click();
  };

  const statusColors = {
    success: 'bg-success text-white',
    warning: 'bg-orange-500 text-white',
    danger: 'bg-danger text-white',
  };

  return (
    <div className="bg-neutral-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Cost Breakdown</h2>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Specifications Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3">Specifications</h3>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-gray-700">Dimensions:</dt>
            <dd className="font-medium text-gray-900">{formData.width} × {formData.height} {formData.unit}</dd>
          </div>
          <div>
            <dt className="text-gray-700">Area:</dt>
            <dd className="font-medium text-gray-900">{pricing.area.toFixed(2)} sq ft</dd>
          </div>
          <div>
            <dt className="text-gray-700">Quantity:</dt>
            <dd className="font-medium text-gray-900">{formData.quantity}</dd>
          </div>
          <div>
            <dt className="text-gray-700">Sides:</dt>
            <dd className="font-medium text-gray-900">{formData.sides === 1 ? 'Single' : 'Double'}</dd>
          </div>
          <div>
            <dt className="text-gray-700">Material:</dt>
            <dd className="font-medium text-gray-900">{material?.name} - {formData.finish}</dd>
          </div>
          <div>
            <dt className="text-gray-700">Waste Factor:</dt>
            <dd className="font-medium text-gray-900">{formData.wasteFactor}x</dd>
          </div>
        </dl>
      </div>

      {/* Cost Breakdown Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Item</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Formula</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">Amount</th>
            </tr>
          </thead>
          <tbody>
            {/* Material Cost */}
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Material Cost</span>
                  <button
                    onClick={() => setExpandedTooltip(expandedTooltip === 'material' ? null : 'material')}
                    className="text-primary hover:text-primary/80"
                    title="Show formula"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
                {expandedTooltip === 'material' && (
                  <div className="mt-2 p-3 bg-primary/5 rounded text-xs text-gray-700">
                    <p className="font-medium mb-1 text-gray-900">Calculation:</p>
                    <p>Area ({pricing.area.toFixed(2)} sq ft) × Cost per sq ft ({formatCurrency(material?.costPerSqFt || 0)}) × Waste Factor ({formData.wasteFactor}) × Quantity ({formData.quantity})</p>
                  </div>
                )}
              </td>
              <td className="py-3 px-4 text-sm text-gray-700 font-mono">
                {pricing.area.toFixed(2)} × {formatCurrency(material?.costPerSqFt || 0)} × {formData.wasteFactor} × {formData.quantity}
              </td>
              <td className="py-3 px-4 text-right font-semibold text-gray-900">{formatCurrency(pricing.materialCost)}</td>
            </tr>

            {/* Labor Cost */}
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Labor Cost</span>
                  <button
                    onClick={() => setExpandedTooltip(expandedTooltip === 'labor' ? null : 'labor')}
                    className="text-primary hover:text-primary/80"
                    title="Show formula"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
                {expandedTooltip === 'labor' && (
                  <div className="mt-2 p-3 bg-primary/5 rounded text-xs text-gray-700">
                    <p className="font-medium mb-1 text-gray-900">Calculation:</p>
                    <p>Area ({pricing.area.toFixed(2)} sq ft) × Labor Rate ({formatCurrency(config.laborRatePerSqFt)}/sq ft) × Quantity ({formData.quantity})</p>
                  </div>
                )}
              </td>
              <td className="py-3 px-4 text-sm text-gray-700 font-mono">
                {pricing.area.toFixed(2)} × {formatCurrency(config.laborRatePerSqFt)} × {formData.quantity}
              </td>
              <td className="py-3 px-4 text-right font-semibold text-gray-900">{formatCurrency(pricing.laborCost)}</td>
            </tr>

            {/* Second Side Cost */}
            {pricing.secondSideCost > 0 && (
              <tr className="border-b border-gray-100 hover:bg-gray-50 bg-blue-50/50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">Second Side (+{(config.secondSideMultiplier * 100).toFixed(0)}%)</span>
                    <button
                      onClick={() => setExpandedTooltip(expandedTooltip === 'second' ? null : 'second')}
                      className="text-primary hover:text-primary/80"
                      title="Show formula"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  {expandedTooltip === 'second' && (
                    <div className="mt-2 p-3 bg-primary/5 rounded text-xs text-gray-700">
                      <p className="font-medium mb-1 text-gray-900">Calculation:</p>
                      <p>(Material Cost + Labor Cost) × Second Side Multiplier ({config.secondSideMultiplier})</p>
                      <p className="mt-1">= ({formatCurrency(pricing.materialCost)} + {formatCurrency(pricing.laborCost)}) × {config.secondSideMultiplier}</p>
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700 font-mono">
                  ({formatCurrency(pricing.materialCost + pricing.laborCost)}) × {config.secondSideMultiplier}
                </td>
                <td className="py-3 px-4 text-right font-semibold text-gray-900">{formatCurrency(pricing.secondSideCost)}</td>
              </tr>
            )}

            {/* Setup Fee */}
            {pricing.setupCost > 0 && (
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">Setup Fee ({formData.setupType})</td>
                <td className="py-3 px-4 text-sm text-gray-700 font-mono">
                  {formData.setupType === 'per-piece' ? `${formatCurrency(formData.setupFee)} × ${formData.quantity}` : formatCurrency(formData.setupFee)}
                </td>
                <td className="py-3 px-4 text-right font-semibold text-gray-900">{formatCurrency(pricing.setupCost)}</td>
              </tr>
            )}

            {/* Rush Fee */}
            {pricing.rushCost > 0 && (
              <tr className="border-b border-gray-100 hover:bg-gray-50 bg-orange-50/50">
                <td className="py-3 px-4 font-medium text-gray-900">Rush Fee</td>
                <td className="py-3 px-4 text-sm text-gray-700 font-mono">
                  {formData.rushType === 'percentage' 
                    ? `Base Cost × ${formData.rushFee}%`
                    : formatCurrency(formData.rushFee)
                  }
                </td>
                <td className="py-3 px-4 text-right font-semibold text-gray-900">{formatCurrency(pricing.rushCost)}</td>
              </tr>
            )}

            {/* Installation */}
            {pricing.installCost > 0 && (
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">Installation</td>
                <td className="py-3 px-4 text-sm text-gray-700 font-mono">{formatCurrency(formData.installFee)}</td>
                <td className="py-3 px-4 text-right font-semibold text-gray-900">{formatCurrency(pricing.installCost)}</td>
              </tr>
            )}

            {/* Total Cost */}
            <tr className="border-t-2 border-gray-300 bg-gray-50">
              <td className="py-4 px-4 font-bold text-lg text-gray-900">Total Cost</td>
              <td className="py-4 px-4"></td>
              <td className="py-4 px-4 text-right font-bold text-lg text-gray-900">{formatCurrency(pricing.totalCost)}</td>
            </tr>

            {/* Margin Calculation */}
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 font-medium text-gray-700">Target Margin</td>
              <td className="py-3 px-4 text-sm text-gray-700">{(config.targetMargin * 100).toFixed(0)}%</td>
              <td className="py-3 px-4 text-right text-gray-700">Cost ÷ (1 - {config.targetMargin})</td>
            </tr>

            {/* Final Price */}
            <tr className="border-t-2 border-primary/20 bg-primary/5">
              <td className="py-4 px-4 font-bold text-lg text-primary">Customer Price</td>
              <td className="py-4 px-4"></td>
              <td className="py-4 px-4 text-right font-bold text-2xl text-primary">{formatCurrency(pricing.price)}</td>
            </tr>

            {/* Actual Margin */}
            <tr className={`border-t ${statusColors[marginStatus]}`}>
              <td className="py-3 px-4 font-semibold">Actual Margin</td>
              <td className="py-3 px-4 font-semibold">{formatCurrency(pricing.margin)}</td>
              <td className="py-3 px-4 text-right font-bold text-xl">{pricing.marginPercentage.toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}