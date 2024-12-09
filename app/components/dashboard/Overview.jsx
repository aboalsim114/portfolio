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
import { FiArrowUp, FiClock, FiCalendar, FiTrendingUp, FiUsers, FiZap } from 'react-icons/fi';

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

// Mise à jour des constantes pour les graphiques
const chartGradient = {
  line: {
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
    borderColor: '#7c3aed',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#7c3aed',
    pointHoverBackgroundColor: '#7c3aed',
    pointHoverBorderColor: '#fff',
    shadowColor: 'rgba(124, 58, 237, 0.5)'
  },
  bar: {
    colors: [
      'rgba(139, 92, 246, 0.8)',  // Violet
      'rgba(236, 72, 153, 0.8)',  // Rose
      'rgba(59, 130, 246, 0.8)',  // Bleu
      'rgba(16, 185, 129, 0.8)',  // Vert
      'rgba(245, 158, 11, 0.8)',  // Orange
      'rgba(99, 102, 241, 0.8)'   // Indigo
    ],
    hoverColors: [
      'rgba(139, 92, 246, 1)',
      'rgba(236, 72, 153, 1)',
      'rgba(59, 130, 246, 1)',
      'rgba(16, 185, 129, 1)',
      'rgba(245, 158, 11, 1)',
      'rgba(99, 102, 241, 1)'
    ]
  },
  appointments: {
    backgroundColor: 'rgba(236, 72, 153, 0.05)', // Rose
    borderColor: '#ec4899',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#ec4899',
    pointHoverBackgroundColor: '#ec4899',
    pointHoverBorderColor: '#fff',
    shadowColor: 'rgba(236, 72, 153, 0.5)'
  }
};

// Mise à jour des constantes de style
const CHART_STYLES = {
  projects: {
    gradient: {
      start: '#4f46e5', // Indigo
      mid: '#7c3aed',   // Violet
      end: '#8b5cf6'    // Purple
    },
    shadow: 'rgba(124, 58, 237, 0.5)',
    border: '#7c3aed'
  },
  appointments: {
    gradient: {
      start: '#ec4899', // Pink
      mid: '#db2777',   // Rose
      end: '#be185d'    // Deep Rose
    },
    shadow: 'rgba(236, 72, 153, 0.5)',
    border: '#ec4899'
  }
};

