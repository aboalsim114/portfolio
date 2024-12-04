import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const { email } = await request.json();
    const verificationCode = generateVerificationCode();

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: {
        name: 'Sami Abdulhalim',
        address: process.env.EMAIL_ADDRESS
      },
      to: email,
      subject: 'Code de vérification pour votre rendez-vous',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Vérification de votre email</h2>
          <p>Voici votre code de vérification pour confirmer votre rendez-vous :</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center;">
            <h1 style="color: #16f2b3; font-size: 32px; letter-spacing: 5px;">${verificationCode}</h1>
          </div>
          <p>Ce code expirera dans 15 minutes.</p>
          <p>Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.</p>
        </div>
      `
    });

    return NextResponse.json({
      success: true,
      code: verificationCode
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi du code:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'envoi du code de vérification' },
      { status: 500 }
    );
  }
} 