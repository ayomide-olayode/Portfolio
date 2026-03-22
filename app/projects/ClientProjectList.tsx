"use client";

import Link from "next/link";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import type { ProjectSerialized } from "@/types";
import { getProjectImages } from "@/lib/queries";
import type { ProjectImage } from "@/types";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

interface ProjectWithImages extends ProjectSerialized {
  images?: ProjectImage[];
}

export default function ClientProjectList({
  projects,
}: {
  projects: ProjectSerialized[];
}) {
  const [projectsWithImages, setProjectsWithImages] = useState<
    ProjectWithImages[]
  >(projects.map((p) => ({ ...p, images: [] })));

  // Fetch images for all projects
  useEffect(() => {
    const fetchImages = async () => {
      const updated = await Promise.all(
        projects.map(async (project) => {
          try {
            const images = await getProjectImages(project.id);
            return { ...project, images };
          } catch {
            return { ...project, images: [] };
          }
        }),
      );
      setProjectsWithImages(updated);
    };

    fetchImages();
  }, [projects]);

  if (projects.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-mono text-muted-foreground">
          // No active projects found.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {projectsWithImages.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </motion.div>
  );
}

function ProjectCard({ project }: { project: ProjectWithImages }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = project.images || [];
  const hasImages = images.length > 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <motion.div
      variants={itemVariants}
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm transition-all hover:border-purple-500/30 hover:bg-card/60 flex flex-col h-full"
    >
      {/* Subtle gradient hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

      {/* Image Slideshow */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {hasImages ? (
          <>
            <Image
              src={images[currentImageIndex].imageUrl}
              alt={images[currentImageIndex].caption || project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentImageIndex
                          ? "w-6 bg-purple-500"
                          : "w-1.5 bg-white/40 hover:bg-white/60"
                      }`}
                      aria-label={`Image ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <span className="text-sm">No images</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col p-5">
        {/* Title & Featured Badge */}
        <Link href={`/projects/${project.slug}`}>
          <h2 className="mb-2 font-sora text-lg font-bold text-foreground transition-colors group-hover:text-purple-400">
            {project.title}
            {project.featured && (
              <span className="ml-2 inline-flex items-center rounded bg-purple-500/20 border border-purple-500/30 px-1.5 py-0.5 font-mono text-[8px] font-medium text-purple-300 uppercase tracking-widest align-middle">
                Featured
              </span>
            )}
          </h2>
        </Link>

        {/* Summary */}
        <p className="mb-4 line-clamp-2 flex-1 font-inter text-sm leading-relaxed text-muted-foreground">
          {project.summary}
        </p>

        {/* Stack */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 3).map((tech: string, i: number) => (
            <span
              key={tech || i}
              className="rounded bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-purple-400"
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 3 && (
            <span className="rounded bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-purple-400">
              +{project.stack.length - 3}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-3 border-t border-border/40 pt-3">
          <Link
            href={`/projects/${project.slug}`}
            className="font-mono text-[11px] font-semibold uppercase tracking-wider text-purple-500 hover:text-purple-400 transition-colors"
          >
            Details
          </Link>
          {project.live_url && (
            <Link
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="h-3 w-3" />
              Live
            </Link>
          )}
          {project.github_url && (
            <Link
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-3 w-3" />
              Code
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
