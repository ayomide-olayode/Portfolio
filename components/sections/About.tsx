export default function About() {
  return (
    <section className="section-padding border-t border-border/60">
      <div className="max-container">
        <div className="grid gap-12 lg:grid-cols-[1fr,2fr]">
          <div>
            <p className="mb-2 font-inter text-sm font-medium uppercase tracking-widest text-purple-600">
              About
            </p>
            <h2 className="font-sora text-3xl font-600 tracking-tight text-foreground md:text-4xl">
              A bit about me
            </h2>
          </div>

          <div className="space-y-5">
            <p className="font-inter text-base leading-relaxed text-muted-foreground">
             I’m a frontend engineer with 3+ years of experience building production-ready web applications. I write code that’s clean, maintainable, and optimized for performance, with a focus on structure and developer experience.
            </p>
            <p className="font-inter text-base leading-relaxed text-muted-foreground">
             I collaborate closely with designers to turn concepts into pixel-perfect, accessible interfaces while keeping scalability and efficiency front of mind.
            </p>
            <p className="font-inter text-base leading-relaxed text-muted-foreground">
              Outside work, I contribute to open source, explore frontend patterns, and pay attention to typography. For me, software is ultimately about the people who use it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
