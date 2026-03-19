import Link from "next/link";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import type { Project } from "@/types";

interface SelectedWorkProps {
  projects: Project[];
}

export default function SelectedWork({ projects }: SelectedWorkProps) {
  return (
    <section className="section-padding border-t border-border/60">
      <div className="max-container">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 font-inter text-sm font-medium uppercase tracking-widest text-purple-600">
              Work
            </p>
            <h2 className="font-sora text-3xl font-600 tracking-tight text-foreground md:text-4xl">
              Selected Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            All projects
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No featured projects yet.</p>
        ) : (
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}

        <div className="mt-8 sm:hidden">
          <Link
            href="/projects"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View all projects
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <div
      className="group relative bg-background p-8 transition-colors hover:bg-muted/40"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Number */}
      <span className="mb-6 block font-mono text-xs text-muted-foreground/50">
        0{index + 1}
      </span>

      {/* Title */}
      <Link href={`/projects/${project.slug}`}>
        <h3 className="mb-3 font-sora text-lg font-600 text-foreground transition-colors group-hover:text-purple-600">
          {project.title}
        </h3>
      </Link>

      {/* Summary */}
      <p className="mb-6 font-inter text-sm leading-relaxed text-muted-foreground line-clamp-3">
        {project.summary}
      </p>

      {/* Stack */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="rounded-sm border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground"
          >
            {tech}
          </span>
        ))}
        {project.stack.length > 4 && (
          <span className="rounded-sm border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
            +{project.stack.length - 4}
          </span>
        )}
      </div>

      {/* Links */}
      <div className="flex items-center gap-3">
        <Link
          href={`/projects/${project.slug}`}
          className="font-inter text-xs font-medium text-purple-600 underline-offset-4 hover:underline"
        >
          Read more →
        </Link>
        {project.live_url && (
          <Link
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Live demo"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
        {project.github_url && (
          <Link
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
