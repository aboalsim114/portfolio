import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function createToken(payload) {
  console.log('Création du token avec payload:', payload);
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token) {
  try {
    console.log('Vérification du token:', token);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token décodé:', decoded);
    return decoded;
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    return null;
  }
} 