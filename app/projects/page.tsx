import type { Metadata } from "next";
import { getAllProjects } from "@/lib/queries";
import ClientProjectList from "./ClientProjectList";

export const metadata: Metadata = {
  title: "Projects",
  description: "A collection of frontend projects I've built—from side experiments to production applications.",
};

export const revalidate = 60;

export default async function ProjectsPage() {
  let projects: any[] = [];
  try {
    projects = await getAllProjects();
  } catch {
    // Firebase might not be configured
  }

  return (
    <div className="section-padding pt-24 min-h-[100vh] relative overflow-hidden border-t border-border/40">
      {/* Background flair */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-container relative z-10">
        {/* Header */}
        <div className="mb-16">
          <p className="mb-3 font-mono text-sm font-semibold tracking-widest text-purple-500">
            // PORTFOLIO
          </p>
          <h1 className="mb-4 font-sora text-4xl font-bold tracking-tight text-foreground md:text-6xl drop-shadow-sm">
            All Projects
          </h1>
          <p className="max-w-xl font-inter text-base leading-relaxed text-muted-foreground">
            A continuous log of my technical experiments, production applications, and
            open-source tooling.
          </p>
        </div>

        {/* Projects list */}
        <ClientProjectList projects={projects} />
      </div>
    </div>
  );
}
