'use client';

import { useState, useRef, useEffect } from 'react';
import { read, utils } from 'xlsx';
import Papa from 'papaparse';
import { trackEvent } from '@/lib/utils/analytics';
import { useToast } from '@/components/ui/ToastProvider';
import { upsertCompanyByEmailOrName, upsertContactByEmail, type CreateCompanyInput, type CreateContactInput } from '@/lib/data/store';
import type { ImportEntityType } from '@/lib/types/entities';

interface ImportWizardProps {
  onClose: () => void;
}

type ImportRow = Record<string, any>;

interface FieldMapping {
  source: string; // CSV column name
  target: string; // Data model field
}

interface ImportResult {
  row: number;
  status: 'created' | 'updated' | 'failed';
  error?: string;
  data?: any;
}

const COMPANY_FIELDS = ['name', 'email', 'phone', 'website', 'address'];
const CONTACT_FIELDS = ['firstName', 'lastName', 'email', 'phone', 'companyId'];

const MAX_FILE_SIZE_MB = 10;

export default function ImportWizard({ onClose }: ImportWizardProps) {
  const showToast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<'upload' | 'map' | 'preview' | 'process' | 'summary'>('upload');
  const [entityType, setEntityType] = useState<ImportEntityType>('companies');
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [progress, setProgress] = useState(0);

  const targetFields = entityType === 'companies' ? COMPANY_FIELDS : CONTACT_FIELDS;

  // Auto-map fields that have matching names
  useEffect(() => {
    if (headers.length > 0 && mappings.length === 0) {
      const auto: FieldMapping[] = [];
      targetFields.forEach((tf) => {
        const match = headers.find((h) => h.toLowerCase() === tf.toLowerCase());
        if (match) {
          auto.push({ source: match, target: tf });
        }
      });
      setMappings(auto);
    }
  }, [headers, targetFields]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    trackEvent('import_click', { entityType, fileName: selected.name });

    // Validate file type
    const ext = selected.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext || '')) {
      showToast({ title: 'Invalid file type', description: 'Please upload a CSV or XLSX file.', variant: 'error' });
      return;
    }

    // Validate file size
    const sizeMB = selected.size / 1024 / 1024;
    if (sizeMB > MAX_FILE_SIZE_MB) {
      showToast({
        title: 'File too large',
        description: `Maximum file size is ${MAX_FILE_SIZE_MB}MB. Your file is ${sizeMB.toFixed(1)}MB.`,
        variant: 'error',
      });
      return;
    }

    setFile(selected);

    try {
      // Parse file
      let parsed: ImportRow[] = [];
      let headerRow: string[] = [];

      if (ext === 'csv') {
        // Parse CSV with PapaParse
        const text = await selected.text();
        const result = Papa.parse<Record<string, any>>(text, { header: true, skipEmptyLines: true });
        if (result.errors.length > 0) {
          console.warn('CSV parse warnings:', result.errors);
        }
        parsed = result.data;
        headerRow = result.meta.fields || [];
      } else {
        // Parse XLSX with xlsx library
        const buffer = await selected.arrayBuffer();
        const workbook = read(buffer);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });
        parsed = json;
        if (json.length > 0) {
          headerRow = Object.keys(json[0]);
        }
      }

      setHeaders(headerRow);
      setRows(parsed);
      setStep('map');
    } catch (err: any) {
      console.error('Parse error:', err);
      showToast({ title: 'Parse error', description: err.message || 'Failed to read file.', variant: 'error' });
    }
  };

  const updateMapping = (source: string, target: string) => {
    setMappings((prev) => {
      const idx = prev.findIndex((m) => m.source === source);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { source, target };
        return next;
      }
      return [...prev, { source, target }];
    });
  };

  const removeMapping = (source: string) => {
    setMappings((prev) => prev.filter((m) => m.source !== source));
  };

  const proceedToPreview = () => {
    // Validate required fields are mapped
    const requiredFields = entityType === 'companies' ? ['name'] : ['firstName', 'email'];
    const mapped = mappings.map((m) => m.target);
    const missing = requiredFields.filter((rf) => !mapped.includes(rf));

    if (missing.length > 0) {
      showToast({
        title: 'Missing required fields',
        description: `Please map: ${missing.join(', ')}`,
        variant: 'error',
      });
      return;
    }

    setStep('preview');
  };

  const startImport = async () => {
    setStep('process');
    setProcessing(true);
    setProgress(0);

    const importResults: ImportResult[] = [];

    try {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const mapped: any = {};
        mappings.forEach((m) => {
          mapped[m.target] = row[m.source] || undefined;
        });

        try {
          if (entityType === 'companies') {
            const input: CreateCompanyInput = mapped;
            const result = upsertCompanyByEmailOrName(input);
            importResults.push({
              row: i + 1,
              status: result.created ? 'created' : 'updated',
              data: result.data,
            });
          } else {
            const input: CreateContactInput = mapped;
            const result = upsertContactByEmail(input);
            importResults.push({
              row: i + 1,
              status: result.created ? 'created' : 'updated',
              data: result.data,
            });
          }
        } catch (err: any) {
          importResults.push({
            row: i + 1,
            status: 'failed',
            error: err.message || 'Unknown error',
          });
        }

        setProgress(Math.round(((i + 1) / rows.length) * 100));

        // Yield to UI for large files
        if (i % 10 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }

      setResults(importResults);
      trackEvent('import_success', {
        entityType,
        total: importResults.length,
        created: importResults.filter((r) => r.status === 'created').length,
        updated: importResults.filter((r) => r.status === 'updated').length,
        failed: importResults.filter((r) => r.status === 'failed').length,
      });
      setStep('summary');
    } catch (err: any) {
      trackEvent('import_error', { entityType, error: err.message });
      showToast({ title: 'Import failed', description: err.message, variant: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  const downloadErrorReport = () => {
    const errors = results.filter((r) => r.status === 'failed');
    if (errors.length === 0) {
      showToast({ title: 'No errors', description: 'All rows were processed successfully.', variant: 'info' });
      return;
    }

    const csv = Papa.unparse(
      errors.map((e) => ({
        Row: e.row,
        Error: e.error,
      }))
    );

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `import-errors-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const created = results.filter((r) => r.status === 'created').length;
  const updated = results.filter((r) => r.status === 'updated').length;
  const failed = results.filter((r) => r.status === 'failed').length;

  return (
    <div>
      {/* Step Upload */}
      {step === 'upload' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entity Type
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEntityType('companies')}
                className={`px-4 py-2 rounded-lg border-2 ${
                  entityType === 'companies'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Companies
              </button>
              <button
                type="button"
                onClick={() => setEntityType('contacts')}
                className={`px-4 py-2 rounded-lg border-2 ${
                  entityType === 'contacts'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Contacts
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File (CSV or XLSX, max {MAX_FILE_SIZE_MB}MB)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Step Map */}
      {step === 'map' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Map your CSV columns to {entityType === 'companies' ? 'company' : 'contact'} fields. Required fields are marked with *.
          </p>

          <div className="max-h-96 overflow-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-3 py-2 font-medium">CSV Column</th>
                  <th className="text-left px-3 py-2 font-medium">Maps To</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {headers.map((h) => {
                  const mapping = mappings.find((m) => m.source === h);
                  return (
                    <tr key={h} className="border-b">
                      <td className="px-3 py-2 font-mono text-xs">{h}</td>
                      <td className="px-3 py-2">
                        <select
                          value={mapping?.target || ''}
                          onChange={(e) => updateMapping(h, e.target.value)}
                          className="block w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="">-- Skip --</option>
                          {targetFields.map((tf) => (
                            <option key={tf} value={tf}>
                              {tf}
                              {entityType === 'companies' && tf === 'name' && ' *'}
                              {entityType === 'contacts' && (tf === 'firstName' || tf === 'email') && ' *'}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        {mapping && (
                          <button
                            type="button"
                            onClick={() => removeMapping(h)}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setStep('upload')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={proceedToPreview}
              className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step Preview */}
      {step === 'preview' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Preview the first 5 rows. {rows.length} total rows will be imported.
          </p>

          <div className="max-h-96 overflow-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {mappings.map((m) => (
                    <th key={m.target} className="text-left px-3 py-2 font-medium">
                      {m.target}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-b">
                    {mappings.map((m) => (
                      <td key={m.target} className="px-3 py-2">
                        {row[m.source] || <span className="text-gray-400">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setStep('map')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={startImport}
              disabled={processing}
              className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-60"
            >
              Start Import
            </button>
          </div>
        </div>
      )}

      {/* Step Process */}
      {step === 'process' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Importing {rows.length} rows…</p>
          <div className="w-full bg-gray-200 rounded-full h-6">
            <div
              className="bg-primary h-6 rounded-full flex items-center justify-center text-white text-xs font-medium transition-all"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        </div>
      )}

      {/* Step Summary */}
      {step === 'summary' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Import Complete</h3>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-2xl font-bold text-green-700">{created}</p>
              <p className="text-sm text-green-600">Created</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-2xl font-bold text-blue-700">{updated}</p>
              <p className="text-sm text-blue-600">Updated</p>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-2xl font-bold text-red-700">{failed}</p>
              <p className="text-sm text-red-600">Failed</p>
            </div>
          </div>

          {failed > 0 && (
            <button
              type="button"
              onClick={downloadErrorReport}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Download Error Report
            </button>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}