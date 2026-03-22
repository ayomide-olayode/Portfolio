import Hero from "@/components/sections/Hero";
import SelectedWork from "@/components/sections/SelectedWork";
import WhatIDo from "@/components/sections/WhatIDo";
import TechStack from "@/components/sections/TechStack";
import About from "@/components/sections/About";
import CTA from "@/components/sections/CTA";
import { getFeaturedProjects, getSiteLinks } from "@/lib/queries";
import { serializeTimestamp } from "@/lib/utils";
import type { SiteLinkSerialized } from "@/types";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredProjects, siteLinks] = await Promise.allSettled([
    getFeaturedProjects(3),
    getSiteLinks(),
  ]);

  const projects =
    featuredProjects.status === "fulfilled" ? featuredProjects.value : [];

  // Serialize SiteLinks before passing to Client Component
  const links =
    siteLinks.status === "fulfilled"
      ? (Object.entries(siteLinks.value).reduce(
          (acc, [key, link]) => ({
            ...acc,
            [key]: {
              ...link,
              updatedAt: serializeTimestamp(link.updatedAt),
            },
          }),
          {},
        ) as Record<string, SiteLinkSerialized>)
      : ({} as Record<string, SiteLinkSerialized>);

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
