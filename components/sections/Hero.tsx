"use client";

import Link from "next/link";
import { ArrowRight, Github, FileText, Terminal } from "lucide-react";
import type { SiteLink } from "@/types";
import { motion, Variants } from "framer-motion";

interface HeroProps {
  links: Record<string, SiteLink>;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero({ links }: HeroProps) {
  return (
    <section className="relative section-padding  flex flex-col overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        className="max-container relative z-10 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Status Window / Badge */}
        <motion.div variants={itemVariants} className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 shadow-[0_0_15px_rgba(124,58,237,0.15)]">
          <Terminal className="h-4 w-4 text-purple-400" />
          <span className="font-mono text-xs font-semibold tracking-wide text-purple-300">
            SYSTEM.STATUS === 'AVAILABLE'
          </span>
          <span className="relative flex h-2 w-2 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={itemVariants} className="font-sora text-5xl font-bold leading-[1.1] tracking-tighter text-foreground md:text-7xl lg:text-8xl drop-shadow-sm">
          Ayomide Olayode
        </motion.h1>

        <motion.div variants={itemVariants} className="mt-4 flex flex-wrap items-center gap-4 md:mt-6">
          <span className="font-sora text-xl font-medium text-purple-400 md:text-2xl drop-shadow-[0_0_12px_rgba(124,58,237,0.6)]">
            Frontend Engineer
          </span>
          <span className="hidden h-px flex-1 max-w-[40px] bg-border md:block" />
          <span className="font-mono text-sm text-muted-foreground/80 md:block tracking-tight">
            {"{ React, TypeScript, Next.js }"}
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.p variants={itemVariants} className="mt-6 max-w-2xl font-inter text-base leading-relaxed text-muted-foreground md:text-lg md:leading-loose">
          Build. Optimize. Scale. Focused on structured, performant web applications and clean, maintainable code. Breathing life into designs with modern tech stacks.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/projects"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <span className="relative z-10 flex items-center gap-2">
              View Projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-purple-600 to-purple-400 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>

          {links.github?.url && (
            <Link
              href={links.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-purple-500/20 bg-background/50 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-purple-500/50 hover:bg-purple-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              <Github className="h-4 w-4 text-purple-400" />
              GitHub
            </Link>
          )}

          {links.cv?.url && (
            <Link
              href={links.cv.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-purple-500/20 bg-background/50 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-purple-500/50 hover:bg-purple-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              <FileText className="h-4 w-4 text-purple-400" />
              Resume
            </Link>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
