import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiUser, FiMessageSquare, FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function AppointmentsManager() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setAppointments(data.appointments);
    } catch (error) {
      toast.error('Erreur lors de la récupération des rendez-vous');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fonctions utilitaires pour le calendrier
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  // Navigation dans le calendrier
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Génération du calendrier
  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Ajouter les jours vides du début
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24" />);
    }

    // Ajouter les jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDateString = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
      const dayAppointments = appointments.filter(apt => formatDate(new Date(apt.date)) === currentDateString);

      days.push(
        <div 
          key={day} 
          className={`min-h-24 border border-white/5 p-2 relative group ${
            dayAppointments.length > 0 ? 'bg-violet-500/5' : ''
          }`}
        >
          <span className="text-sm text-gray-400">{day}</span>
          
          {dayAppointments.length > 0 && (
            <div className="mt-1 space-y-1">
              {dayAppointments.map((apt, index) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div 
                    className="bg-violet-500/10 rounded-md p-2 text-xs hover:bg-violet-500/20 cursor-pointer"
                    onClick={() => setSelectedAppointment(apt)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-violet-300">{apt.time}</span>
                      {apt.message && <FiMessageSquare size={10} className="text-violet-400" />}
                    </div>
                    <div className="truncate text-gray-300">{apt.subject}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête du calendrier */}
      <div className="flex items-center justify-between bg-[#1E2235] p-4 rounded-lg">
        <button onClick={previousMonth} className="p-2 hover:bg-white/5 rounded-lg">
          <FiChevronLeft className="text-violet-400" />
        </button>
        <h2 className="text-lg font-medium">
          {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-lg">
          <FiChevronRight className="text-violet-400" />
        </button>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-px bg-[#1E2235] p-2 rounded-lg">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
          <div key={day} className="text-center text-sm text-violet-400 font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-px bg-[#1E2235] p-2 rounded-lg relative">
        {generateCalendar()}

        {/* Modal intégré */}
        {selectedAppointment && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0d1224]/80 backdrop-blur-sm z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-[400px] bg-[#1E2235] rounded-xl shadow-xl m-4"
            >
              {/* En-tête */}
              <div className="p-4 border-b border-white/10 bg-violet-500/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-violet-500/20 rounded-lg p-2">
                      <div className="text-center">
                        <span className="text-xl font-bold text-white block">
                          {new Date(selectedAppointment.date).getDate()}
                        </span>
                        <span className="text-xs text-violet-300">
                          {new Date(selectedAppointment.date).toLocaleDateString('fr-FR', { month: 'short' })}
                        </span>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-violet-500/20">
                      <div className="flex items-center gap-2">
                        <FiClock size={12} className="text-violet-400" />
                        <span className="text-sm text-violet-300">{selectedAppointment.time}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedAppointment(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
                    </svg>
                  </button>
                </div>
                <h3 className="text-lg font-medium text-white">{selectedAppointment.subject}</h3>
              </div>

              {/* Corps */}
              <div className="p-4 space-y-4">
                {/* Email */}
                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                  <FiUser size={14} className="text-violet-400" />
                  <span className="text-sm text-gray-300">{selectedAppointment.email}</span>
                </div>

                {/* Message avec scroll */}
                {selectedAppointment.message && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FiMessageSquare size={14} className="text-violet-400" />
                      <span className="text-sm font-medium text-gray-300">Message</span>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap pr-2">
                        {selectedAppointment.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
} 