import { personalData } from "@/utils/data/personal-data";
import AboutSection from "./components/homepage/about";
import BlogSection from "./components/homepage/blog";
import ContactSection from "./components/homepage/contact";
import EducationSection from "./components/homepage/education";
import ExperienceSection from "./components/homepage/experience";
import FAQSection from "./components/homepage/faq";
import HeroSection from "./components/homepage/hero-section";
import ProjectSection from "./components/homepage/projects";
import SkillSection from "./components/homepage/skills";
import dbConnect from '@/utils/db';
import Project from '@/models/Project';
import BlogModel from '@/models/Blog';

async function getData() {
  try {
    await dbConnect();
    
    // Récupérer les projets publiés
    const projects = await Project.find({ status: 'published' })
      .sort({ createdAt: -1 });

    // Récupérer les articles publiés
    const blogs = await BlogModel.find({ status: 'published' })
      .sort({ createdAt: -1 });

    // Récupérer les données du portfolio
    const portfolioResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/portfolio`, {
      cache: 'no-store'
    });
    const portfolioData = await portfolioResponse.json();

    return {
      projects,
      blogs,
      experience: portfolioData.experience,
      education: portfolioData.education,
      skills: portfolioData.skills,
      personal: portfolioData.personal
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      projects: [],
      blogs: [],
      experience: [],
      education: [],
      skills: [],
      personal: personalData
    };
  }
}

export default async function Home() {
  const data = await getData();

  return (
    <>
      <HeroSection personalInfo={data.personal} />
      <AboutSection personalInfo={data.personal} />
      <ExperienceSection experiences={data.experience} />
      <SkillSection skills={data.skills} />
      <EducationSection education={data.education} />
      <ProjectSection projects={data.projects} />
      <BlogSection blogs={data.blogs} />
      <FAQSection />
      <ContactSection />
    </>
  );
} 