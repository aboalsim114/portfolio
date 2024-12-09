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

export default function Overview({ stats, recentActivities, upcomingAppointments }) {
  const [projectsData, setProjectsData] = useState({
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [{
      label: 'Projets',
      data: [0, 0, 0, 0, 0, 0],
      borderColor: 'rgb(124, 58, 237)',
      backgroundColor: 'rgba(124, 58, 237, 0.1)',
      fill: true,
      tension: 0.4
    }]
  });

  const [techStackData, setTechStackData] = useState({
    labels: ['React', 'Node.js', 'Next.js', 'TypeScript', 'TailwindCSS', 'MongoDB'],
    datasets: [{
      label: 'Technologies utilisées',
      data: [0, 0, 0, 0, 0, 0],
      backgroundColor: [
        'rgba(97, 218, 251, 0.8)',    // React - bleu clair
        'rgba(104, 160, 99, 0.8)',    // Node.js - vert
        'rgba(0, 0, 0, 0.8)',         // Next.js - noir
        'rgba(49, 120, 198, 0.8)',    // TypeScript - bleu
        'rgba(56, 189, 248, 0.8)',    // TailwindCSS - bleu ciel
        'rgba(0, 237, 100, 0.8)'      // MongoDB - vert
      ],
      borderWidth: 0,
      borderRadius: 8
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
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

      {/* Section des graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique d'évolution des projets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-colors"
        >
          <h3 className="text-xl font-bold mb-6">Évolution des Projets</h3>
          <div className="h-[300px]">
            <Line data={projectsData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Nouveau graphique des technologies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-colors"
        >
          <h3 className="text-xl font-bold mb-6">Technologies Utilisées</h3>
          <div className="h-[300px]">
            <Bar 
              data={techStackData} 
              options={{
                ...chartOptions,
                indexAxis: 'y',
                plugins: {
                  ...chartOptions.plugins,
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.parsed.x} projets`;
                      }
                    }
                  }
                }
              }} 
            />
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