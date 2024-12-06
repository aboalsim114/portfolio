import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SessionService } from '@/utils/session-service';

export async function POST() {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get('session_id')?.value;

    if (sessionId) {
      SessionService.destroySession(sessionId);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Déconnexion réussie'
    });

    response.cookies.delete('admin_token');
    response.cookies.delete('session_id');

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la déconnexion' },
      { status: 500 }
    );
  }
} 