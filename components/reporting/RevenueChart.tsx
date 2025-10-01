'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { format } from 'date-fns';
import type { DailyRevenue } from '@/lib/mock-data';

Chart.register(...registerables);

interface RevenueChartProps {
  revenueHistory: DailyRevenue[];
}

export default function RevenueChart({ revenueHistory }: RevenueChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: revenueHistory.map(d => format(d.date, 'MM/dd')),
        datasets: [
          {
            label: 'Daily Revenue',
            data: revenueHistory.map(d => d.amount),
            borderColor: '#1E3A8A',
            backgroundColor: 'rgba(30, 58, 138, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `Revenue: $${context.parsed.y.toLocaleString()}`;
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
  }, [revenueHistory]);

  return (
    <div className="bg-neutral-white rounded-lg shadow-md border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
      <div style={{ height: '300px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}