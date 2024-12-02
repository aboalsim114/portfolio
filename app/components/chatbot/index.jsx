"use client";

import { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaRobot, FaFileDownload, FaGithub, FaLinkedin, FaUser, FaStar } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import { personalData } from "@/utils/data/personal-data";
import Image from 'next/image';

const CHAT_HISTORY_KEY = 'chat_history';
const SESSION_ID_KEY = 'chat_session_id';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  const socialLinks = [
    {
      name: 'GitHub',
      url: personalData.github,
      icon: <FaGithub size={12} />
    },
    {
      name: 'LinkedIn',
      url: personalData.linkedIn,
      icon: <FaLinkedin size={12} />
    }
  ];

  // Initialiser le chat et charger l'historique
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSessionId = localStorage.getItem(SESSION_ID_KEY);
      const savedMessages = localStorage.getItem(CHAT_HISTORY_KEY);

      if (savedSessionId && savedMessages) {
        try {
          setSessionId(savedSessionId);
          setMessages(JSON.parse(savedMessages));
        } catch (error) {
          console.error('Error loading chat history:', error);
          initializeNewChat();
        }
      } else {
        initializeNewChat();
      }
    }
  }, []);

  // Sauvegarder les messages quand ils changent
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const initializeNewChat = () => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_ID_KEY, newSessionId);
    }

    const initialMessage = {
      role: 'assistant',
      content: 'Bonjour ! Je suis l\'assistant virtuel de Sami. Je peux vous aider à en savoir plus sur ses compétences, vous montrer ses profils professionnels ou vous pouvez télécharger son CV.',
      showCVButton: true,
      showSocialLinks: true
    };

    setMessages([initialMessage]);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify([initialMessage]));
    }
  };

  const generateSessionId = () => {
    return 'session_' + Math.random().toString(36).substr(2, 9);
  };

  const handleNewChat = () => {
    initializeNewChat();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const newMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    const cvKeywords = ['cv', 'curriculum', 'vitae', 'resume', 'télécharger'];
    const socialKeywords = ['github', 'linkedin', 'projets', 'profil', 'portfolio', 'réseau'];
    
    const askingForCV = cvKeywords.some(keyword => 
      inputMessage.toLowerCase().includes(keyword)
    );
    const askingForSocial = socialKeywords.some(keyword => 
      inputMessage.toLowerCase().includes(keyword)
    );

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: inputMessage,
          sessionId,
          history: messages.slice(-5) // Envoyer les 5 derniers messages pour le contexte
        }),
      });

      const data = await response.json();
      
      const assistantMessage = {
        role: 'assistant',
        content: data.response,
        showCVButton: askingForCV,
        showSocialLinks: askingForSocial,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCV = () => {
    window.open(personalData.resume, '_blank');
  };

  return (
    <>
      {/* Bouton flottant amélioré */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-3 left-3 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full p-3 text-white shadow-xl hover:scale-110 transition-all duration-300 z-50 group"
      >
        <div className="relative">
          <FaRobot size={24} className="text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
          </span>
        </div>
        <span className="absolute left-full ml-4 bg-black/80 backdrop-blur-sm text-white text-sm py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Assistant IA
        </span>
      </button>

      {/* Fenêtre du chatbot améliorée */}
      {isOpen && (
        <div className="fixed bottom-3 left-3 w-[80vw] sm:w-[300px] md:w-[320px] h-[70vh] sm:h-[400px] bg-[#0d1224] border border-violet-500/20 rounded-2xl shadow-2xl flex flex-col z-50 animate-slideInLeft">
          {/* Header amélioré */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-500/10 to-violet-600/10 border-b border-violet-500/20 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={personalData.profile}
                  alt="Assistant Avatar"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-violet-500"
                />
                <FaStar className="absolute -top-1 -right-1 text-yellow-400 animate-pulse" size={12} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Assistant IA</h3>
                <p className="text-xs text-gray-400">Développé par Sami</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
            >
              <IoMdClose size={20} />
            </button>
          </div>

          {/* Messages avec design amélioré */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-violet-500/20 scrollbar-track-transparent">
            {messages.map((message, index) => (
              <div key={index} className="space-y-2">
                <div className="flex flex-col">
                  <div className={`flex items-start gap-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="flex-shrink-0">
                      {message.role === 'assistant' ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-violet-500 shadow-lg">
                          <Image
                            src={personalData.profile}
                            alt="Assistant Avatar"
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 flex items-center justify-center shadow-lg">
                          <FaUser size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className={`relative max-w-[85%] rounded-2xl p-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white'
                        : 'bg-[#1b2c68a0] text-white border border-violet-500/20'
                    }`}>
                      <div className="text-sm">{message.content}</div>
                      {message.timestamp && (
                        <span className="absolute bottom-1 right-2 text-[10px] text-gray-400/80">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {message.role === 'assistant' && (
                  <div className="flex flex-col gap-2 ml-10">
                    {message.showCVButton && (
                      <button
                        onClick={handleDownloadCV}
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-violet-600/20 hover:from-pink-500 hover:to-violet-600 text-white px-4 py-2 rounded-xl text-xs transition-all duration-300 border border-violet-500/20 group"
                      >
                        <FaFileDownload size={12} className="group-hover:scale-110 transition-transform" />
                        <span>Télécharger le CV</span>
                      </button>
                    )}
                    {message.showSocialLinks && (
                      <div className="flex gap-2">
                        {socialLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-violet-600/20 hover:from-pink-500 hover:to-violet-600 text-white px-4 py-2 rounded-xl text-xs transition-all duration-300 border border-violet-500/20 group"
                          >
                            <span className="group-hover:scale-110 transition-transform">{link.icon}</span>
                            <span>{link.name}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* État de chargement amélioré */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-violet-500">
                  <Image
                    src={personalData.profile}
                    alt="Assistant Avatar"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-[#1b2c68a0] text-white max-w-[85%] rounded-2xl p-3 border border-violet-500/20">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input amélioré */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-violet-500/20 bg-gradient-to-r from-pink-500/5 to-violet-600/5">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 bg-[#1b2c68a0] text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 border border-violet-500/20 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-pink-500 to-violet-600 text-white p-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IoSend size={20} className="transform rotate-45" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default Chatbot; 