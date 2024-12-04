import { POST } from '@/app/api/booking/route';
import { zoomConfig } from '@/utils/zoom-config';

// Mock des dépendances externes
jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn().mockResolvedValue(true)
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      id: '123',
      join_url: 'https://zoom.us/j/123',
      start_url: 'https://zoom.us/s/123'
    })
  })
);

describe('API Booking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('devrait créer une réunion avec succès', async () => {
    const request = new Request('http://localhost:3000/api/booking', {
      method: 'POST',
      body: JSON.stringify({
        date: '2024-04-01',
        time: '10:00',
        email: 'test@example.com'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.meeting).toHaveProperty('id');
    expect(data.meeting).toHaveProperty('joinUrl');
  });

  test('devrait retourner une erreur si des champs sont manquants', async () => {
    const request = new Request('http://localhost:3000/api/booking', {
      method: 'POST',
      body: JSON.stringify({
        date: '2024-04-01'
        // time et email manquants
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
}); 