import { Header } from './components/header';
import { HeroSection } from './components/hero-section';
import { ProjectsSection } from './components/projects-section';
import { RoadmapSection } from './components/roadmap-section';
import { SocialSection } from './components/social-section';
import { ContactSection } from './components/contact-section';
import { Footer } from './components/footer';
import { fetchProjectsFromSupabase } from '@/data/projects-supabase';
import { PROJECTS } from '@/data/projects';

export default async function App() {
  const projects = await fetchProjectsFromSupabase(PROJECTS);

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ProjectsSection initialProjects={projects} />
      <RoadmapSection />
      <SocialSection />
      <ContactSection />
      <Footer />
    </div>
  );
}