import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(date: Date | { toDate(): Date }): string {
  const d = "toDate" in date ? date.toDate() : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "…";
}

// ─── Serialization ────────────────────────────────────────────────────────────

/**
 * Convert a Firestore Timestamp or Date to an ISO string.
 * Handles both Firestore Timestamp objects (with toDate method) and regular Date objects.
 */
export function serializeTimestamp(timestamp: any): string {
  if (!timestamp) return "";
  if (typeof timestamp.toDate === "function") {
    return timestamp.toDate().toISOString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  return "";
}
