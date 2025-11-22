// src/components/charts/StatusPieChart.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const StatusPieChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: '# of Jobs',
        data: Object.values(data),
        // Use our new accent colors
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',  // Blue (Applied)
          'rgba(245, 158, 11, 0.7)',  // Yellow (Interviewing)
          'rgba(52, 211, 153, 0.7)', // Green (Offer)
          'rgba(239, 68, 68, 0.7)',   // Red (Rejected)
        ],
        borderColor: [
          '#3B82F6',
          '#F59E0B',
          '#34D399',
          '#EF4444',
        ],
        borderWidth: 1,
      },
    ],
  };

  // --- NEW DARK THEME OPTIONS ---
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
 // Use theme text color
          font: {
            size: 14,
          }
        }
      },
      title: {
        display: true,
        text: 'Job Status Distribution',
        color: 'white',        // Use theme text color
        font: {
          size: 18,
          weight: '600',
        }
      },
      tooltip: {
        backgroundColor: 'var(--color-background)',
        titleColor: 'var(--color-text-primary)',
        bodyColor: 'var(--color-text-secondary)',
        borderColor: 'var(--color-border)',
        borderWidth: 1,
      }
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default StatusPieChart;