// Ajout de nouveaux effets visuels
const NEON_EFFECTS = {
  glow: {
    primary: "0 0 20px rgba(22, 242, 179, 0.3), 0 0 40px rgba(22, 242, 179, 0.1)",
    secondary: "0 0 20px rgba(236, 72, 153, 0.3), 0 0 40px rgba(236, 72, 153, 0.1)"
  },
  gradient: {
    primary: "from-[#16f2b3] via-[#9333ea] to-[#16f2b3]",
    secondary: "from-[#ec4899] via-[#9333ea] to-[#ec4899]"
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
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: chartGradient.line.pointBackgroundColor,
      pointBorderColor: chartGradient.line.pointBorderColor,
      pointHoverBackgroundColor: chartGradient.line.pointHoverBackgroundColor,
      pointHoverBorderColor: chartGradient.line.pointHoverBorderColor,
      pointBorderWidth: 2,
      pointShadowBlur: 10,
      pointShadowColor: chartGradient.line.shadowColor
    }]
  });

  const [appointmentsData, setAppointmentsData] = useState({
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [{
      label: 'Rendez-vous',
      data: [0, 0, 0, 0, 0, 0, 0],
      borderColor: chartGradient.appointments.borderColor,
      backgroundColor: chartGradient.appointments.backgroundColor,
      fill: true,
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: chartGradient.appointments.pointBackgroundColor,
      pointBorderColor: chartGradient.appointments.pointBorderColor,
      pointHoverBackgroundColor: chartGradient.appointments.pointHoverBackgroundColor,
      pointHoverBorderColor: chartGradient.appointments.pointHoverBorderColor,
      pointBorderWidth: 2,
      pointShadowBlur: 10,
      pointShadowColor: chartGradient.appointments.shadowColor
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
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    };

    fetchProjectsStats();
    const interval = setInterval(fetchProjectsStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAppointmentsStats = async () => {
      try {
        const response = await fetch('/api/appointments/stats');
        const data = await response.json();
        
        setAppointmentsData(prev => ({
          ...prev,
          datasets: [{
            ...prev.datasets[0],
            data: data.weeklyAppointments || [0, 0, 0, 0, 0, 0, 0]
          }]
        }));
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques des rendez-vous:', error);
      }
    };

    fetchAppointmentsStats();
    const interval = setInterval(fetchAppointmentsStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Mise à jour des options des graphiques
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: {
          top: 12,
          right: 18,
          bottom: 12,
          left: 18
        },
        titleSpacing: 8,
        bodySpacing: 6,
        boxPadding: 6,
        cornerRadius: 8,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        caretSize: 6,
        caretPadding: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return `📊 ${context[0].label}`;
          },
          label: function(context) {
            return `📊 ${context.parsed.y} projets`;
          }
        },
        animation: {
          duration: 200
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(124, 58, 237, 0.1)',
          drawBorder: false,
          lineWidth: 1
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: 'monospace',
            size: 12
          },
          padding: 10,
          stepSize: 1,
          callback: function(value) {
            return value.toFixed(0);
          }
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
          padding: 10
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'nearest',
      axis: 'x'
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart',
      delay: (context) => context.dataIndex * 100
    },
    transitions: {
      active: {
        animation: {
          duration: 200
        }
      }
    },
    elements: {
      line: {
        borderJoinStyle: 'round',
        borderCapStyle: 'round',
        tension: 0.4
      },
      point: {
        hitRadius: 10,
        hoverRadius: 8,
        radius: 6
      }
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
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#16f2b3]/10 via-[#9333ea]/10 to-[#16f2b3]/10 rounded-2xl" />
            <div className="relative p-6 bg-[#0f172a]/90 backdrop-blur-xl rounded-2xl border border-[#16f2b3]/20">
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg hover:shadow-[#16f2b3]/20`}
                >
                  <stat.icon className="text-white text-xl" />
                </motion.div>
                <motion.div
                  animate={{ 
                    y: [0, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="flex items-center gap-1 text-[#16f2b3]"
                >
                  <FiArrowUp className="text-sm" />
                  <span className="text-sm font-mono">{stat.change}</span>
                </motion.div>
              </div>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-gray-400 text-sm font-mono uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-3xl font-bold font-mono bg-gradient-to-r from-[#16f2b3] via-[#9333ea] to-[#16f2b3] bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Section des graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(22,242,179,0.1),transparent_70%)] rounded-2xl" />
          <div className="relative bg-[#0f172a]/90 backdrop-blur-xl rounded-2xl border border-[#16f2b3]/20 p-6 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(22,242,179,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(22,242,179,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20"
                  >
                    <FiTrendingUp className="text-violet-400 text-xl" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold font-mono bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                      Évolution des Projets
                    </h3>
                    <p className="text-xs text-violet-400/80 font-mono mt-1">
                      Progression sur les 6 derniers mois
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20"
                >
                  <div className="flex items-center gap-2">
                    <FiZap className="text-violet-400" />
                    <span className="text-sm text-violet-400 font-mono">6M</span>
                  </div>
                </motion.div>
              </div>
              <div className="h-[300px] relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent pointer-events-none z-10" />
                <Line data={projectsData} options={chartOptions} />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1),transparent_70%)] rounded-2xl" />
          <div className="relative bg-[#0f172a]/90 backdrop-blur-xl rounded-2xl border border-pink-500/20 p-6 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(236,72,153,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="p-2 rounded-lg bg-gradient-to-br from-pink-500/20 via-rose-500/20 to-red-500/20"
                  >
                    <FiUsers className="text-pink-400 text-xl" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold font-mono bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text text-transparent">
                      Rendez-vous Hebdomadaires
                    </h3>
                    <p className="text-xs text-pink-400/80 font-mono mt-1">
                      Vue de la semaine en cours
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20"
                >
                  <div className="flex items-center gap-2">
                    <FiZap className="text-pink-400" />
                    <span className="text-sm text-pink-400 font-mono">7J</span>
                  </div>
                </motion.div>
              </div>
              <div className="h-[300px] relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent pointer-events-none z-10" />
                <Line data={appointmentsData} options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    tooltip: {
                      ...chartOptions.plugins.tooltip,
                      callbacks: {
                        title: (context) => `📅 ${context[0].label}`,
                        label: (context) => `👥 ${context.parsed.y} rendez-vous`
                      }
                    }
                  }
                }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Section des activités et rendez-vous */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_70%)] rounded-2xl" />
          <div className="relative bg-[#0f172a]/90 backdrop-blur-xl rounded-2xl border border-violet-500/20 p-6 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20"
                  >
                    <FiClock className="text-violet-400 text-xl" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold font-mono bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                      Activités Récentes
                    </h3>
                    <p className="text-xs text-violet-400/80 font-mono mt-1">
                      Dernières actions effectuées
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20"
                >
                  <div className="flex items-center gap-2">
                    <FiZap className="text-violet-400" />
                    <span className="text-sm text-violet-400 font-mono">LIVE</span>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 5, backgroundColor: 'rgba(22, 242, 179, 0.03)' }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-[#16f2b3]/20 transition-all duration-300 relative group"
                  >
                    {/* Effet de brillance au survol */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#16f2b3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20"
                    >
                      <activity.icon className="text-violet-400" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-sm font-mono">
                        <span className="font-medium bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                          {activity.user}
                        </span>
                        <span className="text-gray-300"> {activity.action}</span>
                      </p>
                      <p className="text-xs text-violet-400/60 mt-1 font-mono">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1),transparent_70%)] rounded-2xl" />
          <div className="relative bg-[#0f172a]/90 backdrop-blur-xl rounded-2xl border border-pink-500/20 p-6 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(236,72,153,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="p-2 rounded-lg bg-gradient-to-br from-pink-500/20 via-rose-500/20 to-red-500/20"
                  >
                    <FiCalendar className="text-pink-400 text-xl" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold font-mono bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text text-transparent">
                      Prochains Rendez-vous
                    </h3>
                    <p className="text-xs text-pink-400/80 font-mono mt-1">
                      Consultations à venir
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20"
                >
                  <div className="flex items-center gap-2">
                    <FiZap className="text-pink-400" />
                    <span className="text-sm text-pink-400 font-mono">NEXT</span>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-4">
                {upcomingAppointments.map((appointment, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 5, backgroundColor: 'rgba(236, 72, 153, 0.05)' }}
                    className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-pink-500/20 transition-all duration-300"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-mono font-medium bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                        {appointment.client}
                      </p>
                      <p className="text-xs text-pink-400/60 mt-1 font-mono">
                        {appointment.date} à {appointment.time}
                      </p>
                      <p className="text-sm mt-1 text-gray-300 font-mono">{appointment.subject}</p>
                    </div>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className={`px-3 py-1 rounded-full text-xs font-mono ${
                        appointment.status === 'confirmé' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {appointment.status}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 