"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import Image from "next/image";
import {
  LayoutDashboard,
  FolderKanban,
  Link2,
  LogOut,
  Code2,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/site-links", label: "Site Links", icon: Link2 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      try {
        const token = await user.getIdTokenResult();
        const admin = token.claims.admin === true;

        if (!admin) {
          await signOut(auth);
          document.cookie = "__session=; path=/; max-age=0";
          router.replace("/admin/login?error=unauthorized");
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      document.cookie = "__session=; path=/; max-age=0";
      router.push("/admin/login");
    } catch {
      toast.error("Failed to sign out.");
    }
  };

  // Don't wrap the login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-purple-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border/50 bg-card/30 backdrop-blur-md transition-transform duration-200 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border/50 px-6">
          <div className="flex items-center justify-center p-1.5">
           <Image src="/admin-logo.png" alt="Logo" width={40} height={40} className="drop-shadow-md object-contain" priority />
          </div>
          <span className="font-mono text-sm font-bold tracking-tight text-foreground uppercase">
            Admin.Panel
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-4">
          <p className="px-3 mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Navigation
          </p>
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 font-inter text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[inset_0_0_12px_rgba(124,58,237,0.05)]"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-[3px] rounded-r-full bg-purple-500 shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
                )}
                <Icon className={cn("h-4 w-4 transition-transform", active && "scale-110")} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="border-t border-border/50 p-4">
          <button
            onClick={handleSignOut}
            className="group flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 font-inter text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400"
          >
            <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-mono tracking-wide">Sign out</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-16 items-center gap-4 border-b border-border px-6 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-sora text-sm font-600 text-foreground">Admin</span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
