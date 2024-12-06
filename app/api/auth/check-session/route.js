import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
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

    return NextResponse.json(
      { 
        isAuthenticated: true, 
        user: { 
          email: decoded.email
        } 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur de vérification de session:', error);
    return NextResponse.json(
      { isAuthenticated: false },
      { status: 401 }
    );
  }
} 