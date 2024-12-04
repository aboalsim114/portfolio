"use client";
import { personalData } from "@/utils/data/personal-data";
import { motion } from 'framer-motion';
import AboutSection from "./components/homepage/about";
import Blog from "./components/homepage/blog";
import ContactSection from "./components/homepage/contact";
import EducationSection from "./components/homepage/education";
import ExperienceSection from "./components/homepage/experience";
import FAQSection from "./components/homepage/faq";
import HeroSection from "./components/homepage/hero-section";
import ProjectSection from "./components/homepage/projects";
import SkillSection from "./components/homepage/skills";
import Certifications from "./components/homepage/certifications";
import BookingSection from "./components/homepage/booking";
import { useState, useEffect } from 'react';

function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
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