import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index?: number;
  variant?: "grid" | "list";
}

export default function ProjectCard({ project, index = 0, variant = "grid" }: ProjectCardProps) {
  if (variant === "list") {
    return (
      <div className="group flex flex-col gap-4 py-8 sm:flex-row sm:items-start sm:gap-12">
        <div className="flex-shrink-0 sm:w-40">
          <span className="block font-mono text-xs text-muted-foreground/50 mb-3">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex flex-wrap gap-1">
            {project.stack.slice(0, 3).map((tech) => (
              <span key={tech} className="rounded-sm border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <Link href={`/projects/${project.slug}`}>
            <h2 className="mb-2 font-sora text-xl font-600 text-foreground transition-colors group-hover:text-purple-600">
              {project.title}
            </h2>
          </Link>
          <p className="mb-4 font-inter text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
          <div className="flex items-center gap-4">
            <Link href={`/projects/${project.slug}`} className="font-inter text-xs font-medium text-purple-600 underline-offset-4 hover:underline">
              Case study →
            </Link>
            {project.live_url && (
              <Link href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-inter text-xs text-muted-foreground hover:text-foreground">
                <ExternalLink className="h-3 w-3" /> Live
              </Link>
            )}
            {project.github_url && (
              <Link href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-inter text-xs text-muted-foreground hover:text-foreground">
                <Github className="h-3 w-3" /> GitHub
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("group relative bg-background p-8 transition-colors hover:bg-muted/40")}>
      <span className="mb-6 block font-mono text-xs text-muted-foreground/50">
        0{index + 1}
      </span>
      <Link href={`/projects/${project.slug}`}>
        <h3 className="mb-3 font-sora text-lg font-600 text-foreground transition-colors group-hover:text-purple-600">
          {project.title}
        </h3>
      </Link>
      <p className="mb-6 font-inter text-sm leading-relaxed text-muted-foreground line-clamp-3">
        {project.summary}
      </p>
      <div className="mb-6 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 4).map((tech) => (
          <span key={tech} className="rounded-sm border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
            {tech}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Link href={`/projects/${project.slug}`} className="font-inter text-xs font-medium text-purple-600 underline-offset-4 hover:underline">
          Read more →
        </Link>
        {project.live_url && (
          <Link href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
        {project.github_url && (
          <Link href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
            <Github className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
