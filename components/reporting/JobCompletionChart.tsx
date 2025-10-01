'use client';

import { useEffect, useRef, useMemo } from 'react';
import { Chart, registerables } from 'chart.js';
import type { Job } from '@/lib/mock-data';

Chart.register(...registerables);

interface JobCompletionChartProps {
  jobs: Job[];
}

export default function JobCompletionChart({ jobs }: JobCompletionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const statusCounts = useMemo(() => {
    const counts = { active: 0, pending: 0, alert: 0 };
    jobs.forEach(job => {
      counts[job.status]++;
    });
    return counts;
  }, [jobs]);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Pending', 'Alert'],
        datasets: [
          {
            data: [statusCounts.active, statusCounts.pending, statusCounts.alert],
            backgroundColor: ['#10B981', '#6B7280', '#EF4444'],
            borderWidth: 2,
            borderColor: '#ffffff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0) as number;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              },
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
  }, [statusCounts]);

  return (
    <div className="bg-neutral-white rounded-lg shadow-md border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Status Distribution</h2>
      <div style={{ height: '300px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}