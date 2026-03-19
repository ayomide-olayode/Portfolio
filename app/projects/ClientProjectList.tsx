"use client";

import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function ClientProjectList({ projects }: { projects: any[] }) {
  if (projects.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-mono text-muted-foreground">// No active projects found.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden" 
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-8"
    >
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          variants={itemVariants}
          className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-6 sm:p-8 backdrop-blur-sm transition-colors hover:bg-card/60 hover:border-purple-500/30 flex flex-col sm:flex-row gap-6 sm:gap-12"
        >
          {/* Subtle gradient hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

          {/* Left: Number + stack */}
          <div className="relative z-10 flex-shrink-0 sm:w-48">
            <span className="mb-4 block font-mono text-4xl font-bold text-muted-foreground/20 transition-colors group-hover:text-purple-500/30">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-wrap gap-2">
              {project.stack.slice(0, 3).map((tech: string, i: number) => (
                <span
                  key={tech || i}
                  className="rounded bg-purple-500/10 border border-purple-500/20 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-purple-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Content */}
          <div className="relative z-10 flex-1">
            <Link href={`/projects/${project.slug}`}>
              <h2 className="mb-3 font-sora text-2xl font-bold text-foreground transition-colors group-hover:text-purple-400">
                {project.title}
                {project.featured && (
                  <span className="ml-3 inline-flex items-center rounded bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 font-mono text-[10px] font-medium text-purple-300 uppercase tracking-widest align-middle">
                    Featured
                  </span>
                )}
              </h2>
            </Link>
            <p className="mb-6 font-inter text-base leading-relaxed text-muted-foreground">
              {project.summary}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <Link
                href={`/projects/${project.slug}`}
                className="font-mono text-xs font-semibold uppercase tracking-wider text-purple-500 hover:text-purple-400 transition-colors flex items-center gap-2"
              >
                View Details <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              {project.live_url && (
                <Link
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Live
                </Link>
              )}
              {project.github_url && (
                <Link
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="h-3.5 w-3.5" />
                  Code
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
