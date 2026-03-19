"use client";

import { useEffect, useState } from "react";
import { getSiteLinks } from "@/lib/queries";
import { saveSiteLinks } from "@/lib/actions/admin";
import { Github, Linkedin, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SiteLinksPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    github: "",
    linkedin: "",
    cv: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const links = await getSiteLinks();
        setForm({
          github: links.github?.url ?? "",
          linkedin: links.linkedin?.url ?? "",
          cv: links.cv?.url ?? "",
        });
      } catch {
        // OK if not set yet
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const result = await saveSiteLinks(form);
    if (result.success) {
      toast.success("Links saved.");
    } else {
      toast.error(result.error ?? "Failed to save.");
    }
    setSaving(false);
  };

  const fields = [
    { id: "github" as const, label: "GitHub", icon: Github, placeholder: "https://github.com/yourusername" },
    { id: "linkedin" as const, label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/yourprofile" },
    { id: "cv" as const, label: "Resume / CV", icon: FileText, placeholder: "https://example.com/resume.pdf" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-sora text-2xl font-700 text-foreground">Site Links</h1>
        <p className="mt-1 font-inter text-sm text-muted-foreground">
          These links appear in the header, footer, and contact page.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-purple-600" />
        </div>
      ) : (
        <div className="max-w-lg space-y-6">
          {fields.map(({ id, label, icon: Icon, placeholder }) => (
            <div key={id}>
              <label className="mb-1.5 flex items-center gap-2 font-inter text-sm font-medium text-foreground">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {label}
              </label>
              <input
                type="url"
                value={form[id]}
                onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                placeholder={placeholder}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 font-inter text-sm text-foreground placeholder-muted-foreground focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
              />
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving…" : "Save Links"}
          </button>
        </div>
      )}
    </div>
  );
}
