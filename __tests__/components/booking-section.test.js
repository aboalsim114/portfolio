import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingSection from '@/app/components/homepage/booking';
import { AvailabilityService } from '@/utils/services/availability-service';
import { toast } from 'react-toastify';

// Mock des dépendances
jest.mock('react-toastify');
jest.mock('@/utils/services/availability-service');

describe('BookingSection', () => {
  beforeEach(() => {
    AvailabilityService.getAvailabilities.mockResolvedValue({
      timeSlots: ['9:00', '9:30', '10:00']
    });
  });

  test('devrait afficher le formulaire de réservation', () => {
    render(<BookingSection />);
    
    expect(screen.getByText('Prendre rendez-vous')).toBeInTheDocument();
    expect(screen.getByLabelText('Date du rendez-vous')).toBeInTheDocument();
    expect(screen.getByLabelText('Heure du rendez-vous')).toBeInTheDocument();
    expect(screen.getByLabelText('Votre email')).toBeInTheDocument();
  });

  test('devrait afficher une erreur si le formulaire est soumis sans données', async () => {
    render(<BookingSection />);
    
    const submitButton = screen.getByText('Demander un rendez-vous');
    fireEvent.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith('Veuillez sélectionner une date et une heure');
  });

  test('devrait soumettre le formulaire avec succès', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    );

    render(<BookingSection />);
    
    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText('Votre email'), {
      target: { value: 'test@example.com' }
    });
    
    // Simuler la sélection de date et d'heure
    // Note: La simulation exacte dépendra de l'implémentation de react-datepicker

    const submitButton = screen.getByText('Demander un rendez-vous');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Rendez-vous confirmé ! Vérifiez votre email pour les détails.'
      );
    });
  });
}); 