"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service in production
    if (process.env.NODE_ENV === "production") {
      console.error("Global error:", error.digest);
    }
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <h2 className="font-sora text-2xl font-700">Something went wrong</h2>
          <p className="font-inter text-sm text-gray-500">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            className="rounded-md bg-purple-600 px-5 py-2.5 font-inter text-sm font-medium text-white hover:bg-purple-700"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
