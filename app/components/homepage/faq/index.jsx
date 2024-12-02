"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaSpinner } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';

function FAQSection() {
  const [userQuestion, setUserQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [faqs, setFaqs] = useState([
    {
      question: "Quelles sont vos principales compétences techniques ?",
      answer: "Je maîtrise plusieurs technologies dont React, Node.js, Django et Docker. Je suis particulièrement à l'aise avec le développement full stack et l'architecture logicielle.",
      isOpen: false
    }
  ]);

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!userQuestion.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userQuestion })
      });

      const data = await response.json();
      
      setFaqs(prev => [...prev, {
        question: userQuestion,
        answer: data.response,
        isOpen: true
      }]);
      setUserQuestion('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFAQ = (index) => {
    setFaqs(prev => prev.map((faq, i) => ({
      ...faq,
      isOpen: i === index ? !faq.isOpen : faq.isOpen
    })));
  };

  return (
    <div id="faq" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl opacity-20"></div>

      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" />
        </div>
      </div>

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">
            FAQ
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-8">
        {/* Questions existantes */}
        <AnimatePresence>
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-4 rounded-lg bg-[#1b2c68a0] border border-violet-500/20 focus:outline-none"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#16f2b3]">{faq.question}</span>
                  <FaChevronDown
                    className={`transform transition-transform ${
                      faq.isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {faq.isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="mt-4 text-gray-300"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Formulaire de question */}
        <form onSubmit={handleQuestionSubmit} className="mt-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="Posez votre question..."
              className="flex-1 p-3 rounded-lg bg-[#10172d] border border-[#353a52] focus:border-[#16f2b3] outline-none text-white"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-violet-600 text-white flex items-center gap-2"
            >
              {isLoading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <>
                  <span>Envoyer</span>
                  <IoSend />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FAQSection; 