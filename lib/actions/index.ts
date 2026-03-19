"use server";

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  limit,
  getDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase/client";
import type {
  ActionResult,
  ProjectFormData,
  ProjectContentFormData,
  SiteLinkFormData,
} from "@/types";

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function createProject(
  data: ProjectFormData,
  content: ProjectContentFormData
): Promise<ActionResult<{ id: string }>> {
  try {
    // Check slug uniqueness
    const slugCheck = query(
      collection(db, "projects"),
      where("slug", "==", data.slug),
      limit(1)
    );
    const existing = await getDocs(slugCheck);
    if (!existing.empty) {
      return { success: false, error: "A project with this slug already exists." };
    }

    // Create project
    const projectRef = await addDoc(collection(db, "projects"), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Create content
    await addDoc(collection(db, "project_content"), {
      projectId: projectRef.id,
      ...content,
    });

    return { success: true, data: { id: projectRef.id } };
  } catch (err) {
    console.error("createProject error:", err);
    return { success: false, error: "Failed to create project." };
  }
}

export async function updateProject(
  id: string,
  data: ProjectFormData,
  content: ProjectContentFormData
): Promise<ActionResult> {
  try {
    // Update project
    await updateDoc(doc(db, "projects", id), {
      ...data,
      updatedAt: serverTimestamp(),
    });

    // Upsert content
    const q = query(
      collection(db, "project_content"),
      where("projectId", "==", id),
      limit(1)
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      await addDoc(collection(db, "project_content"), {
        projectId: id,
        ...content,
      });
    } else {
      await updateDoc(snap.docs[0].ref, { ...content });
    }

    return { success: true };
  } catch (err) {
    console.error("updateProject error:", err);
    return { success: false, error: "Failed to update project." };
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    // Delete project
    await deleteDoc(doc(db, "projects", id));

    // Delete content
    const contentQ = query(
      collection(db, "project_content"),
      where("projectId", "==", id)
    );
    const contentSnap = await getDocs(contentQ);
    await Promise.all(contentSnap.docs.map((d) => deleteDoc(d.ref)));

    // Delete images
    const imagesQ = query(
      collection(db, "project_images"),
      where("projectId", "==", id)
    );
    const imagesSnap = await getDocs(imagesQ);
    await Promise.all(imagesSnap.docs.map((d) => deleteDoc(d.ref)));

    return { success: true };
  } catch (err) {
    console.error("deleteProject error:", err);
    return { success: false, error: "Failed to delete project." };
  }
}

// ─── Images ───────────────────────────────────────────────────────────────────

export async function uploadProjectImage(
  projectId: string,
  formData: FormData,
  order: number,
  caption?: string
): Promise<ActionResult<{ id: string; imageUrl: string }>> {
  try {
    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No file provided." };

    const fileName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `projects/${projectId}/images/${fileName}`);
    const bytes = await file.arrayBuffer();
    await uploadBytes(storageRef, bytes, { contentType: file.type });
    const imageUrl = await getDownloadURL(storageRef);

    const docRef = await addDoc(collection(db, "project_images"), {
      projectId,
      imageUrl,
      caption: caption ?? "",
      order,
      createdAt: serverTimestamp(),
    });

    return { success: true, data: { id: docRef.id, imageUrl } };
  } catch (err) {
    console.error("uploadProjectImage error:", err);
    return { success: false, error: "Failed to upload image." };
  }
}

export async function deleteProjectImage(
  imageId: string,
  imageUrl: string
): Promise<ActionResult> {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, "project_images", imageId));

    // Delete from Storage
    try {
      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);
    } catch {
      // File may not exist in storage; ignore
    }

    return { success: true };
  } catch (err) {
    console.error("deleteProjectImage error:", err);
    return { success: false, error: "Failed to delete image." };
  }
}

export async function updateImageOrder(
  imageId: string,
  order: number
): Promise<ActionResult> {
  try {
    await updateDoc(doc(db, "project_images", imageId), { order });
    return { success: true };
  } catch (err) {
    console.error("updateImageOrder error:", err);
    return { success: false, error: "Failed to update image order." };
  }
}

// ─── Site Links ───────────────────────────────────────────────────────────────

export async function saveSiteLinks(data: SiteLinkFormData): Promise<ActionResult> {
  try {
    const entries = [
      { id: "github", url: data.github, label: "GitHub" },
      { id: "linkedin", url: data.linkedin, label: "LinkedIn" },
      { id: "cv", url: data.cv, label: "CV" },
    ];

    await Promise.all(
      entries.map(({ id, url, label }) =>
        setDoc(
          doc(db, "site_links", id),
          { url, label, updatedAt: serverTimestamp() },
          { merge: true }
        )
      )
    );

    return { success: true };
  } catch (err) {
    console.error("saveSiteLinks error:", err);
    return { success: false, error: "Failed to save site links." };
  }
}
