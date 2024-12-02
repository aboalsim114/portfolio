"use client";

import { useState, useEffect, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaRobot, FaFileDownload, FaGithub, FaLinkedin, FaUser, FaStar, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import { BsSoundwave } from 'react-icons/bs';
import { personalData } from "@/utils/data/personal-data";
import Image from 'next/image';
import { VscClearAll } from 'react-icons/vsc';
import { BiReset } from 'react-icons/bi';

const CHAT_HISTORY_KEY = 'chat_history';
const SESSION_ID_KEY = 'chat_session_id';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');

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

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

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

  // Initialisation de la reconnaissance vocale
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.webkitSpeechRecognition) {
        const SpeechRecognition = window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = 'fr-FR';
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setTranscript('Je vous écoute...');
        };

        recognitionRef.current.onresult = (event) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          if (event.results[0].isFinal) {
            setInputMessage(text);
            setTimeout(() => handleSendMessage({ preventDefault: () => {} }), 500);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setTranscript('Erreur de reconnaissance vocale');
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      // Initialisation de la synthèse vocale
      if (window.speechSynthesis) {
        synthRef.current = window.speechSynthesis;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

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
      
      // Lire la réponse à voix haute
      speakResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCV = () => {
    window.open(personalData.resume, '_blank');
  };

  // Fonction pour démarrer/arrêter la reconnaissance vocale
  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      alert("La reconnaissance vocale n'est pas supportée par votre navigateur.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Fonction pour la synthèse vocale
  const speakResponse = (text) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;

    // Sélection d'une voix française
    const voices = synthRef.current.getVoices();
    const frenchVoice = voices.find(voice => voice.lang.includes('fr'));
    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  // Fonction pour effacer l'historique
  const clearHistory = () => {
    if (window.confirm('Voulez-vous vraiment effacer tout l\'historique de conversation ?')) {
      setMessages([{
        role: 'assistant',
        content: 'Historique effacé. Comment puis-je vous aider ?',
        timestamp: new Date().toISOString()
      }]);
      localStorage.removeItem(CHAT_HISTORY_KEY);
    }
  };

  // Fonction pour démarrer un nouveau chat
  const startNewChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Bonjour ! Je suis l\'assistant virtuel de Sami. Comment puis-je vous aider ?',
      showCVButton: true,
      showSocialLinks: true,
      timestamp: new Date().toISOString()
    }]);
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
          {/* Header amélioré avec boutons */}
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
            <div className="flex items-center gap-2">
              {/* Bouton nouveau chat */}
              <button
                onClick={startNewChat}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg group relative"
                title="Nouveau chat"
              >
                <BiReset size={20} className="group-hover:rotate-180 transition-transform duration-300" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Nouveau chat
                </span>
              </button>

              {/* Bouton effacer historique */}
              <button
                onClick={clearHistory}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg group relative"
                title="Effacer l'historique"
              >
                <VscClearAll size={20} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Effacer l'historique
                </span>
              </button>

              {/* Bouton fermer existant */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <IoMdClose size={20} />
              </button>
            </div>
          </div>

          {/* Bannière d'information après effacement */}
          {messages.length === 1 && (
            <div className="bg-violet-500/10 border-b border-violet-500/20 px-4 py-2">
              <p className="text-xs text-gray-300 text-center">
                Nouvelle conversation démarrée
              </p>
            </div>
          )}

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

          {/* Input avec bouton micro */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-violet-500/20 bg-gradient-to-r from-pink-500/5 to-violet-600/5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleVoiceRecognition}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gradient-to-r from-pink-500 to-violet-600 hover:opacity-90'
                }`}
              >
                {isListening ? (
                  <FaMicrophoneSlash size={20} className="text-white animate-pulse" />
                ) : (
                  <FaMicrophone size={20} className="text-white" />
                )}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isListening ? 'Je vous écoute...' : 'Écrivez ou parlez...'}
                className="flex-1 bg-[#1b2c68a0] text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 border border-violet-500/20 placeholder-gray-400"
              />

              {/* Indicateur de parole en cours */}
              {isSpeaking && (
                <div className="flex items-center">
                  <BsSoundwave size={20} className="text-violet-500 animate-pulse" />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || (!inputMessage.trim() && !isListening)}
                className="bg-gradient-to-r from-pink-500 to-violet-600 text-white p-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IoSend size={20} className="transform rotate-45" />
              </button>
            </div>

            {/* Transcription en cours */}
            {isListening && transcript && (
              <div className="mt-2 text-xs text-gray-400 italic">
                {transcript}
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
}

export default Chatbot; 