"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaHistory, FaTimes } from 'react-icons/fa';

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Statistiques projets',
    'Performance SEO',
    'Messages récents'
  ]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-[#0d1224] rounded-lg text-gray-400 hover:text-white transition-colors"
      >
        <FaSearch />
        <span>Rechercher...</span>
        <span className="text-xs border border-gray-700 px-2 py-1 rounded ml-2">⌘K</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
          <div className="max-w-2xl mx-auto mt-20 p-4">
            <div className="bg-[#1a1443] rounded-xl shadow-2xl">
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <FaSearch className="text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher dans le dashboard..."
                    className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder-gray-400 text-lg"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-sm text-gray-400 font-medium mb-3">Recherches récentes</h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-3 w-full p-3 hover:bg-[#0d1224] rounded-lg text-left"
                    >
                      <FaHistory className="text-gray-500" />
                      <span>{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 