import Hero from "@/components/sections/Hero";
import SelectedWork from "@/components/sections/SelectedWork";
import WhatIDo from "@/components/sections/WhatIDo";
import TechStack from "@/components/sections/TechStack";
import About from "@/components/sections/About";
import CTA from "@/components/sections/CTA";
import { getFeaturedProjects, getSiteLinks } from "@/lib/queries";
import type { SiteLink } from "@/types";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredProjects, siteLinks] = await Promise.allSettled([
    getFeaturedProjects(3),
    getSiteLinks(),
  ]);

  const projects = featuredProjects.status === "fulfilled" ? featuredProjects.value : [];
  const links = siteLinks.status === "fulfilled"
    ? siteLinks.value
    : {} as Record<string, SiteLink>;

  return (
    <>
      <Hero links={links} />
      <SelectedWork projects={projects} />
      <WhatIDo />
      <TechStack />
      <About />
      <CTA />
    </>
  );
}
