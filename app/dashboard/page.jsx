'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiUsers, FiMail, FiLogOut, FiBriefcase, FiFileText, FiActivity, FiClock, FiGithub, FiArrowUp, FiEye, FiStar, FiMessageCircle, FiCalendar, FiSettings } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ProjectsManager from '../components/dashboard/ProjectsManager';
import AppointmentsManager from '../components/dashboard/AppointmentsManager';
import { useRouter } from 'next/navigation';
import Overview from '../components/dashboard/Overview';
import SettingsManager from '../components/dashboard/SettingsManager';

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    projects: 0,
    appointments: 0,
    visits: 0,
    conversations: 0
  });

  const fetchDashboardStats = async () => {
    try {
      const [projectsResponse, appointmentsResponse] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/appointments')
      ]);

      const projectsData = await projectsResponse.json();
      const appointmentsData = await appointmentsResponse.json();
      
      const nextAppointments = appointmentsData.appointments
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 2)
        .map(apt => ({
          client: apt.client,
          date: new Date(apt.date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          time: apt.time,
          subject: apt.subject,
          status: apt.status
        }));

      setUpcomingAppointments(nextAppointments);
      
      setDashboardStats(prev => ({
        ...prev,
        projects: Array.isArray(projectsData) ? projectsData.length : 0,
        appointments: appointmentsData.appointments.length,
        visits: 2400,
        conversations: 156
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      toast.error('Erreur lors de la récupération des statistiques');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check-session');
        const data = await response.json();

        if (!response.ok || !data.isAuthenticated) {
          toast.error('Session expirée ou invalide');
          router.replace('/dashboard/login');
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erreur de vérification:', error);
        toast.error('Erreur de vérification de session');
        router.replace('/dashboard/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

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
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { icon: FiHome, label: 'Vue Générale', id: 'home' },
    { icon: FiBriefcase, label: 'Projets', id: 'projects' },
    { icon: FiMail, label: 'Rendez-vous', id: 'appointments' },
    { icon: FiFileText, label: 'Blog', id: 'blog' },
    { icon: FiUsers, label: 'Chatbot', id: 'chatbot' },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: FiSettings
    }
  ];

  const stats = [
    { 
      icon: FiBriefcase, 
      label: 'Projets', 
      value: dashboardStats.projects.toString(), 
     
      color: 'from-violet-600 to-fuchsia-600' 
    },
    { 
      icon: FiMail, 
      label: 'Rendez-vous', 
      value: dashboardStats.appointments.toString(), 
      
      color: 'from-blue-600 to-cyan-600' 
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
          {activeTab === 'home' && (
            <Overview 
              stats={stats} 
              recentActivities={recentActivities}
              upcomingAppointments={upcomingAppointments}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsManager />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsManager />
          )}

          {activeTab === 'settings' && (
            <SettingsManager />
          )}
        </div>
      </div>
    </div>
  );
} 