"use client";

import { motion, Variants } from "framer-motion";
import { 
  Terminal, 
  Layers, 
  Paintbrush, 
  Database, 
  Wrench, 
  Figma 
} from "lucide-react";

// Stack definitions with corresponding icons
const stack = [
  { category: "Core", icon: Terminal, items: ["TypeScript", "JavaScript", "HTML5", "CSS3"] },
  { category: "Frameworks", icon: Layers, items: ["React", "Next.js", "Vue 3", "Remix"] },
  { category: "Styling", icon: Paintbrush, items: ["Tailwind CSS", "CSS Modules", "Framer Motion", "shadcn/ui"] },
  { category: "Backend / Infra", icon: Database, items: ["Node.js", "Firebase", "Supabase", "Vercel"] },
  { category: "Tooling", icon: Wrench, items: ["Git", "Vite", "Webpack", "ESLint"] },
  { category: "Design", icon: Figma, items: ["Figma", "Storybook", "Chromatic", "Accessibility"] },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function TechStack() {
  return (
    <section className="relative section-padding border-t border-border/40 overflow-hidden">
      {/* Background flair */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-container relative z-10">
        <div className="mb-16">
          <p className="mb-3 font-mono text-sm font-semibold uppercase tracking-widest text-purple-500">
            // ARSENAL
          </p>
          <h2 className="font-sora text-4xl font-bold tracking-tight text-foreground md:text-5xl drop-shadow-sm">
            Tech I Work With
          </h2>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {stack.map(({ category, items, icon: Icon }) => (
            <motion.div 
              key={category}
              variants={itemVariants}
              className="group relative flex flex-col rounded-2xl border border-border/50 bg-card/20 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:bg-card/40 hover:border-purple-500/30 hover:shadow-[0_4px_20px_rgba(124,58,237,0.05)]"
            >
              <div className="mb-8 flex items-center justify-between">
                <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-foreground">
                  {category}
                </h3>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(124,58,237,0.2)]">
                  <Icon className="h-4 w-4 text-purple-400" />
                </div>
              </div>
              
              <ul className="flex flex-wrap gap-2 mt-auto">
                {items.map((item) => (
                  <li 
                    key={item} 
                    className="rounded border border-border/50 bg-white/5 px-2.5 py-1 font-mono text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:border-purple-500/20 group-hover:bg-purple-500/5"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
