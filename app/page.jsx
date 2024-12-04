import { personalData } from "@/utils/data/personal-data";
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

async function getData() {
  try {
    const res = await fetch(`https://dev.to/api/articles?username=${personalData.devUsername}`);

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const filtered = data.filter((item) => item?.cover_image).sort(() => Math.random() - 0.5);
    return filtered;
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return [];
  }
}

export default async function Home() {
  const blogs = await getData();

  return (
    <>
      <HeroSection />
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