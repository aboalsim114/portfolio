import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';
import { cookies } from 'next/headers';
import { SessionService } from '@/utils/session-service';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;
    const sessionId = cookieStore.get('session_id')?.value;

    if (!token || !sessionId) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 401 }
      );
    }

    const session = SessionService.getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 401 }
      );
    }

    SessionService.refreshSession(sessionId);

    return NextResponse.json(
      { 
        isAuthenticated: true, 
        user: { 
          email: decoded.email,
          lastActivity: session.lastActivity 
        } 
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { isAuthenticated: false },
      { status: 401 }
    );
  }
} 