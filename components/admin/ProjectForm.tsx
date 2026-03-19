"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProject, updateProject, uploadProjectImage, deleteProjectImage } from "@/lib/actions";
import { generateSlug } from "@/lib/utils";
import { toast } from "sonner";
import { X, Upload, Loader2, Plus } from "lucide-react";
import type { Project, ProjectContent, ProjectImage, ProjectFormData, ProjectContentFormData } from "@/types";

interface ProjectFormProps {
  project?: Project;
  content?: ProjectContent | null;
  images?: ProjectImage[];
}

type Tab = "basic" | "content" | "images";

const TECH_SUGGESTIONS = [
  "React", "Next.js", "TypeScript", "JavaScript", "Vue", "Nuxt",
  "Tailwind CSS", "CSS Modules", "Sass", "Node.js", "Firebase",
  "Supabase", "PostgreSQL", "MongoDB", "GraphQL", "REST API",
  "Vercel", "AWS", "Docker", "Git", "Figma", "Storybook",
];

export default function ProjectForm({ project, content, images: initialImages = [] }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!project;

  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<ProjectImage[]>(initialImages);

  // Basic info state
  const [form, setForm] = useState<ProjectFormData>({
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    summary: project?.summary ?? "",
    stack: project?.stack ?? [],
    live_url: project?.live_url ?? "",
    github_url: project?.github_url ?? "",
    featured: project?.featured ?? false,
  });

  // Content state
  const [contentForm, setContentForm] = useState<ProjectContentFormData>({
    context: content?.context ?? "",
    problem: content?.problem ?? "",
    approach: content?.approach ?? "",
    outcome: content?.outcome ?? "",
    notes: content?.notes ?? "",
  });

  const [stackInput, setStackInput] = useState("");
  const [slugManual, setSlugManual] = useState(isEditing);

  // Auto-generate slug
  useEffect(() => {
    if (!slugManual && form.title) {
      setForm((f) => ({ ...f, slug: generateSlug(f.title) }));
    }
  }, [form.title, slugManual]);

  const addStack = (tech: string) => {
    const trimmed = tech.trim();
    if (trimmed && !form.stack.includes(trimmed)) {
      setForm((f) => ({ ...f, stack: [...f.stack, trimmed] }));
    }
    setStackInput("");
  };

  const removeStack = (tech: string) => {
    setForm((f) => ({ ...f, stack: f.stack.filter((t) => t !== tech) }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast.error("Title is required."); return; }
    if (!form.slug.trim()) { toast.error("Slug is required."); return; }
    if (!form.summary.trim()) { toast.error("Summary is required."); return; }

    setSaving(true);
    const result = isEditing
      ? await updateProject(project.id, form, contentForm)
      : await createProject(form, contentForm);

    if (result.success) {
      toast.success(isEditing ? "Project updated." : "Project created.");
      router.push("/admin/projects");
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
    setSaving(false);
  };

  const handleImageUpload = async (files: FileList) => {
    setUploading(true);
    const projectId = project?.id;
    if (!projectId) {
      toast.error("Save the project first before uploading images.");
      setUploading(false);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadProjectImage(projectId, fd, images.length + i);
      if (result.success && result.data) {
        setImages((prev) => [
          ...prev,
          {
            id: result.data!.id,
            projectId,
            imageUrl: result.data!.imageUrl,
            order: images.length + i,
            caption: "",
            createdAt: {} as never,
          },
        ]);
      } else {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    setUploading(false);
  };

  const handleDeleteImage = async (img: ProjectImage) => {
    if (!confirm("Delete this image?")) return;
    const result = await deleteProjectImage(img.id, img.imageUrl);
    if (result.success) {
      setImages((prev) => prev.filter((i) => i.id !== img.id));
    } else {
      toast.error("Failed to delete image.");
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "basic", label: "Basic Info" },
    { id: "content", label: "Content" },
    { id: "images", label: `Images${images.length ? ` (${images.length})` : ""}` },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-sora text-2xl font-700 text-foreground">
            {isEditing ? "Edit Project" : "New Project"}
          </h1>
          {isEditing && (
            <p className="mt-1 font-mono text-xs text-muted-foreground">{project.slug}</p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving…" : "Save Project"}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-border">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2.5 font-inter text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === id
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Basic Info */}
      {activeTab === "basic" && (
        <div className="max-w-2xl space-y-6">
          <Field label="Title" required>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="input-base"
              placeholder="My Awesome Project"
            />
          </Field>

          <Field label="Slug" required hint="Used in the URL: /projects/your-slug">
            <input
              type="text"
              value={form.slug}
              onChange={(e) => { setSlugManual(true); setForm((f) => ({ ...f, slug: e.target.value })); }}
              className="input-base font-mono text-sm"
              placeholder="my-awesome-project"
            />
          </Field>

          <Field label="Summary" required hint={`${form.summary.length}/160 characters`}>
            <textarea
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value.slice(0, 160) }))}
              rows={3}
              className="input-base resize-none"
              placeholder="A brief description of the project (max 160 chars)"
            />
          </Field>

          <Field label="Tech Stack">
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={stackInput}
                  onChange={(e) => setStackInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addStack(stackInput); }}}
                  className="input-base flex-1"
                  placeholder="Add technology (press Enter)"
                  list="tech-suggestions"
                />
                <datalist id="tech-suggestions">
                  {TECH_SUGGESTIONS.map((t) => <option key={t} value={t} />)}
                </datalist>
                <button
                  type="button"
                  onClick={() => addStack(stackInput)}
                  className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {form.stack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.stack.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-1 rounded-sm border border-border bg-muted px-2 py-1 font-mono text-xs text-foreground"
                    >
                      {tech}
                      <button
                        onClick={() => removeStack(tech)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Live URL">
              <input
                type="url"
                value={form.live_url}
                onChange={(e) => setForm((f) => ({ ...f, live_url: e.target.value }))}
                className="input-base"
                placeholder="https://example.com"
              />
            </Field>
            <Field label="GitHub URL">
              <input
                type="url"
                value={form.github_url}
                onChange={(e) => setForm((f) => ({ ...f, github_url: e.target.value }))}
                className="input-base"
                placeholder="https://github.com/..."
              />
            </Field>
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="h-4 w-4 accent-purple-600"
            />
            <span className="font-inter text-sm font-medium text-foreground">
              Feature on homepage
            </span>
          </label>
        </div>
      )}

      {/* Tab: Content */}
      {activeTab === "content" && (
        <div className="max-w-2xl space-y-6">
          {([
            ["context", "Context", "Project background and why it was built"],
            ["problem", "Problem", "The challenge or pain point addressed"],
            ["approach", "Approach", "How you solved it—technical decisions, trade-offs"],
            ["outcome", "Outcome", "Results, metrics, what was achieved"],
            ["notes", "Notes (optional)", "Additional thoughts, learnings, or caveats"],
          ] as const).map(([key, label, placeholder]) => (
            <Field key={key} label={label}>
              <textarea
                value={contentForm[key]}
                onChange={(e) => setContentForm((f) => ({ ...f, [key]: e.target.value }))}
                rows={6}
                className="input-base resize-y"
                placeholder={placeholder}
              />
            </Field>
          ))}
        </div>
      )}

      {/* Tab: Images */}
      {activeTab === "images" && (
        <div className="max-w-2xl">
          {!isEditing && (
            <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 font-inter text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
              Save the project on the Basic Info tab first, then come back to upload images.
            </div>
          )}

          {isEditing && (
            <>
              {/* Upload zone */}
              <label className="mb-6 flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed border-border p-10 transition-colors hover:border-purple-300 hover:bg-purple-50/30 dark:hover:border-purple-700">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-inter text-sm font-medium text-foreground">
                    {uploading ? "Uploading…" : "Click to upload images"}
                  </p>
                  <p className="font-inter text-xs text-muted-foreground">
                    PNG, JPG, WebP up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  disabled={uploading}
                />
              </label>

              {/* Image grid */}
              {images.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {images.map((img) => (
                    <div key={img.id} className="group relative overflow-hidden rounded-md border border-border bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.imageUrl}
                        alt={img.caption || "Project image"}
                        className="aspect-video w-full object-cover"
                      />
                      <button
                        onClick={() => handleDeleteImage(img)}
                        className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      {img.caption && (
                        <p className="p-2 font-inter text-xs text-muted-foreground">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Styles */}
      <style jsx global>{`
        .input-base {
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid hsl(var(--input));
          background: hsl(var(--background));
          padding: 0.625rem 0.75rem;
          font-family: var(--font-inter);
          font-size: 0.875rem;
          color: hsl(var(--foreground));
          outline: none;
          transition: border-color 0.15s;
        }
        .input-base::placeholder {
          color: hsl(var(--muted-foreground));
        }
        .input-base:focus {
          border-color: hsl(262 80% 58% / 0.7);
          box-shadow: 0 0 0 3px hsl(262 80% 58% / 0.1);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="font-inter text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
        {hint && <span className="font-inter text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
