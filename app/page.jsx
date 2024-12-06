"use client";

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Projects from './components/homepage/projects/Projects';

// Import dynamique des composants avec SSR désactivé pour ceux qui utilisent document
const HeroSection = dynamic(() => import('./components/homepage/hero-section'), {
  ssr: false
});

const AboutSection = dynamic(() => import('./components/homepage/about'));
const ExperienceSection = dynamic(() => import('./components/homepage/experience'));
const SkillSection = dynamic(() => import('./components/homepage/skills'));
const EducationSection = dynamic(() => import('./components/homepage/education'));
const ProjectSection = dynamic(() => import('./components/homepage/projects'));
const Certifications = dynamic(() => import('./components/homepage/certifications'));
const BookingSection = dynamic(() => import('./components/homepage/booking'), {
  ssr: false
});

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <>
      <HeroSection />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AboutSection />
        <ExperienceSection />
        <SkillSection />
        <EducationSection />
        <ProjectSection />
        <Certifications />
        <BookingSection />
        <Projects />
      </motion.div>
    </>
  );
} 