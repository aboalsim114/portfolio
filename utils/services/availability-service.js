import { Availability } from '../models/availability';

const STORAGE_KEY = 'availabilities';

export class AvailabilityService {
  static async getAvailabilities(date) {
    try {
      // Dans un environnement de production, ceci serait une requête à une base de données
      const stored = localStorage.getItem(STORAGE_KEY);
      const availabilities = stored ? JSON.parse(stored) : {};
      
      const dateKey = date.toISOString().split('T')[0];
      if (!availabilities[dateKey]) {
        // Générer les créneaux par défaut pour cette date
        availabilities[dateKey] = new Availability(date, this.generateDefaultTimeSlots()).toJSON();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(availabilities));
      }
      
      return Availability.fromJSON(availabilities[dateKey]);
    } catch (error) {
      console.error('Error fetching availabilities:', error);
      return new Availability(date, []);
    }
  }

  static async blockTimeSlot(date, time) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const availabilities = stored ? JSON.parse(stored) : {};
      
      const dateKey = date.toISOString().split('T')[0];
      if (availabilities[dateKey]) {
        availabilities[dateKey].timeSlots = availabilities[dateKey].timeSlots
          .filter(slot => slot !== time);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(availabilities));
      }
    } catch (error) {
      console.error('Error blocking time slot:', error);
      throw new Error('Impossible de bloquer ce créneau');
    }
  }

  static generateDefaultTimeSlots() {
    // Générer les créneaux de 9h à 17h30
    return Array.from({ length: 17 }, (_, i) => {
      const hour = 9 + Math.floor(i / 2);
      const minute = i % 2 === 0 ? '00' : '30';
      return `${hour}:${minute}`;
    });
  }
} 