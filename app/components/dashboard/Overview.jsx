'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { FiArrowUp, FiClock, FiCalendar } from 'react-icons/fi';

// Enregistrement des composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Ajouter ces constantes pour les graphiques
const chartGradient = {
  line: {
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderColor: '#7c3aed',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#7c3aed',
    pointHoverBackgroundColor: '#7c3aed',
    pointHoverBorderColor: '#fff'
  },
  bar: {
    colors: [
      'rgba(99, 102, 241, 0.8)',   // Indigo
      'rgba(168, 85, 247, 0.8)',   // Purple
      'rgba(236, 72, 153, 0.8)',   // Pink
      'rgba(59, 130, 246, 0.8)',   // Blue
      'rgba(16, 185, 129, 0.8)',   // Green
      'rgba(245, 158, 11, 0.8)'    // Yellow
    ]
  }
};

export default function Overview({ stats, recentActivities, upcomingAppointments }) {
  const [projectsData, setProjectsData] = useState({
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [{
      label: 'Projets',
      data: [0, 0, 0, 0, 0, 0],
      borderColor: chartGradient.line.borderColor,
      backgroundColor: chartGradient.line.backgroundColor,
      fill: true,
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: chartGradient.line.pointBackgroundColor,
      pointBorderColor: chartGradient.line.pointBorderColor,
      pointHoverBackgroundColor: chartGradient.line.pointHoverBackgroundColor,
      pointHoverBorderColor: chartGradient.line.pointHoverBorderColor,
      pointBorderWidth: 2
    }]
  });

  const [techStackData, setTechStackData] = useState({
    labels: ['React', 'Node.js', 'Next.js', 'TypeScript', 'TailwindCSS', 'MongoDB'],
    datasets: [{
      label: 'Technologies utilisées',
      data: [0, 0, 0, 0, 0, 0],
      backgroundColor: chartGradient.bar.colors,
      borderWidth: 0,
      borderRadius: 12,
      maxBarThickness: 40,
      minBarLength: 10
    }]
  });

  useEffect(() => {
    const fetchProjectsStats = async () => {
      try {
        const response = await fetch('/api/projects/stats');
        const data = await response.json();
        
        // Mise à jour des données du premier graphique
        setProjectsData(prev => ({
          ...prev,
          datasets: [{
            ...prev.datasets[0],
            data: data.monthlyProjects
          }]
        }));

        // Mise à jour des données pour le nouveau graphique
        setTechStackData(prev => ({
          ...prev,
          datasets: [{
            ...prev.datasets[0],
            data: [
              data.techStack.react || 0,
              data.techStack.nodejs || 0,
              data.techStack.nextjs || 0,
              data.techStack.typescript || 0,
              data.techStack.tailwind || 0,
              data.techStack.mongodb || 0
            ]
          }]
        }));
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    };

    fetchProjectsStats();
    const interval = setInterval(fetchProjectsStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Mise à jour de la configuration des graphiques
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderColor: 'rgba(124, 58, 237, 0.3)',
        borderWidth: 1,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: 'bold',
          family: 'monospace'
        },
        bodyFont: {
          size: 12,
          family: 'monospace'
        },
        callbacks: {
          title: function(context) {
            return `📅 ${context[0].label}`;
          },
          label: function(context) {
            return `📊 ${context.parsed.y} projets`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(124, 58, 237, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: 'monospace',
            size: 12
          },
          padding: 8,
          stepSize: 1
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: 'monospace',
            size: 12
          },
          padding: 8
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="space-y-8">
      {/* Section des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
            <div className="relative p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="text-white text-xl" />
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <FiArrowUp className="text-sm" />
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Section des graphiques avec design amélioré */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-fuchsia-600/10 to-transparent rounded-2xl" />
          <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-violet-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-mono bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Évolution des Projets
              </h3>
              <div className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-sm border border-violet-500/20">
                6 derniers mois
              </div>
            </div>
            <div className="h-[300px] relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-lg" />
              <Line data={projectsData} options={chartOptions} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/10 via-violet-600/10 to-transparent rounded-2xl" />
          <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-fuchsia-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-mono bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                Technologies Utilisées
              </h3>
              <div className="px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-400 text-sm border border-fuchsia-500/20">
                Top 6
              </div>
            </div>
            <div className="h-[300px] relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-lg" />
              <Bar 
                data={techStackData} 
                options={{
                  ...chartOptions,
                  indexAxis: 'y',
                  scales: {
                    ...chartOptions.scales,
                    x: {
                      ...chartOptions.scales.x,
                      grid: {
                        color: 'rgba(124, 58, 237, 0.1)',
                        drawBorder: false
                      }
                    },
                    y: {
                      ...chartOptions.scales.y,
                      grid: {
                        display: false
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Section des activités récentes et rendez-vous */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activités récentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-colors"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FiClock className="text-violet-500" />
            <span>Activités Récentes</span>
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
              >
                <div className="p-2 rounded-lg bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20">
                  <activity.icon className="text-violet-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium text-violet-400">{activity.user}</span>
                    {" "}{activity.action}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Prochains rendez-vous */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-colors"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FiCalendar className="text-violet-500" />
            <span>Prochains Rendez-vous</span>
          </h3>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 5 }}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-violet-400">
                    {appointment.client}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {appointment.date} à {appointment.time}
                  </p>
                  <p className="text-sm mt-1">{appointment.subject}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  appointment.status === 'confirmé' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {appointment.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 