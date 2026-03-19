"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProjectById, getProjectBySlug, getProjectContent, getProjectImages } from "@/lib/queries";
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
      if (!id) return;
      setLoading(true);
      try {
        console.log("Fetching project with identifier:", id);
        let p = await getProjectById(id);
        
        // Fallback: search by slug if ID doesn't return a document
        if (!p) {
          console.log("Project not found by ID, trying slug...");
          p = await getProjectBySlug(id);
        }

        if (p) {
          const [c, i] = await Promise.all([
            getProjectContent(p.id),
            getProjectImages(p.id),
          ]);
          setProject(p);
          setContent(c);
          setImages(i);
        } else {
          console.warn("Project not found by ID or Slug:", id);
        }
      } catch (error) {
        console.error("Error loading project:", error);
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
