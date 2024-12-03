"use client";

import { useState } from 'react';
import { FaMagic, FaSpinner } from 'react-icons/fa';

export default function ContentGenerator() {
  const [type, setType] = useState('blog');
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);

  const generateContent = async () => {
    if (!topic) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, topic })
      });

      const data = await response.json();
      setGeneratedContent(data.content);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1443] p-6 rounded-xl mt-6">
      <h3 className="text-xl font-bold mb-4">Générateur de Contenu</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Type de contenu</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 rounded-lg bg-[#0d1224] border border-gray-700"
          >
            <option value="blog">Article de blog</option>
            <option value="project">Description de projet</option>
            <option value="skill">Description de compétence</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Sujet</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ex: React Hooks, API REST..."
            className="w-full p-2 rounded-lg bg-[#0d1224] border border-gray-700"
          />
        </div>
        <button
          onClick={generateContent}
          disabled={loading || !topic}
          className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-pink-500 to-violet-600 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <FaMagic />
              Générer
            </>
          )}
        </button>
        {generatedContent && (
          <div className="mt-4 p-4 bg-[#0d1224] rounded-lg">
            <pre className="text-sm text-gray-200 whitespace-pre-wrap">
              {generatedContent}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 