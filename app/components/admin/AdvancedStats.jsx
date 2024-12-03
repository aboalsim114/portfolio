"use client";

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdvancedStats({ stats }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    // Simuler des données historiques (à remplacer par de vraies données)
    const labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    setChartData({
      labels,
      datasets: [
        {
          label: 'Visites',
          data: [300, 450, 600, 550, 750, 850],
          borderColor: 'rgb(219, 39, 119)',
          tension: 0.3
        },
        {
          label: 'Interactions',
          data: [100, 200, 250, 300, 280, 400],
          borderColor: 'rgb(139, 92, 246)',
          tension: 0.3
        }
      ]
    });
  }, []);

  return (
    <div className="bg-[#1a1443] p-6 rounded-xl mt-6">
      <h3 className="text-xl font-bold mb-4">Statistiques Avancées</h3>
      <div className="h-[300px]">
        <Line 
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.8)'
                }
              },
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.8)'
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: 'rgba(255, 255, 255, 0.8)'
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
} 