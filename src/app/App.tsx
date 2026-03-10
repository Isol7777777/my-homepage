import { cookies } from "next/headers";
import { Header } from './components/header';
import { HeroSection } from './components/hero-section';
import { ProjectsSection } from './components/projects-section';
import { RoadmapSection } from './components/roadmap-section';
import { SocialSection } from './components/social-section';
import { ContactSection } from './components/contact-section';
import { Footer } from './components/footer';
import { fetchProjectsFromSupabase } from '@/data/projects-supabase';
import { PROJECTS } from '@/data/projects';
import { fetchRoadmapFromSupabase } from '@/data/roadmap-supabase';
import { ROADMAP_ITEMS } from '@/data/roadmap';

export default async function App() {
  const projects = await fetchProjectsFromSupabase(PROJECTS);
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin")?.value === "1";
  const roadmapItems = await fetchRoadmapFromSupabase(ROADMAP_ITEMS);

  return (
    <div className="min-h-screen">
      <Header isAdmin={isAdmin} />
      <HeroSection />
      <ProjectsSection initialProjects={projects} isAdmin={isAdmin} />
      <RoadmapSection initialItems={roadmapItems} isAdmin={isAdmin} />
      <SocialSection />
      <ContactSection />
      <Footer />
    </div>
  );
}