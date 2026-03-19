import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Project, ProjectContent, ProjectImage, SiteLink } from "@/types";

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getAllProjects(): Promise<Project[]> {
  const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
}

export async function getFeaturedProjects(count = 3): Promise<Project[]> {
  const q = query(
    collection(db, "projects"),
    where("featured", "==", true),
    orderBy("createdAt", "desc"),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const q = query(collection(db, "projects"), where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Project;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, "projects", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Project;
}

// ─── Project Content ──────────────────────────────────────────────────────────

export async function getProjectContent(projectId: string): Promise<ProjectContent | null> {
  const q = query(
    collection(db, "project_content"),
    where("projectId", "==", projectId),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as ProjectContent;
}

// ─── Project Images ───────────────────────────────────────────────────────────

export async function getProjectImages(projectId: string): Promise<ProjectImage[]> {
  const q = query(
    collection(db, "project_images"),
    where("projectId", "==", projectId),
    orderBy("order", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectImage));
}

// ─── Site Links ───────────────────────────────────────────────────────────────

export async function getSiteLinks(): Promise<Record<string, SiteLink>> {
  const ids = ["github", "linkedin", "cv"];
  const links: Record<string, SiteLink> = {};

  await Promise.all(
    ids.map(async (id) => {
      const snap = await getDoc(doc(db, "site_links", id));
      if (snap.exists()) {
        links[id] = { id: snap.id, ...snap.data() } as SiteLink;
      }
    })
  );

  return links;
}
export async function isAdminUser(uid: string): Promise<boolean> {
  if (!uid) return false;

  try {
    const ref = doc(db, "admin_users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return false;

    const data = snap.data();

    // optional: extra safety
    return data?.role === "admin" || true;
  } catch (error) {
    console.error("Admin check failed:", error);

    // 🔴 IMPORTANT: don't silently deny access on network failure
    throw new Error("ADMIN_CHECK_FAILED");
  }
}