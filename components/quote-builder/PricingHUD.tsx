'use client';

import { formatCurrency, getMarginStatus, DEFAULT_PRICING_CONFIG } from '@/lib/utils/pricing';
import type { PricingResult } from '@/components/quote-builder/types';

interface PricingHUDProps {
  pricing: PricingResult;
}

export default function PricingHUD({ pricing }: PricingHUDProps) {
  const marginStatus = getMarginStatus(pricing.marginPercentage);
  
  const statusColors = {
    success: {
      bg: 'bg-success',
      text: 'text-success',
      border: 'border-success',
      ring: 'ring-success',
    },
    warning: {
      bg: 'bg-orange-500',
      text: 'text-orange-600',
      border: 'border-orange-500',
      ring: 'ring-orange-500',
    },
    danger: {
      bg: 'bg-danger',
      text: 'text-danger',
      border: 'border-danger',
      ring: 'ring-danger',
    },
  };

  const colors = statusColors[marginStatus];

  return (
    <div className="sticky top-0 z-40 bg-neutral-white border-b-2 border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Title */}
            <div className="hidden sm:block">
              <h2 className="text-lg font-semibold text-gray-900">Pricing Overview</h2>
              <p className="text-xs text-gray-800 mt-0.5 font-medium">
                Target: {Math.round(DEFAULT_PRICING_CONFIG.targetMargin * 100)}% margin
              </p>
            </div>

            {/* Pricing Metrics */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full sm:w-auto">
              {/* Cost */}
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Cost
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {formatCurrency(pricing.totalCost)}
                </p>
                {pricing.area > 0 && (
                  <p className="text-xs text-gray-800 mt-0.5 font-semibold">
                    {pricing.area.toFixed(2)} sq ft
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Price
                </p>
                <p className="text-xl sm:text-2xl font-bold text-primary">
                  {formatCurrency(pricing.price)}
                </p>
                <p className="text-xs text-gray-800 mt-0.5 font-semibold">
                  Customer pays
                </p>
              </div>

              {/* Margin */}
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Margin
                </p>
                <p className={`text-xl sm:text-2xl font-bold ${colors.text}`}>
                  {pricing.marginPercentage.toFixed(1)}%
                </p>
                <p className={`text-xs mt-0.5 ${colors.text} font-semibold`}>
                  {formatCurrency(pricing.margin)}
                </p>
              </div>
            </div>

            {/* Margin Status Indicator */}
            <div className="flex items-center gap-3 sm:border-l sm:border-gray-200 sm:pl-6">
              <div className="flex flex-col items-end">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${colors.bg} text-white font-medium`}>
                  {marginStatus === 'success' && (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">Good Margin</span>
                    </>
                  )}
                  {marginStatus === 'warning' && (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-sm">Low Margin</span>
                    </>
                  )}
                  {marginStatus === 'danger' && (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">Very Low</span>
                    </>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                    <span className="text-gray-800 font-medium">≥55%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-gray-800 font-medium">≥45%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-danger"></div>
                    <span className="text-gray-800 font-medium">&lt;45%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}