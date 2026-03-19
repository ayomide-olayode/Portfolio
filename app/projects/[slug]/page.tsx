import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { getProjectBySlug, getProjectContent, getProjectImages } from "@/lib/queries";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await getProjectBySlug(slug);
    if (!project) return { title: "Project Not Found" };
    return {
      title: project.title,
      description: project.summary,
    };
  } catch {
    return { title: "Project" };
  }
}

export const revalidate = 60;

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  let project, content, images: any[];
  try {
    project = await getProjectBySlug(slug);
  } catch {
    notFound();
  }

  if (!project) notFound();

  try {
    [content, images] = await Promise.all([
      getProjectContent(project.id),
      getProjectImages(project.id),
    ]);
  } catch {
    content = null;
    images = [];
  }

  return (
    <div className="section-padding">
      <div className="max-container">
        {/* Back link */}
        <Link
          href="/projects"
          className="mb-12 inline-flex items-center gap-2 font-inter text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All projects
        </Link>

        {/* Hero */}
        <div className="mb-16">
          <h1 className="mb-4 font-sora text-4xl font-700 tracking-tight text-foreground md:text-5xl">
            {project.title}
          </h1>
          <p className="mb-8 max-w-2xl font-inter text-lg text-muted-foreground">
            {project.summary}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap gap-6">
            {/* Stack */}
            <div>
              <p className="mb-2 font-inter text-xs font-600 uppercase tracking-widest text-muted-foreground">
                Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-sm border border-border bg-muted px-2 py-0.5 font-mono text-xs text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex items-end gap-3">
              {project.live_url && (
                <Link
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 font-inter text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Live Demo
                </Link>
              )}
              {project.github_url && (
                <Link
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 font-inter text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Github className="h-3.5 w-3.5" />
                  GitHub
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-16 h-px w-full bg-border" />

        {/* Content sections */}
        {content && (
          <div className="grid gap-16 lg:grid-cols-[1fr,2fr]">
            {/* Sidebar navigation */}
            <div className="hidden lg:block">
              <nav className="sticky top-24 space-y-1">
                {[
                  { href: "#context", label: "Context" },
                  { href: "#problem", label: "Problem" },
                  { href: "#approach", label: "Approach" },
                  { href: "#outcome", label: "Outcome" },
                  ...(content.notes ? [{ href: "#notes", label: "Notes" }] : []),
                  ...(images && images.length > 0
                    ? [{ href: "#gallery", label: "Gallery" }]
                    : []),
                ].map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="block rounded-md px-3 py-1.5 font-inter text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Main content */}
            <div className="space-y-16">
              {content.context && (
                <ContentSection id="context" title="Context" body={content.context} />
              )}
              {content.problem && (
                <ContentSection id="problem" title="Problem" body={content.problem} />
              )}
              {content.approach && (
                <ContentSection id="approach" title="Approach" body={content.approach} />
              )}
              {content.outcome && (
                <ContentSection id="outcome" title="Outcome" body={content.outcome} />
              )}
              {content.notes && (
                <ContentSection id="notes" title="Notes" body={content.notes} />
              )}
            </div>
          </div>
        )}

        {/* Image gallery */}
        {images && images.length > 0 && (
          <div id="gallery" className="mt-16">
            <div className="mb-8 h-px w-full bg-border" />
            <h2 className="mb-8 font-sora text-2xl font-600 text-foreground">Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {images.map((img) => (
                <div key={img.id} className="group relative overflow-hidden rounded-md border border-border bg-muted">
                  <div className="relative aspect-video">
                    <Image
                      src={img.imageUrl}
                      alt={img.caption || project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  {img.caption && (
                    <p className="p-3 font-inter text-xs text-muted-foreground">
                      {img.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-20 border-t border-border pt-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-inter text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to all projects
          </Link>
        </div>
      </div>
    </div>
  );
}

function ContentSection({ id, title, body }: { id: string; title: string; body: string }) {
  return (
    <div id={id}>
      <h2 className="mb-4 font-sora text-2xl font-600 text-foreground">{title}</h2>
      <div className="prose-section space-y-4">
        {body.split("\n\n").map((para, i) => (
          <p key={i} className="font-inter text-base leading-relaxed text-muted-foreground">
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}
