"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Don't show public header in admin
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="relative w-full z-50">
      <div className="flex items-center justify-between px-6 py-4 lg:px-12 max-w-7xl mx-auto">
        {/* Logo - Aligned Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Link href="/" className="relative inline-block h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 transition-transform hover:scale-105 active:scale-95">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              fill 
              className="drop-shadow-md object-contain" 
              priority
            />
          </Link>
        </motion.div>

        {/* Desktop Nav - Hidden on Mobile */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden md:flex items-center px-2 py-1.5 sm:px-3 sm:py-2 border border-border/50 bg-card/30 backdrop-blur-md rounded-full shadow-sm"
        >
          <nav className="flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-colors rounded-full"
                >
                  <span className={cn(
                    "relative z-10 transition-colors duration-200 tracking-wide",
                    active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                  )}>
                    {label}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="header-active-tab"
                      className="absolute inset-0 rounded-full bg-muted/80 border border-border/50"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
            
            <div className="h-4 w-px bg-border/80 mx-1 sm:mx-2" />

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 sm:p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all flex items-center justify-center group"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 group-hover:rotate-45" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 group-hover:-rotate-12" />
            </button>
          </nav>
        </motion.div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all flex items-center justify-center"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="h-4 w-4 hidden dark:block" />
          </button>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background/80 backdrop-blur-lg overflow-hidden"
          >
            <nav className="flex flex-col p-6 gap-4">
              {navLinks.map(({ href, label }) => {
                const active = pathname === href || (href !== "/" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "text-lg font-medium transition-colors p-2 rounded-lg",
                      active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
