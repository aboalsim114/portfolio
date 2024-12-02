"use client";

import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaRobot } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Bonjour ! Je suis l\'assistant virtuel de Sami. Comment puis-je vous aider ?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const newMessage = {
      role: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response
      }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Bouton flottant du chatbot - réduit */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-3 left-3 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full p-2 sm:p-3 text-white shadow-lg hover:scale-110 transition-all duration-200 z-50"
      >
        <FaRobot size={16} className="sm:w-5 sm:h-5" />
      </button>

      {/* Fenêtre du chatbot - dimensions réduites */}
      {isOpen && (
        <div className="fixed bottom-3 left-3 w-[80vw] sm:w-[300px] md:w-[320px] h-[70vh] sm:h-[400px] bg-[#0d1224] border border-[#1b2c68a0] rounded-lg shadow-xl flex flex-col z-50">
          {/* Header - plus compact */}
          <div className="flex items-center justify-between p-2 sm:p-3 border-b border-[#1b2c68a0]">
            <h3 className="text-white font-semibold text-xs sm:text-sm">Assistant IA</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <IoMdClose size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Messages - espacement réduit */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-2 sm:p-2.5 text-xs sm:text-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white'
                      : 'bg-[#1b2c68a0] text-white'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
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