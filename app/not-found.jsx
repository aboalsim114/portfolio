// @flow strict

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">404 - Page Non Trouvée</h1>
        <p className="text-gray-400">La page que vous recherchez n&apos;existe pas.</p>
      </div>
    </div>
  );
}