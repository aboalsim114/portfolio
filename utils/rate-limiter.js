const rateLimit = new Map();

export const loginLimiter = async (request) => {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const max = 5; // 5 tentatives maximum

  const windowStart = now - windowMs;
  
  // Nettoyer les anciennes entrées
  rateLimit.forEach((value, key) => {
    if (value.timestamp < windowStart) {
      rateLimit.delete(key);
    }
  });

  const requestCount = rateLimit.get(ip);
  
  if (!requestCount) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return;
  }

  if (requestCount.timestamp < windowStart) {
    // Réinitialiser si la fenêtre est expirée
    rateLimit.set(ip, { count: 1, timestamp: now });
    return;
  }

  if (requestCount.count >= max) {
    throw new Error("Trop de tentatives de connexion. Réessayez dans 15 minutes.");
  }

  // Incrémenter le compteur
  rateLimit.set(ip, {
    count: requestCount.count + 1,
    timestamp: requestCount.timestamp
  });
}; 