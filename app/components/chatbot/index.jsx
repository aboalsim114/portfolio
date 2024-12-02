"use client";

import { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaRobot, FaFileDownload, FaGithub, FaLinkedin, FaUser } from 'react-icons/fa';
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

  const SocialLinks = () => (
    <div className="flex gap-2">
      {socialLinks.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-violet-600 text-white px-3 py-1.5 rounded-lg text-xs hover:opacity-90 transition-opacity"
        >
          {link.icon}
          {link.name}
        </a>
      ))}
    </div>
  );

  return (
    <>
      {/* Bouton flottant du chatbot - réduit */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-3 left-3 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full p-2 sm:p-3 text-white shadow-lg hover:scale-110 transition-all duration-200 z-50"
      >
        <FaRobot size={16} className="sm:w-5 sm:h-5" />
      </button>

      {/* Fenêtre du chatbot */}
      {isOpen && (
        <div className="fixed bottom-3 left-3 w-[80vw] sm:w-[300px] md:w-[320px] h-[70vh] sm:h-[400px] bg-[#0d1224] border border-[#1b2c68a0] rounded-lg shadow-xl flex flex-col z-50">
          {/* Header avec bouton nouvelle conversation */}
          <div className="flex items-center justify-between p-2 sm:p-3 border-b border-[#1b2c68a0]">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold text-xs sm:text-sm">Assistant IA</h3>
              <button
                onClick={handleNewChat}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Nouvelle conversation
              </button>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <IoMdClose size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Messages avec avatars */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3">
            {messages.map((message, index) => (
              <div key={index} className="space-y-2">
                <div className="flex flex-col">
                  <div className={`flex items-start gap-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {message.role === 'assistant' ? (
                        <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-violet-500">
                          <Image
                            src={personalData.profile}
                            alt="Assistant Avatar"
                            width={24}
                            height={24}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 flex items-center justify-center">
                          <FaUser size={12} className="text-white" />
                        </div>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`max-w-[85%] rounded-lg p-2 sm:p-2.5 text-xs sm:text-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white'
                        : 'bg-[#1b2c68a0] text-white'
                    }`}>
                      {message.content}
                    </div>
                  </div>

                  {/* Timestamp */}
                  {message.timestamp && (
                    <span className={`text-[10px] text-gray-500 mt-1 ${
                      message.role === 'user' ? 'text-right mr-8' : 'text-left ml-8'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>

                {/* Buttons sous le message */}
                {message.role === 'assistant' && (
                  <div className="flex flex-col gap-2 ml-8">
                    {message.showCVButton && (
                      <div className="flex justify-start">
                        <button
                          onClick={handleDownloadCV}
                          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white px-3 py-1.5 rounded-lg text-xs hover:opacity-90 transition-opacity"
                        >
                          <FaFileDownload size={12} />
                          Télécharger le CV
                        </button>
                      </div>
                    )}
                    {message.showSocialLinks && (
                      <div className="flex justify-start">
                        <SocialLinks />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Loading state avec avatar */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-violet-500">
                  <Image
                    src={personalData.profile}
                    alt="Assistant Avatar"
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-[#1b2c68a0] text-white max-w-[85%] rounded-lg p-2 sm:p-2.5 text-xs sm:text-sm">
                  En train d'écrire...
                </div>
              </div>
            )}
          </div>

          {/* Input - plus compact */}
          <form onSubmit={handleSendMessage} className="p-2 sm:p-3 border-t border-[#1b2c68a0]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 bg-[#1b2c68a0] text-white rounded-lg px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-violet-600"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-pink-500 to-violet-600 text-white p-1.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <IoSend size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default Chatbot; 