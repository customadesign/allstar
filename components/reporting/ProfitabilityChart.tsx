'use client';

import { useEffect, useRef, useMemo } from 'react';
import { Chart, registerables } from 'chart.js';
import type { Job } from '@/lib/mock-data';

Chart.register(...registerables);

interface ProfitabilityChartProps {
  jobs: Job[];
}

export default function ProfitabilityChart({ jobs }: ProfitabilityChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const profitabilityData = useMemo(() => {
    const typeValues: Record<string, number> = {};
    jobs.forEach(job => {
      if (job.value) {
        typeValues[job.type] = (typeValues[job.type] || 0) + job.value;
      }
    });

    const sorted = Object.entries(typeValues)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      labels: sorted.map(([type]) => type),
      values: sorted.map(([, value]) => value),
    };
  }, [jobs]);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: profitabilityData.labels,
        datasets: [
          {
            label: 'Total Value',
            data: profitabilityData.values,
            backgroundColor: '#1E3A8A',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `Value: $${context.parsed.y.toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `$${(value as number).toLocaleString()}`,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [profitabilityData]);

  return (
    <div className="bg-neutral-white rounded-lg shadow-md border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Value by Job Type</h2>
      <div style={{ height: '350px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}