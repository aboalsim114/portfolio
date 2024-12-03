import { adminData } from "@/utils/data/admin-data";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { loginLimiter } from "@/utils/rate-limiter";
import crypto from 'crypto';

// Fonction pour comparer les mots de passe de manière sécurisée
const secureCompare = (a, b) => {
  return crypto.timingSafeEqual(
    Buffer.from(a, 'utf8'),
    Buffer.from(b, 'utf8')
  );
};

export async function POST(request) {
  try {
    // Appliquer le rate limiting
    try {
      await loginLimiter(request);
    } catch (error) {
      return Response.json(
        { error: error.message },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    // Vérification des credentials avec comparaison sécurisée
    if (email !== adminData.email || !secureCompare(password, process.env.ADMIN_PASSWORD)) {
      // Log de la tentative échouée
      console.warn(`Tentative de connexion échouée pour l'email: ${email}`);
      
      return Response.json(
        { error: "Identifiants invalides" },
        { status: 401 }
      );
    }

    // Création du JWT avec plus d'informations
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ 
      email,
      role: 'admin',
      iat: Date.now() / 1000,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h")
      .setIssuedAt()
      .setNotBefore(Date.now() / 1000 - 10)
      .sign(secret);

    // Stockage du token avec options de sécurité renforcées
    cookies().set("admin_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7200,
      path: '/',
    });

    // Log de connexion réussie
    console.info(`Connexion admin réussie pour: ${email}`);

    return Response.json({ 
      success: true,
      expiresIn: 7200 
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { error: "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
} 