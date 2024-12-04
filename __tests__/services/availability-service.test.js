import { AvailabilityService } from '@/utils/services/availability-service';
import { Availability } from '@/utils/models/availability';

describe('AvailabilityService', () => {
  beforeEach(() => {
    // Nettoyer localStorage avant chaque test
    localStorage.clear();
  });

  test('generateDefaultTimeSlots devrait générer les bons créneaux horaires', () => {
    const slots = AvailabilityService.generateDefaultTimeSlots();
    expect(slots).toHaveLength(17);
    expect(slots[0]).toBe('9:00');
    expect(slots[slots.length - 1]).toBe('17:00');
  });

  test('getAvailabilities devrait retourner les créneaux par défaut pour une nouvelle date', async () => {
    const testDate = new Date('2024-04-01');
    const availability = await AvailabilityService.getAvailabilities(testDate);
    
    expect(availability).toBeInstanceOf(Availability);
    expect(availability.timeSlots).toHaveLength(17);
  });

  test('blockTimeSlot devrait supprimer un créneau horaire', async () => {
    const testDate = new Date('2024-04-01');
    const timeSlot = '10:00';

    // D'abord, obtenir les créneaux disponibles
    await AvailabilityService.getAvailabilities(testDate);
    
    // Bloquer un créneau
    await AvailabilityService.blockTimeSlot(testDate, timeSlot);
    
    // Vérifier que le créneau est bloqué
    const updatedAvailability = await AvailabilityService.getAvailabilities(testDate);
    expect(updatedAvailability.timeSlots).not.toContain(timeSlot);
  });
}); 