import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="section-padding flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="mb-4 font-mono text-6xl font-700 text-purple-600/20">404</p>
      <h1 className="mb-3 font-sora text-3xl font-700 text-foreground">Page not found</h1>
      <p className="mb-8 font-inter text-base text-muted-foreground">
        This page doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-inter text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back home
      </Link>
    </div>
  );
}
