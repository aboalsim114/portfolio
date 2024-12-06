import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiUser, FiMail, FiMessageSquare, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function AppointmentsManager() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 2;

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

  // Calcul pour la pagination
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
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
        {currentAppointments.map((appointment) => (
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
            </div>
          </motion.div>
        ))}

        {appointments.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Aucun rendez-vous pour le moment
          </div>
        )}
      </div>

      {/* Pagination */}
      {appointments.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-violet-500 hover:bg-violet-500/20'}`}
          >
            <FiChevronLeft size={20} />
          </motion.button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <motion.button
                key={number}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => paginate(number)}
                className={`w-8 h-8 rounded-lg ${
                  currentPage === number 
                    ? 'bg-violet-500 text-white' 
                    : 'text-violet-500 hover:bg-violet-500/20'
                }`}
              >
                {number}
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-violet-500 hover:bg-violet-500/20'}`}
          >
            <FiChevronRight size={20} />
          </motion.button>
        </div>
      )}
    </div>
  );
} 