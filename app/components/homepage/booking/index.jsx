"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaVideo, FaCheck } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import { MdEmail } from 'react-icons/md';
import { AvailabilityService } from '@/utils/services/availability-service';

function BookingSection() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  useEffect(() => {
    async function fetchAvailabilities() {
      if (selectedDate) {
        const availability = await AvailabilityService.getAvailabilities(selectedDate);
        setAvailableTimeSlots(availability.timeSlots);
      }
    }
    fetchAvailabilities();
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      toast.error('Veuillez sélectionner une date et une heure');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
          email: email,
          subject: subject,
          message: message
        })
      });

      const data = await response.json();
      
      if (data.success) {
        await AvailabilityService.blockTimeSlot(selectedDate, selectedTime);
        toast.success('Rendez-vous confirmé ! Vérifiez votre email pour les détails.');
        setSelectedDate(null);
        setSelectedTime('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        throw new Error(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="booking" className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#0d1224]" />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-pink-500/10 animate-gradient" />
        <div className="absolute inset-0 backdrop-blur-[118px]" />
        
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.25
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 relative"
        >
          <span className="inline-block text-sm font-medium text-pink-500 mb-4 px-3 py-1 bg-pink-500/10 rounded-full">
            Disponible pour une alternance
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="inline-block bg-gradient-to-r from-pink-500 via-violet-500 to-[#16f2b3] bg-clip-text text-transparent">
              Planifiez votre
            </span>
            <br />
            <span className="inline-block text-white mt-2">
              Rendez-vous
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Discutons de vos projets et explorons ensemble les possibilités de collaboration pour créer quelque chose d'extraordinaire.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative"
        >
          <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500/20 via-violet-500/20 to-[#16f2b3]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div 
                    className="space-y-4 group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="block text-lg font-medium text-white/90">
                      <FaCalendarAlt className="inline-block mr-2 text-pink-500 group-hover:scale-110 transition-transform" />
                      Date
                    </label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={date => setSelectedDate(date)}
                      minDate={new Date()}
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-pink-500 text-white transition-all duration-300 hover:bg-white/10"
                      placeholderText="Sélectionnez une date"
                    />
                  </motion.div>

                  <motion.div 
                    className="space-y-4 group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="block text-lg font-medium text-white/90">
                      <FaClock className="inline-block mr-2 text-violet-500 group-hover:scale-110 transition-transform" />
                      Heure
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 text-white transition-all duration-300 hover:bg-white/10"
                    >
                      <option value="">Choisir un horaire</option>
                      {availableTimeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </motion.div>

                  <motion.div 
                    className="space-y-4 group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="block text-lg font-medium text-white/90">
                      <MdEmail className="inline-block mr-2 text-[#16f2b3] group-hover:scale-110 transition-transform" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#16f2b3] text-white transition-all duration-300 hover:bg-white/10"
                      placeholder="votre@email.com"
                    />
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <motion.div 
                    className="space-y-4 group"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="block text-lg font-medium text-white/90">
                      <span className="inline-block mr-2 text-pink-500 text-xl">✦</span>
                      Sujet de l'entretien
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-pink-500 text-white transition-all duration-300 hover:bg-white/10"
                      placeholder="Ex: Discussion sur une opportunité d'alternance"
                    />
                  </motion.div>

                  <motion.div 
                    className="space-y-4 group"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="block text-lg font-medium text-white/90">
                      <span className="inline-block mr-2 text-violet-500 text-xl">✦</span>
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={4}
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 text-white transition-all duration-300 hover:bg-white/10 resize-none"
                      placeholder="Décrivez brièvement l'objectif de notre entretien..."
                    />
                  </motion.div>
                </div>

                <div className="flex justify-center pt-8">
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="group relative overflow-hidden px-12 py-4 rounded-full bg-gradient-to-r from-pink-500 via-violet-500 to-[#16f2b3] text-white font-medium text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-500 via-violet-500 to-[#16f2b3] group-hover:translate-x-full transition-transform duration-500" />
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#16f2b3] via-violet-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative flex items-center gap-3">
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-4 border-white/60 border-t-white" />
                      ) : (
                        <>
                          <span>Réserver maintenant</span>
                          <FaVideo className="text-xl group-hover:rotate-12 transition-transform" />
                        </>
                      )}
                    </span>
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default BookingSection; 