"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { deleteProject } from "@/lib/actions/projects";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import type { Project } from "@/types";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function loadProjects() {
    try {
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project)));
    } catch {
      toast.error("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    const result = await deleteProject(id);
    if (result.success) {
      toast.success("Project deleted.");
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } else {
      toast.error(result.error ?? "Failed to delete.");
    }
    setDeleting(null);
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-sora text-2xl font-700 text-foreground">Projects</h1>
          <p className="mt-1 font-inter text-sm text-muted-foreground">
            {projects.length} total
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 font-inter text-sm font-medium text-white transition-colors hover:bg-purple-700"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-purple-600" />
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-20 text-center">
          <p className="font-inter text-sm text-muted-foreground">No projects yet.</p>
          <Link
            href="/admin/projects/new"
            className="mt-4 inline-flex items-center gap-1.5 font-inter text-sm font-medium text-purple-600 hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Add your first project
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                <th className="px-6 py-4 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Title
                </th>
                <th className="hidden px-6 py-4 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:table-cell">
                  Slug
                </th>
                <th className="hidden px-6 py-4 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground md:table-cell">
                  Stack
                </th>
                <th className="px-6 py-4 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Featured
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {projects.map((project) => (
                <tr key={project.id} className="transition-colors hover:bg-card/60">
                  <td className="px-6 py-5">
                    <span className="font-sora text-sm font-semibold text-foreground tracking-tight">
                      {project.title}
                    </span>
                  </td>
                  <td className="hidden px-6 py-5 sm:table-cell">
                    <span className="font-mono text-xs text-muted-foreground">
                      /projects/{project.slug}
                    </span>
                  </td>
                  <td className="hidden px-6 py-5 md:table-cell">
                    <div className="flex flex-wrap gap-2">
                      {project.stack.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 font-mono text-[10px] uppercase text-purple-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {project.featured ? (
                      <Star className="h-4 w-4 fill-purple-400 text-purple-400 shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                    ) : (
                      <Star className="h-4 w-4 text-muted border-none opacity-20" />
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-purple-500/10 hover:text-purple-400 hover:shadow-[0_0_10px_rgba(124,58,237,0.2)]"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        disabled={deleting === project.id}
                        className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-red-500/10 hover:text-red-400 hover:shadow-[0_0_10px_rgba(239,68,68,0.2)] disabled:opacity-40"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
