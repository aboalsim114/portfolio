'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaSignOutAlt, FaBell, FaCog, FaChartLine, FaUsers, FaCalendar } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        console.error('Erreur de vérification de session:', error);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1224]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const stats = [
    { icon: FaChartLine, label: "Revenus", value: "12,350 €", change: "+15%" },
    { icon: FaUsers, label: "Utilisateurs", value: "1,234", change: "+7.8%" },
    { icon: FaCalendar, label: "Événements", value: "42", change: "+24%" },
  ];

  return (
    <div className="min-h-screen bg-[#0d1224]">
      {/* Barre latérale */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white/5 backdrop-blur-xl border-r border-white/10">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>
        <nav className="mt-6 px-4">
          {['Vue générale', 'Projets', 'Équipe', 'Calendrier', 'Documents', 'Rapports'].map((item) => (
            <a
              key={item}
              href="#"
              className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
      </div>

      {/* Contenu principal */}
      <div className="ml-64">
        {/* En-tête */}
        <header className="bg-white/5 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-8 py-4">
            <h2 className="text-xl font-semibold text-white">Vue générale</h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <FaBell size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <FaCog size={20} />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <FaSignOutAlt size={20} />
              </button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-violet-500 to-pink-500" />
            </div>
          </div>
        </header>

        {/* Contenu */}
        <main className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                    <span className="text-green-400 text-sm">{stat.change}</span>
                  </div>
                  <div className="bg-gradient-to-r from-violet-500 to-pink-500 p-3 rounded-lg">
                    <stat.icon className="text-white" size={24} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Graphique ou tableau */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Activité récente</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-white/5">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center">
                      <FaUser className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-white">Action {i}</p>
                      <p className="text-sm text-gray-400">Il y a {i} heure{i > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <span className="text-gray-400">Détails</span>
                </div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
} 