import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="section-padding border-t border-border/60">
      <div className="max-container">
        <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-background p-12 text-center dark:border-purple-800/50 dark:from-purple-950/30">
          <h2 className="mb-4 font-sora text-3xl font-700 tracking-tight text-foreground md:text-4xl">
            Let's build something great
          </h2>
          <p className="mb-8 font-inter text-base text-muted-foreground">
            I'm open to new opportunities—freelance, contract, or full-time.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            Get in touch
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
