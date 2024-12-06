import { NextResponse } from 'next/server';
import { zoomConfig } from '@/utils/zoom-config';
import nodemailer from 'nodemailer';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { date, time, email, subject, message } = await request.json();
    console.log('Données reçues:', { date, time, email, subject, message });

    if (!date || !time || !email) {
      return NextResponse.json(
        { success: false, error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Vérification des credentials email
    if (!process.env.EMAIL_ADDRESS || !process.env.EMAIL_APP_PASSWORD) {
      throw new Error('Configuration email manquante');
    }

    // Création du transporteur avec configuration sécurisée
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // utilise SSL
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_APP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Vérification de la connexion SMTP
    try {
      await transporter.verify();
      console.log('Connexion SMTP vérifiée avec succès');
    } catch (error) {
      console.error('Erreur de connexion SMTP:', error);
      throw new Error('Erreur de configuration email');
    }

    const meetingTime = new Date(`${date}T${time}`);
    
    // Obtenir le token Zoom
    const token = await getZoomToken();
    
    // Créer la réunion Zoom
    const zoomRequestBody = {
      topic: "Entretien avec Sami Abdulhalim",
      type: 2,
      start_time: meetingTime.toISOString(),
      duration: 30,
      timezone: "Europe/Paris",
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: false,
        waiting_room: true
      }
    };

    const zoomResponse = await fetch(`https://api.zoom.us/v2/users/${zoomConfig.userId}/meetings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(zoomRequestBody)
    });

    const meeting = await zoomResponse.json();

    // Envoi des emails avec gestion d'erreur explicite
    try {
      await transporter.sendMail({
        from: {
          name: 'Sami Abdulhalim',
          address: process.env.EMAIL_ADDRESS
        },
        to: email,
        subject: `Confirmation de rendez-vous : ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Confirmation de rendez-vous</h2>
            <p>Bonjour,</p>
            <p>Votre rendez-vous avec Sami Abdulhalim est confirmé pour le 
              <strong>${meetingTime.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</strong> 
              à <strong>${time}</strong>.
            </p>
            <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #333;">Détails de l'entretien</h3>
              <p><strong>Sujet :</strong> ${subject}</p>
              <p><strong>Votre message :</strong><br>${message}</p>
            </div>
            <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
              <p style="margin: 0;">Pour rejoindre la réunion, cliquez sur ce lien :</p>
              <a href="${meeting.join_url}" 
                 style="display: inline-block; margin-top: 10px; padding: 10px 20px; 
                        background-color: #2D8CFF; color: white; text-decoration: none; 
                        border-radius: 5px;">
                Rejoindre la réunion Zoom
              </a>
            </div>
            <p>À bientôt !</p>
            <p><strong>Sami Abdulhalim</strong></p>
          </div>
        `
      });

      await transporter.sendMail({
        from: {
          name: 'Système de Réservation',
          address: process.env.EMAIL_ADDRESS
        },
        to: process.env.EMAIL_ADDRESS,
        subject: `Nouveau rendez-vous : ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Nouveau rendez-vous</h2>
            <p>Un nouveau rendez-vous a été programmé :</p>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Date :</strong> ${meetingTime.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</li>
              <li><strong>Heure :</strong> ${time}</li>
              <li><strong>Email du participant :</strong> ${email}</li>
              <li><strong>Sujet :</strong> ${subject}</li>
            </ul>
            <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #333;">Message du participant</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
              <p style="margin: 0;">Lien de la réunion :</p>
              <a href="${meeting.start_url}" 
                 style="display: inline-block; margin-top: 10px; padding: 10px 20px; 
                        background-color: #2D8CFF; color: white; text-decoration: none; 
                        border-radius: 5px;">
                Démarrer la réunion Zoom
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              * Ceci est une notification automatique. N'oubliez pas d'ajouter ce rendez-vous à votre calendrier.
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
      throw new Error('Erreur lors de l\'envoi des emails');
    }

    // Créer le rendez-vous dans la base de données
    const appointment = await prisma.appointment.create({
      data: {
        email,
        client: email.split('@')[0],
        date: new Date(date),
        time,
        subject,
        message,
        status: 'en attente'
      }
    });

    return NextResponse.json({
      success: true,
      appointment,
      meeting: {
        id: meeting.id,
        joinUrl: meeting.join_url,
        startUrl: meeting.start_url
      }
    });

  } catch (error) {
    console.error('Erreur détaillée:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Une erreur est survenue",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

async function getZoomToken() {
  try {
    const authString = Buffer.from(`${zoomConfig.sdkKey}:${zoomConfig.sdkSecret}`).toString('base64');
    console.log('Auth string générée');

    const response = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=account_credentials&account_id=' + process.env.ZOOM_ACCOUNT_ID
    });

    console.log('Réponse token status:', response.status);
    const responseText = await response.text();
    console.log('Réponse token body:', responseText);

    if (!response.ok) {
      throw new Error(`Erreur token: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    return data.access_token;
  } catch (error) {
    console.error('Erreur getZoomToken:', error);
    throw error;
  }
} 