'use client';

import { useState, useEffect } from 'react';
import { formatCurrency, MATERIALS, validateQuoteForm } from '@/lib/utils/pricing';
import type { QuoteFormData, PricingResult } from './types';
import jsPDF from 'jspdf';

interface QuoteWizardProps {
  formData: QuoteFormData;
  setFormData: (data: QuoteFormData) => void;
  pricing: PricingResult;
}

const STEPS = [
  { id: 1, name: 'Details', description: 'Size and quantity' },
  { id: 2, name: 'Materials', description: 'Material selection' },
  { id: 3, name: 'Options', description: 'Fees and add-ons' },
  { id: 4, name: 'Review', description: 'Summary and export' },
];

const dimensionFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

const formatDimension = (value: number) => dimensionFormatter.format(value);

export default function QuoteWizard({ formData, setFormData, pricing }: QuoteWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);

  // Autosave to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('quote-draft', JSON.stringify(formData));
    }, 500);
    return () => clearTimeout(timer);
  }, [formData]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('quote-draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  const updateField = (field: keyof QuoteFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const nextStep = () => {
    // Validate current step
    const validationErrors = validateQuoteForm(formData, currentStep);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const clearDraft = () => {
    if (confirm('Clear all quote data?')) {
      localStorage.removeItem('quote-draft');
      window.location.reload();
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('All Star Signs - Quote', 20, 20);
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
    
    if (formData.customerName) {
      doc.text(`Customer: ${formData.customerName}`, 20, 38);
    }
    if (formData.projectName) {
      doc.text(`Project: ${formData.projectName}`, 20, 44);
    }
    
    // Details
    doc.setFontSize(14);
    doc.text('Quote Details', 20, 60);
    doc.setFontSize(10);
    doc.text(`Dimensions: ${formData.width} x ${formData.height} ${formData.unit}`, 20, 70);
    doc.text(`Quantity: ${formData.quantity}`, 20, 76);
    doc.text(`Sides: ${formData.sides}`, 20, 82);
    doc.text(`Material: ${MATERIALS.find(m => m.id === formData.material)?.name || 'N/A'}`, 20, 88);
    doc.text(`Finish: ${formData.finish}`, 20, 94);
    
    // Pricing Breakdown
    doc.setFontSize(14);
    doc.text('Pricing Breakdown', 20, 110);
    doc.setFontSize(10);
    let y = 120;
    doc.text(`Material Cost: ${formatCurrency(pricing.materialCost)}`, 20, y);
    y += 6;
    doc.text(`Labor Cost: ${formatCurrency(pricing.laborCost)}`, 20, y);
    if (pricing.secondSideCost > 0) {
      y += 6;
      doc.text(`Second Side: ${formatCurrency(pricing.secondSideCost)}`, 20, y);
    }
    if (pricing.setupCost > 0) {
      y += 6;
      doc.text(`Setup Fee: ${formatCurrency(pricing.setupCost)}`, 20, y);
    }
    if (pricing.rushCost > 0) {
      y += 6;
      doc.text(`Rush Fee: ${formatCurrency(pricing.rushCost)}`, 20, y);
    }
    if (pricing.installCost > 0) {
      y += 6;
      doc.text(`Installation: ${formatCurrency(pricing.installCost)}`, 20, y);
    }
    
    y += 10;
    doc.setFontSize(12);
    doc.text(`Total Price: ${formatCurrency(pricing.price)}`, 20, y);
    
    // Save
    doc.save(`quote-${Date.now()}.pdf`);
  };

  return (
    <div className="bg-neutral-white rounded-lg shadow-lg border border-gray-200">
      {/* Stepper Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <li
                key={step.id}
                className={`flex items-center ${index !== STEPS.length - 1 ? 'flex-1' : ''}`}
              >
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`group flex items-center ${index !== STEPS.length - 1 ? 'w-full' : ''}`}
                  disabled={step.id > currentStep + 1}
                >
                  <span className="flex items-center">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors
                        ${currentStep === step.id
                          ? 'border-primary bg-primary text-white'
                          : currentStep > step.id
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 bg-white text-gray-500'
                        }`}
                    >
                      {currentStep > step.id ? (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span>{step.id}</span>
                      )}
                    </span>
                    <span className="ml-3 text-left hidden sm:block">
                      <span
                        className={`text-sm font-medium ${
                          currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {step.name}
                      </span>
                      <span className="block text-xs text-gray-500">{step.description}</span>
                    </span>
                  </span>
                </button>
                {index !== STEPS.length - 1 && (
                  <div
                    className={`hidden sm:block flex-1 h-0.5 mx-4 transition-colors ${
                      currentStep > step.id ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Step Content */}
      <div className="p-6 min-h-[500px]">
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger rounded-lg">
            <h3 className="font-medium text-danger mb-2">Please fix the following errors:</h3>
            <ul className="list-disc list-inside text-sm text-danger">
              {errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Step 1: Details */}
        {currentStep === 1 && (
          <Step1Details formData={formData} updateField={updateField} pricing={pricing} />
        )}

        {/* Step 2: Materials */}
        {currentStep === 2 && (
          <Step2Materials formData={formData} updateField={updateField} />
        )}

        {/* Step 3: Options */}
        {currentStep === 3 && (
          <Step3Options formData={formData} updateField={updateField} />
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <Step4Review formData={formData} pricing={pricing} generatePDF={generatePDF} />
        )}
      </div>

      {/* Navigation Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <button
          onClick={clearDraft}
          className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          Clear Draft
        </button>
        <div className="flex gap-3">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Back
            </button>
          )}
          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={generatePDF}
              className="px-6 py-2 bg-success text-white rounded-lg hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-success"
            >
              Download PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 1: Details Component
function Step1Details({ formData, updateField, pricing }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Fields */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Sign Dimensions</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Width
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.width || ''}
                onChange={(e) => updateField('width', parseFloat(e.target.value) || 0)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.height || ''}
                onChange={(e) => updateField('height', parseFloat(e.target.value) || 0)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => updateField('unit', 'inches')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                  formData.unit === 'inches'
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Inches
              </button>
              <button
                onClick={() => updateField('unit', 'feet')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                  formData.unit === 'feet'
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Feet
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={formData.quantity || 1}
              onChange={(e) => updateField('quantity', parseInt(e.target.value) || 1)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sides
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => updateField('sides', 1)}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                  formData.sides === 1
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Single-Sided
              </button>
              <button
                onClick={() => updateField('sides', 2)}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                  formData.sides === 2
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Double-Sided (+70%)
              </button>
            </div>
          </div>
        </div>

        {/* SVG Preview */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          <SignPreview
            width={Number(formData.width) || 0}
            height={Number(formData.height) || 0}
            unit={formData.unit || 'inches'}
          />
          {pricing.area > 0 && (
            <div className="mt-4 p-3 bg-white rounded border border-gray-200">
              <p className="text-sm font-medium text-gray-700">
                Total Area: <span className="text-primary">{pricing.area.toFixed(2)} sq ft</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SignPreview({ width, height, unit }: { width: number; height: number; unit: string }) {
  const hasDimensions = width > 0 && height > 0;

  if (!hasDimensions) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Enter dimensions to see preview</p>
      </div>
    );
  }

  const VIEWBOX_SIZE = 220;
  const MAX_SIGN_SIZE = 160;
  const MIN_SIGN_SIZE = 28;

  const aspectRatio = width / height;
  let scaledWidth = MAX_SIGN_SIZE;
  let scaledHeight = MAX_SIGN_SIZE;

  if (aspectRatio >= 1) {
    scaledWidth = MAX_SIGN_SIZE;
    scaledHeight = MAX_SIGN_SIZE / aspectRatio;
  } else {
    scaledHeight = MAX_SIGN_SIZE;
    scaledWidth = MAX_SIGN_SIZE * aspectRatio;
  }

  scaledWidth = Math.max(MIN_SIGN_SIZE, scaledWidth);
  scaledHeight = Math.max(MIN_SIGN_SIZE, scaledHeight);

  const rectX = (VIEWBOX_SIZE - scaledWidth) / 2;
  const rectY = (VIEWBOX_SIZE - scaledHeight) / 2;
  const widthLabel = formatDimension(width);
  const heightLabel = formatDimension(height);

  const widthGuideY = rectY + scaledHeight + 12;
  const heightGuideX = rectX + scaledWidth + 12;

  return (
    <div className="flex items-center justify-center h-64">
      <svg
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        className="max-w-full max-h-full"
        role="img"
        aria-label={`Preview of a ${widthLabel} by ${heightLabel} ${unit} sign`}
      >
        <rect
          x={12}
          y={12}
          width={VIEWBOX_SIZE - 24}
          height={VIEWBOX_SIZE - 24}
          fill="none"
          stroke="#93C5FD"
          strokeWidth={2}
          strokeDasharray="6 6"
        />
        <rect
          x={rectX}
          y={rectY}
          width={scaledWidth}
          height={scaledHeight}
          fill="#E5E7EB"
          stroke="#1E3A8A"
          strokeWidth={3}
          rx={8}
          style={{ transition: 'all 200ms ease-out' }}
        />
        <text
          x={VIEWBOX_SIZE / 2}
          y={VIEWBOX_SIZE / 2 - 6}
          textAnchor="middle"
          fill="#1E3A8A"
          fontSize={12}
          fontWeight={600}
        >
          {widthLabel} {unit}
        </text>
        <text
          x={VIEWBOX_SIZE / 2}
          y={VIEWBOX_SIZE / 2 + 8}
          textAnchor="middle"
          fill="#1E3A8A"
          fontSize={12}
        >
          ×
        </text>
        <text
          x={VIEWBOX_SIZE / 2}
          y={VIEWBOX_SIZE / 2 + 22}
          textAnchor="middle"
          fill="#1E3A8A"
          fontSize={12}
          fontWeight={600}
        >
          {heightLabel} {unit}
        </text>
        <line
          x1={rectX}
          y1={widthGuideY}
          x2={rectX + scaledWidth}
          y2={widthGuideY}
          stroke="#1E3A8A"
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
        <line
          x1={rectX}
          y1={widthGuideY}
          x2={rectX}
          y2={widthGuideY - 8}
          stroke="#1E3A8A"
          strokeWidth={1.5}
        />
        <line
          x1={rectX + scaledWidth}
          y1={widthGuideY}
          x2={rectX + scaledWidth}
          y2={widthGuideY - 8}
          stroke="#1E3A8A"
          strokeWidth={1.5}
        />
        <text
          x={rectX + scaledWidth / 2}
          y={widthGuideY + 18}
          textAnchor="middle"
          fill="#1E3A8A"
          fontSize={12}
          fontWeight={600}
        >
          {widthLabel} {unit}
        </text>
        <line
          x1={heightGuideX}
          y1={rectY}
          x2={heightGuideX}
          y2={rectY + scaledHeight}
          stroke="#1E3A8A"
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
        <line
          x1={heightGuideX}
          y1={rectY}
          x2={heightGuideX - 8}
          y2={rectY}
          stroke="#1E3A8A"
          strokeWidth={1.5}
        />
        <line
          x1={heightGuideX}
          y1={rectY + scaledHeight}
          x2={heightGuideX - 8}
          y2={rectY + scaledHeight}
          stroke="#1E3A8A"
          strokeWidth={1.5}
        />
        <text
          x={heightGuideX + 18}
          y={rectY + scaledHeight / 2}
          textAnchor="middle"
          fill="#1E3A8A"
          fontSize={12}
          fontWeight={600}
          transform={`rotate(-90 ${heightGuideX + 18} ${rectY + scaledHeight / 2})`}
        >
          {heightLabel} {unit}
        </text>
      </svg>
    </div>
  );
}

// Step 2: Materials Component
function Step2Materials({ formData, updateField }: any) {
  const selectedMaterial = MATERIALS.find(m => m.id === formData.material);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Material Selection</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choose Material
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MATERIALS.map((material) => (
            <button
              key={material.id}
              onClick={() => {
                updateField('material', material.id);
                updateField('finish', material.finishes[0]);
              }}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                formData.material === material.id
                  ? 'border-primary bg-primary/10 ring-2 ring-primary'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <h4 className="font-medium text-gray-900">{material.name}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {formatCurrency(material.costPerSqFt)}/sq ft
              </p>
            </button>
          ))}
        </div>
      </div>

      {selectedMaterial && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Finish
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {selectedMaterial.finishes.map((finish) => (
              <button
                key={finish}
                onClick={() => updateField('finish', finish)}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  formData.finish === finish
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {finish}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Waste Factor
        </label>
        <select
          value={formData.wasteFactor}
          onChange={(e) => updateField('wasteFactor', parseFloat(e.target.value))}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="1.0">None (1.0x)</option>
          <option value="1.1">Standard (1.1x)</option>
          <option value="1.2">High (1.2x)</option>
          <option value="1.3">Very High (1.3x)</option>
        </select>
      </div>
    </div>
  );
}

// Step 3: Options Component
function Step3Options({ formData, updateField }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Additional Options</h3>
      
      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Setup Fee
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount"
              value={formData.setupFee || ''}
              onChange={(e) => updateField('setupFee', parseFloat(e.target.value) || 0)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <select
              value={formData.setupType}
              onChange={(e) => updateField('setupType', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="one-time">One-time</option>
              <option value="per-piece">Per piece</option>
            </select>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Rush Fee
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount"
              value={formData.rushFee || ''}
              onChange={(e) => updateField('rushFee', parseFloat(e.target.value) || 0)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <select
              value={formData.rushType}
              onChange={(e) => updateField('rushType', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="none">None</option>
              <option value="flat">Flat fee</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Installation Fee
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount"
            value={formData.installFee || ''}
            onChange={(e) => updateField('installFee', parseFloat(e.target.value) || 0)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
}

// Step 4: Review Component
function Step4Review({ formData, pricing, generatePDF }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Quote Summary</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Details Summary */}
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Specifications</h4>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Dimensions:</dt>
                <dd className="font-medium">{formData.width} × {formData.height} {formData.unit}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Area:</dt>
                <dd className="font-medium">{pricing.area.toFixed(2)} sq ft</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Quantity:</dt>
                <dd className="font-medium">{formData.quantity}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Sides:</dt>
                <dd className="font-medium">{formData.sides === 1 ? 'Single' : 'Double'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Material:</dt>
                <dd className="font-medium">{MATERIALS.find(m => m.id === formData.material)?.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Finish:</dt>
                <dd className="font-medium">{formData.finish}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Cost Breakdown</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Materials:</dt>
              <dd className="font-medium">{formatCurrency(pricing.materialCost)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Labor:</dt>
              <dd className="font-medium">{formatCurrency(pricing.laborCost)}</dd>
            </div>
            {pricing.secondSideCost > 0 && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Second Side:</dt>
                <dd className="font-medium">{formatCurrency(pricing.secondSideCost)}</dd>
              </div>
            )}
            {pricing.setupCost > 0 && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Setup Fee:</dt>
                <dd className="font-medium">{formatCurrency(pricing.setupCost)}</dd>
              </div>
            )}
            {pricing.rushCost > 0 && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Rush Fee:</dt>
                <dd className="font-medium">{formatCurrency(pricing.rushCost)}</dd>
              </div>
            )}
            {pricing.installCost > 0 && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Installation:</dt>
                <dd className="font-medium">{formatCurrency(pricing.installCost)}</dd>
              </div>
            )}
            <div className="pt-2 border-t border-gray-300 flex justify-between font-bold text-base">
              <dt>Total Price:</dt>
              <dd className="text-primary">{formatCurrency(pricing.price)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex items-center justify-center pt-4">
        <button
          onClick={generatePDF}
          className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Quote PDF
        </button>
      </div>
    </div>
  );
}