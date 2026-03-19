import type { Metadata } from "next";
import Link from "next/link";
import { Github, Linkedin, FileText, Mail } from "lucide-react";
import { getSiteLinks } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with me for work inquiries, collaborations, or just to say hello.",
};

export const revalidate = 60;

export default async function ContactPage() {
  let links: Record<string, { url: string; label?: string }> = {};
  try {
    links = await getSiteLinks();
  } catch {
    // Firebase not configured
  }

  const contactItems = [
    {
      id: "email",
      icon: Mail,
      label: "Email",
      value: "olayodea93@gmail.com",
      href: "mailto:olayodea93@gmail.com",
    },
    ...(links.github?.url
      ? [{ id: "github", icon: Github, label: "GitHub", value: "@ayomide-olayode", href: links.github.url }]
      : []),
    ...(links.linkedin?.url
      ? [{ id: "linkedin", icon: Linkedin, label: "LinkedIn", value: "Ayomide Olayode", href: links.linkedin.url }]
      : []),
    ...(links.cv?.url
      ? [{ id: "cv", icon: FileText, label: "Resume / CV", value: "Download PDF", href: links.cv.url }]
      : []),
  ];

  return (
    <div className="section-padding">
      <div className="max-container">
        {/* Header */}
        <div className="mb-16">
          <p className="mb-2 font-inter text-sm font-medium uppercase tracking-widest text-purple-600">
            Contact
          </p>
          <h1 className="mb-4 font-sora text-4xl font-700 tracking-tight text-foreground md:text-5xl">
            Get in touch
          </h1>
          <p className="max-w-lg font-inter text-base text-muted-foreground">
            I'm open to new opportunities, collaborations, and interesting conversations.
            The best way to reach me is via email.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr,1fr]">
          {/* Contact links */}
          <div>
            <h2 className="mb-6 font-sora text-lg font-600 text-foreground">
              Reach out
            </h2>
            <div className="space-y-4">
              {contactItems.map(({ id, icon: Icon, label, value, href }) => (
                <Link
                  key={id}
                  href={href}
                  target={id !== "email" ? "_blank" : undefined}
                  rel={id !== "email" ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:border-purple-300 hover:bg-purple-50/50 dark:hover:border-purple-700 dark:hover:bg-purple-950/20"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted transition-colors group-hover:border-purple-200 group-hover:bg-purple-100 dark:group-hover:border-purple-800 dark:group-hover:bg-purple-900/40">
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-purple-600" />
                  </div>
                  <div>
                    <p className="font-inter text-xs text-muted-foreground">{label}</p>
                    <p className="font-inter text-sm font-medium text-foreground">{value}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Message box */}
          <div>
            <h2 className="mb-6 font-sora text-lg font-600 text-foreground">
              Availability
            </h2>
            <div className="rounded-lg border border-border bg-muted/30 p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="font-inter text-sm font-medium text-foreground">
                  Available for work
                </span>
              </div>
              <p className="mb-6 font-inter text-sm leading-relaxed text-muted-foreground">
                I'm currently exploring new opportunities—contract, freelance, or
                full-time. I'm particularly interested in ambitious products where
                frontend craft matters.
              </p>
              <Link
                href="mailto:olayodea93@gmail.com"
                className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-purple-700"
              >
                <Mail className="h-4 w-4" />
                Send me an email
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
