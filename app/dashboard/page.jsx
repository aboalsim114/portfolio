'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiUsers, FiMail, FiLogOut, FiBriefcase, FiFileText, FiActivity, FiClock, FiGithub, FiArrowUp, FiEye, FiStar, FiMessageCircle, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/check-session');
        const data = await response.json();
        if (!data.isAuthenticated) {
          window.location.href = '/dashboard/login';
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        window.location.href = '/dashboard/login';
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Déconnexion réussie');
      window.location.href = '/dashboard/login';
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const menuItems = [
    { icon: FiHome, label: 'Vue Générale', id: 'home' },
    { icon: FiBriefcase, label: 'Projets', id: 'projects' },
    { icon: FiMail, label: 'Rendez-vous', id: 'appointments' },
    { icon: FiFileText, label: 'Blog', id: 'blog' },
    { icon: FiUsers, label: 'Chatbot', id: 'chatbot' },
  ];

  const stats = [
    { 
      icon: FiBriefcase, 
      label: 'Projets', 
      value: '12', 
      change: '+3 ce mois', 
      color: 'from-violet-600 to-fuchsia-600' 
    },
    { 
      icon: FiMail, 
      label: 'Rendez-vous', 
      value: '8', 
      change: '3 à venir', 
      color: 'from-blue-600 to-cyan-600' 
    },
    { 
      icon: FiEye, 
      label: 'Visites', 
      value: '2.4k', 
      change: '+18%', 
      color: 'from-emerald-600 to-teal-600' 
    },
    { 
      icon: FiMessageCircle, 
      label: 'Conversations', 
      value: '156', 
      change: '+12 /jour', 
      color: 'from-amber-600 to-orange-600' 
    },
  ];

  const recentActivities = [
    { 
      user: "Projet", 
      action: "Nouveau projet ajouté : Application Mobile React Native", 
      time: "Il y a 2h", 
      icon: FiBriefcase 
    },
    { 
      user: "Rendez-vous", 
      action: "Consultation programmée avec Client A", 
      time: "Il y a 3h", 
      icon: FiMail 
    },
    { 
      user: "Blog", 
      action: "Nouvel article : Les avantages de Next.js", 
      time: "Il y a 5h", 
      icon: FiFileText 
    },
    { 
      user: "Chatbot", 
      action: "15 nouvelles conversations", 
      time: "Il y a 1j", 
      icon: FiMessageCircle 
    },
  ];

  const upcomingAppointments = [
    {
      client: "Jean Dupont",
      date: "23 Avril 2024",
      time: "14:00",
      subject: "Consultation Web",
      status: "confirmé"
    },
    {
      client: "Marie Martin",
      date: "24 Avril 2024",
      time: "15:30",
      subject: "Projet Mobile",
      status: "en attente"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 p-4 md:p-8 relative overflow-hidden">
      {/* Effets de fond */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* En-tête avec effet glassmorphism */}
        <div className="mb-8 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 p-[2px]"
              >
                <div className="w-full h-full rounded-xl bg-[#0f172a] flex items-center justify-center">
                  <FiActivity className="text-2xl text-transparent bg-clip-text bg-gradient-to-br from-violet-600 to-fuchsia-600" />
                </div>
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                  Portfolio Admin
                </h1>
                <p className="text-gray-400">Tableau de bord</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.a
                href="https://github.com/aboalsim114"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
              >
                <FiGithub className="text-xl" />
                <span className="hidden md:block">GitHub</span>
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 transition-all"
              >
                <FiLogOut className="text-xl" />
                <span className="hidden md:block">Déconnexion</span>
              </motion.button>
            </div>
          </div>

          {/* Navigation améliorée */}
          <nav className="mt-6 flex flex-wrap gap-2">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all
                  ${activeTab === item.id 
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'}`}
              >
                <item.icon className="text-lg" />
                <span>{item.label}</span>
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Contenu principal */}
        <div className="space-y-8">
          {/* Statistiques */}
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

          {/* Grid 2 colonnes */}
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
      </div>
    </div>
  );
} 