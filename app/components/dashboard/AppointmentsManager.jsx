import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiUser, FiMail, FiMessageSquare, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function AppointmentsManager() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      toast.success('Statut mis à jour avec succès');
      fetchAppointments();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
    }
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <FiCalendar className="text-violet-500" />
        Gestion des Rendez-vous
      </h2>

      <div className="grid gap-6">
        {appointments.map((appointment) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiUser className="text-violet-500" />
                  <span className="font-medium">{appointment.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-pink-500" />
                  <span>{new Date(appointment.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="text-emerald-500" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMessageSquare className="text-amber-500" />
                  <span className="text-sm text-gray-400">{appointment.subject}</span>
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  {appointment.message}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className={`px-3 py-1 rounded-full text-xs ${
                  appointment.status === 'confirmé' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : appointment.status === 'annulé'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {appointment.status}
                </span>

                <div className="flex gap-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStatusChange(appointment.id, 'confirmé')}
                    className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                  >
                    <FiCheck />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStatusChange(appointment.id, 'annulé')}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    <FiX />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {appointments.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Aucun rendez-vous pour le moment
          </div>
        )}
      </div>
    </div>
  );
} 