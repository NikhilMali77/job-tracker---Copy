// src/components/charts/MonthlyBarChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyBarChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Applications per Month',
        data: data.map(item => item.count),
        backgroundColor: 'rgba(138, 99, 210, 0.7)', // Faded Violet
        borderColor: 'var(--color-primary)',     // Solid Violet
        borderWidth: 1,
        borderRadius: 4,
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
          font: { size: 14 }
        }
      },
      title: {
        display: true,
        text: 'Monthly Applications',
        color: 'white',
        font: {
          size: 18,
          weight: '600'
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
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
          stepSize: 1,
          color: 'white',
 // Axis labels
        },
        grid: {
          color: 'var(--color-border)', // Grid lines
        }
      },
      x: {
        ticks: {
          color: 'white',
 // Axis labels
        },
        grid: {
          color: 'transparent', // Hide vertical grid lines
        }
      }
    }
  };

  return <Bar options={options} data={chartData} />;
};

export default MonthlyBarChart;