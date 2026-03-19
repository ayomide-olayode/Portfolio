"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProjectById, getProjectContent, getProjectImages } from "@/lib/queries";
import ProjectForm from "@/components/admin/ProjectForm";
import type { Project, ProjectContent, ProjectImage } from "@/types";
import { toast } from "sonner";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  console.log("EditProjectPage ID:", id);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [content, setContent] = useState<ProjectContent | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [p, c, i] = await Promise.all([
          getProjectById(id),
          getProjectContent(id),
          getProjectImages(id),
        ]);
        setProject(p);
        setContent(c);
        setImages(i);
      } catch {
        toast.error("Failed to load project.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-purple-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-20 text-center font-inter text-sm text-muted-foreground">
        Project not found.
      </div>
    );
  }

  return <ProjectForm project={project} content={content} images={images} />;
}
