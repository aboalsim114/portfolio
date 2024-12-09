const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export async function createToken(payload) {
  try {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 24 * 60 * 60; // 24 heures

    const payloadWithExp = {
      ...payload,
      iat: now,
      exp: now + expiresIn
    };

    const stringifiedHeader = JSON.stringify(header);
    const stringifiedPayload = JSON.stringify(payloadWithExp);

    const base64Header = btoa(stringifiedHeader);
    const base64Payload = btoa(stringifiedPayload);

    const key = await crypto.subtle.importKey(
      'raw',
      textEncoder.encode(process.env.JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      textEncoder.encode(`${base64Header}.${base64Payload}`)
    );

    const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)));

    return `${base64Header}.${base64Payload}.${base64Signature}`;
  } catch (error) {
    console.error('Erreur création token:', error);
    return null;
  }
}

export async function verifyToken(token) {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    
    if (!headerB64 || !payloadB64 || !signatureB64) {
      return null;
    }

    const key = await crypto.subtle.importKey(
      'raw',
      textEncoder.encode(process.env.JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );

    const verified = await crypto.subtle.verify(
      'HMAC',
      key,
      new Uint8Array(atob(signatureB64).split('').map(c => c.charCodeAt(0))),
      textEncoder.encode(`${headerB64}.${payloadB64}`)
    );

    if (!verified) {
      return null;
    }

    const payload = JSON.parse(atob(payloadB64));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Erreur vérification token:', error);
    return null;
  }
} 