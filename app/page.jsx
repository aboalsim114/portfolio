"use client";

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { personalData } from "@/utils/data/personal-data";

// Import dynamique des composants avec loading fallback
const HeroSection = dynamic(() => import('./components/homepage/hero-section'), {
  ssr: false,
  loading: () => <div>Chargement...</div>
});

const AboutSection = dynamic(() => import('./components/homepage/about'));
const ExperienceSection = dynamic(() => import('./components/homepage/experience'));
const SkillSection = dynamic(() => import('./components/homepage/skills'));
const EducationSection = dynamic(() => import('./components/homepage/education'));
const ProjectSection = dynamic(() => import('./components/homepage/projects'));
const Certifications = dynamic(() => import('./components/homepage/certifications'));
const BookingSection = dynamic(() => import('./components/homepage/booking'));

function Home() {
  const [isClient, setIsClient] = useState(false);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    setIsClient(true);
    async function fetchData() {
      try {
        const res = await fetch(`https://dev.to/api/articles?username=${personalData.devUsername}`);
        if (!res.ok) {
          setBlogs([]);
          return;
        }
        const data = await res.json();
        const filtered = data.filter((item) => item?.cover_image).sort(() => Math.random() - 0.5);
        setBlogs(filtered);
      } catch (error) {
        console.error('Error fetching blog data:', error);
        setBlogs([]);
      }
    }
    fetchData();
  }, []);

  if (!isClient) {
    return null; // ou un loader
  }

  return (
    <>
      <HeroSection />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="relative z-50 max-w-6xl mx-auto px-4 mt-8"
      >
        <div className="bg-gradient-to-r from-pink-500/10 to-violet-500/10 border border-pink-500/20 rounded-lg p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium bg-pink-500/20 text-pink-500 rounded-full">
                Disponible
              </span>
              <span className="h-1.5 w-1.5 bg-[#16f2b3] rounded-full animate-pulse"></span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              À la recherche d&apos;une alternance
            </h3>
            <p className="text-gray-400">
              Actuellement en Master Architecture Logicielle à l&apos;ESGI, je suis à l&apos;écoute 
              d&apos;opportunités d&apos;alternance pour mettre en pratique mes compétences 
            </p>
          </div>
        </div>
      </motion.div>
      <AboutSection />
      <ExperienceSection />
      <SkillSection />
      <EducationSection />
      <ProjectSection />
      <Certifications />
      <BookingSection />
    </>
  );
}

export default Home; 