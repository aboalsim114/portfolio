import sharp from 'sharp';
import { join } from 'path';
import fs from 'fs/promises';

export async function optimizeImage(file, options = {}) {
  const {
    quality = 80,
    width = 800,
    format = 'webp'
  } = options;

  try {
    const image = sharp(file.buffer);
    const metadata = await image.metadata();

    // Redimensionner si l'image est plus large que la largeur cible
    if (metadata.width > width) {
      image.resize(width, null, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Convertir en WebP avec compression
    const optimizedBuffer = await image
      .webp({ quality })
      .toBuffer();

    return {
      buffer: optimizedBuffer,
      format: 'webp',
      width: metadata.width > width ? width : metadata.width,
      height: Math.round(metadata.height * (width / metadata.width))
    };
  } catch (error) {
    console.error('Erreur lors de l\'optimisation de l\'image:', error);
    throw error;
  }
} 