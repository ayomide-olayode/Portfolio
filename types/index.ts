import { Timestamp } from "firebase/firestore";

// ─── Firestore Models ────────────────────────────────────────────────────────

export interface AdminUser {
  email: string;
  createdAt: Timestamp;
  role: "admin";
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  stack: string[];
  live_url?: string;
  github_url?: string;
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProjectContent {
  id: string;
  projectId: string;
  context: string;
  problem: string;
  approach: string;
  outcome: string;
  notes?: string;
}

export interface ProjectImage {
  id: string;
  projectId: string;
  imageUrl: string;
  caption?: string;
  order: number;
  createdAt: Timestamp;
}

export interface SiteLink {
  id: string; // 'github' | 'linkedin' | 'cv'
  url: string;
  label?: string;
  updatedAt: Timestamp;
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export interface ProjectFormData {
  title: string;
  slug: string;
  summary: string;
  stack: string[];
  live_url: string;
  github_url: string;
  featured: boolean;
}

export interface ProjectContentFormData {
  context: string;
  problem: string;
  approach: string;
  outcome: string;
  notes: string;
}

export interface SiteLinkFormData {
  github: string;
  linkedin: string;
  cv: string;
}

// ─── Component Props ──────────────────────────────────────────────────────────

export interface ProjectWithContent extends Project {
  content?: ProjectContent;
  images?: ProjectImage[];
}

// ─── Action Results ───────────────────────────────────────────────────────────

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
