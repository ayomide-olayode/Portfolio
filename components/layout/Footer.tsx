import Link from "next/link";
import { Github, Linkedin, FileText } from "lucide-react";
import { getSiteLinks } from "@/lib/queries";

export default async function Footer() {
  let links: Record<string, { url: string }> = {};
  try {
    links = await getSiteLinks();
  } catch {
    // Silently fail if Firebase not configured
  }

  return (
    <footer className="border-t border-border/60 py-10">
      <div className="max-container section-padding py-0 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground font-inter">
          © {new Date().getFullYear()} Ayomide Olayode. Built with Next.js & TypeScript.
        </p>

        <div className="flex items-center gap-4">
          {links.github?.url && (
            <Link
              href={links.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </Link>
          )}
          {links.linkedin?.url && (
            <Link
              href={links.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
          )}
          {links.cv?.url && (
            <Link
              href={links.cv.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Download CV"
            >
              <FileText className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
