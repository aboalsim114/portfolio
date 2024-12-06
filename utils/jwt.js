import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function createToken(user) {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin 
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
} 