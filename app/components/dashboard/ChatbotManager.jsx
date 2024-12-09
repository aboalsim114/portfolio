"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiUsers, FiSettings, FiTrash2, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { IoColorPaletteOutline } from 'react-icons/io5';
import { BsChatDots, BsRobot } from 'react-icons/bs';

export default function ChatbotManager() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('conversations');

  // Simuler le chargement des conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Remplacer par votre appel API réel
        const response = await fetch('/api/chat/conversations');
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error('Erreur lors du chargement des conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const sections = [
    { id: 'conversations', icon: BsChatDots, label: 'Conversations' },
    { id: 'analytics', icon: FiUsers, label: 'Analytiques' },
    { id: 'settings', icon: FiSettings, label: 'Paramètres' }
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Panneau latéral */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="col-span-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20">
            <BsRobot className="text-2xl text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Chatbot</h2>
            <p className="text-sm text-gray-400">Gestion & Analytics</p>
          </div>
        </div>

        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-white'
                  : 'hover:bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <section.icon className="text-xl" />
              <span>{section.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <FiMessageSquare className="text-violet-400" />
            <h3 className="text-sm font-medium text-white">Statistiques</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-white">156</div>
              <div className="text-xs text-gray-400">Conversations</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-white">89%</div>
              <div className="text-xs text-gray-400">Satisfaction</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contenu principal */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-9 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
      >
        {activeSection === 'conversations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Historique des conversations</h3>
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                  <FiRefreshCw />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                  <FiDownload />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {conversations.map((chat) => (
                <motion.div
                  key={chat.id}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedChat?.id === chat.id
                      ? 'bg-gradient-to-r from-violet-500/20 to-pink-500/20 border-violet-500/50'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center">
                        <FiUsers className="text-violet-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{chat.user}</h4>
                        <p className="text-sm text-gray-400">{chat.lastMessage}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">{chat.timestamp}</div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 rounded-full text-xs bg-violet-500/20 text-violet-400">
                      {chat.messages} messages
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                      {chat.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Analytiques</h3>
            {/* Ajoutez ici vos composants d'analytiques */}
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Paramètres du Chatbot</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-400">Thème du chatbot</label>
                <div className="grid grid-cols-2 gap-3">
                  {['default', 'ocean', 'forest', 'sunset'].map((theme) => (
                    <button
                      key={theme}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <IoColorPaletteOutline className="text-violet-400" />
                        <span className="capitalize">{theme}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Autres paramètres */}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
} 