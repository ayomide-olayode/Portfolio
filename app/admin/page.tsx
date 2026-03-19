"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { FolderKanban, Star, Link2, ArrowRight, Plus } from "lucide-react";

interface Stats {
  totalProjects: number;
  featuredProjects: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const [allSnap, featuredSnap] = await Promise.all([
          getDocs(collection(db, "projects")),
          getDocs(query(collection(db, "projects"), where("featured", "==", true))),
        ]);
        setStats({
          totalProjects: allSnap.size,
          featuredProjects: featuredSnap.size,
        });
      } catch {
        setStats({ totalProjects: 0, featuredProjects: 0 });
      }
    }
    loadStats();
  }, []);

  const cards = [
    {
      label: "Total Projects",
      value: stats?.totalProjects ?? "—",
      icon: FolderKanban,
      href: "/admin/projects",
    },
    {
      label: "Featured",
      value: stats?.featuredProjects ?? "—",
      icon: Star,
      href: "/admin/projects",
    },
  ];

  const quickLinks = [
    { label: "New Project", href: "/admin/projects/new", icon: Plus },
    { label: "Manage Projects", href: "/admin/projects", icon: FolderKanban },
    { label: "Site Links", href: "/admin/site-links", icon: Link2 },
    { label: "View Portfolio", href: "/", icon: ArrowRight },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-sora text-2xl font-700 text-foreground">Dashboard</h1>
        <p className="mt-1 font-inter text-sm text-muted-foreground">
          Manage your portfolio content
        </p>
      </div>

      <div className="mb-10 grid gap-6 sm:grid-cols-2">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group flex flex-col justify-between rounded-2xl border border-border/50 bg-card/30 p-8 transition-all duration-300 hover:bg-card/60 hover:border-purple-500/30 hover:shadow-[0_4px_20px_rgba(124,58,237,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(124,58,237,0.2)]">
                <Icon className="h-4 w-4 text-purple-400" />
              </div>
            </div>
            <p className="font-sora text-5xl font-bold text-foreground drop-shadow-sm">{value}</p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="group flex items-center justify-between rounded-xl border border-border/50 bg-card/10 px-5 py-4 font-inter text-sm font-medium text-foreground transition-all hover:bg-card/40 hover:border-border"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-purple-400" />
                {label}
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
