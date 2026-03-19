"use client";

import { Layers, Code2, Zap, Users } from "lucide-react";
import { motion, Variants } from "framer-motion";

const items = [
  {
    icon: Code2,
    title: "Clean Architecture",
    description:
      "Build responsive, maintainable web applications with clear separation of concerns and scalable patterns.",
  },
  {
    icon: Zap,
    title: "Performance First",
    description:
      "Optimize for Core Web Vitals from the start—code splitting, lazy loading, and efficient rendering strategies.",
  },
  {
    icon: Layers,
    title: "Component Design",
    description:
      "Create reusable, accessible component libraries that teams can confidently build upon.",
  },
  {
    icon: Users,
    title: "Developer Experience",
    description:
      "Write code that's easy to read, test, and extend—because the next developer matters as much as the end user.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function WhatIDo() {
  return (
    <section className="section-padding border-t border-border/40 relative overflow-hidden">
      {/* Background flair */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-container relative z-10">
        <div className="mb-16">
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-3 font-mono text-sm font-semibold tracking-widest text-purple-500"
          >
            // EXPERTISE
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sora text-3xl font-bold tracking-tight text-foreground md:text-5xl"
          >
            What I Do
          </motion.h2>
        </div>

        <motion.div 
          className="grid gap-6 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {items.map(({ icon: Icon, title, description }, i) => {
            // Bento sizing
            const isWide = i === 0 || i === 3;
            
            return (
              <motion.div 
                key={title} 
                variants={cardVariants}
                className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-8 backdrop-blur-sm transition-colors hover:bg-card/60 hover:border-purple-500/30 ${isWide ? "md:col-span-2" : "md:col-span-1"}`}
              >
                {/* Subtle gradient hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-6 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400 shadow-[0_0_15px_rgba(124,58,237,0.1)] transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.2)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="mt-auto">
                    <h3 className="mb-3 font-sora text-xl font-semibold text-foreground tracking-tight">
                      {title}
                    </h3>
                    <p className="font-inter text-sm leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
