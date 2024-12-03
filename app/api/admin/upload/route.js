import { optimizeImage } from '@/utils/imageOptimizer';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');
    const type = formData.get('type'); // 'project', 'blog', etc.

    if (!file) {
      return Response.json(
        { error: "Aucun fichier n'a été fourni" },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return Response.json(
        { error: "Type de fichier non supporté" },
        { status: 400 }
      );
    }

    // Optimiser l'image
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const optimized = await optimizeImage({ buffer }, {
      quality: 80,
      width: type === 'blog' ? 1200 : 800
    });

    // Créer le nom du fichier
    const fileName = `${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}.webp`;
    const directory = join(process.cwd(), 'public', 'uploads', type);
    const filePath = join(directory, fileName);

    // Sauvegarder l'image optimisée
    await writeFile(filePath, optimized.buffer);

    return Response.json({
      success: true,
      url: `/uploads/${type}/${fileName}`,
      width: optimized.width,
      height: optimized.height
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    return Response.json(
      { error: "Erreur lors de l'upload de l'image" },
      { status: 500 }
    );
  }
} 