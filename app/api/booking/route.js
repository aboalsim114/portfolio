import { NextResponse } from 'next/server';
import { zoomConfig } from '@/utils/zoom-config';
import nodemailer from 'nodemailer';

// Configurer le transporteur email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_APP_PASSWORD // Mot de passe d'application Gmail
  }
});

export async function POST(request) {
  try {
    const { date, time, email } = await request.json();
    console.log('Données reçues:', { date, time, email });

    if (!date || !time || !email) {
      return NextResponse.json(
        { success: false, error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    const meetingTime = new Date(`${date}T${time}`);
    console.log('Meeting time:', meetingTime);
    
    // Obtenir le token Zoom
    const token = await getZoomToken();
    console.log('Token Zoom obtenu');
    
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

    // Envoyer l'email de confirmation
    await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: 'Confirmation de votre rendez-vous avec Sami Abdulhalim',
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

    return NextResponse.json({
      success: true,
      meeting: {
        id: meeting.id,
        joinUrl: meeting.join_url,
        startUrl: meeting.start_url
      }
    });

  } catch (error) {
    console.error('Erreur détaillée:', error);
    return NextResponse.json(
      { success: false, error: error.message || "Une erreur est survenue" },
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