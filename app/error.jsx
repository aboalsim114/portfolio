'use client';

export default function Error() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">500 - Erreur Serveur</h1>
        <p className="text-gray-400">Une erreur s&apos;est produite. Veuillez réessayer plus tard.</p>
      </div>
    </div>
  );
} 