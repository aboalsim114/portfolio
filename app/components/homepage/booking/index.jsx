"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaVideo } from 'react-icons/fa';
import { personalData } from '@/utils/data/personal-data';
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
          email: email
        })
      });

      const data = await response.json();
      
      if (data.success) {
        await AvailabilityService.blockTimeSlot(selectedDate, selectedTime);
        toast.success('Rendez-vous confirmé ! Vérifiez votre email pour les détails.');
        setSelectedDate(null);
        setSelectedTime('');
        setEmail('');
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
    <div id="booking" className="relative z-50 border-t my-12 lg:my-24 border-[#353951]">
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#16f2b3] to-transparent w-full" />
        </div>
      </div>

      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-4 bg-gradient-to-r from-[#1b2c68a0] to-[#10172d] px-8 py-4 rounded-xl border border-[#353a52]"
        >
          <FaVideo className="text-[#16f2b3] text-2xl" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#16f2b3] to-emerald-400 bg-clip-text text-transparent">
            Prendre rendez-vous
          </h2>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-white flex items-center gap-2">
                <FaCalendarAlt className="text-[#16f2b3]" />
                Date du rendez-vous
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                minDate={new Date()}
                className="w-full p-3 rounded-lg bg-[#10172d] border border-[#353a52] focus:border-[#16f2b3] text-white"
                placeholderText="Sélectionnez une date"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white flex items-center gap-2">
                <FaClock className="text-[#16f2b3]" />
                Heure du rendez-vous
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#10172d] border border-[#353a52] focus:border-[#16f2b3] text-white"
              >
                <option value="">Sélectionnez une heure</option>
                {availableTimeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-white flex items-center gap-2">
                <MdEmail className="text-[#16f2b3]" />
                Votre email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-[#10172d] border border-[#353a52] focus:border-[#16f2b3] text-white"
                placeholder="Entrez votre email"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Envoi en cours...</span>
            ) : (
              <>
                <span>Demander un rendez-vous</span>
                <FaVideo />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingSection; 