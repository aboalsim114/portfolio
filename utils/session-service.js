const sessions = new Map();
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

export class SessionService {
  static createSession(userId, userData) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session = {
      ...userData,
      expiresAt: Date.now() + SESSION_DURATION
    };
    
    sessions.set(sessionId, session);
    return sessionId;
  }

  static getSession(sessionId) {
    const session = sessions.get(sessionId);
    if (!session) return null;
    
    if (Date.now() > session.expiresAt) {
      sessions.delete(sessionId);
      return null;
    }
    
    return session;
  }

  static destroySession(sessionId) {
    sessions.delete(sessionId);
  }

  static refreshSession(sessionId) {
    const session = sessions.get(sessionId);
    if (session) {
      session.expiresAt = Date.now() + SESSION_DURATION;
      sessions.set(sessionId, session);
      return true;
    }
    return false;
  }
} 