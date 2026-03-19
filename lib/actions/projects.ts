"use server";

import { put, del } from "@vercel/blob";
import admin from "firebase-admin";
import { revalidatePath } from "next/cache";
import type { 
  ActionResult, 
  ProjectFormData, 
  ProjectContentFormData 
} from "@/types";

import fs from "fs";
import path from "path";

// Initialize Firebase Admin
if (!admin.apps.length) {
  let serviceAccount;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } else {
    // Fallback for local development
    const saPath = path.join(process.cwd(), "serviceAccountKey.json");
    if (fs.existsSync(saPath)) {
      serviceAccount = JSON.parse(fs.readFileSync(saPath, "utf8"));
    }
  }

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}

const db = admin.firestore();

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function createProject(
  data: ProjectFormData,
  content: ProjectContentFormData
): Promise<ActionResult<{ id: string }>> {
  try {
    // Check slug uniqueness
    const existing = await db.collection("projects").where("slug", "==", data.slug).limit(1).get();
    if (!existing.empty) {
      return { success: false, error: "A project with this slug already exists." };
    }

    // Create project
    const projectRef = await db.collection("projects").add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Create content
    await db.collection("project_content").add({
      projectId: projectRef.id,
      ...content,
    });

    revalidatePath("/admin/projects");
    revalidatePath("/");
    
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
    await db.collection("projects").doc(id).update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Upsert content
    const snap = await db.collection("project_content").where("projectId", "==", id).limit(1).get();

    if (snap.empty) {
      await db.collection("project_content").add({
        projectId: id,
        ...content,
      });
    } else {
      await snap.docs[0].ref.update({ ...content });
    }

    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath(`/projects/${data.slug}`);
    
    return { success: true };
  } catch (err) {
    console.error("updateProject error:", err);
    return { success: false, error: "Failed to update project." };
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    // 1. Get project for slug (for revalidation)
    const projectDoc = await db.collection("projects").doc(id).get();
    const slug = projectDoc.data()?.slug;

    // 2. Delete project and content
    await db.collection("projects").doc(id).delete();
    
    const contentSnap = await db.collection("project_content").where("projectId", "==", id).get();
    await Promise.all(contentSnap.docs.map((d) => d.ref.delete()));

    // 3. Delete images from Firestore and Vercel Blob
    const imagesSnap = await db.collection("project_images").where("projectId", "==", id).get();
    
    for (const d of imagesSnap.docs) {
      const imgData = d.data();
      if (imgData.imageUrl) {
        await del(imgData.imageUrl);
      }
      await d.ref.delete();
    }

    revalidatePath("/admin/projects");
    if (slug) revalidatePath(`/projects/${slug}`);
    
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

    // 1. Upload to Vercel Blob
    const blob = await put(`projects/${projectId}/${Date.now()}-${file.name}`, file, {
      access: "public",
    });

    // 2. Save to Firestore
    const docRef = await db.collection("project_images").add({
      projectId,
      imageUrl: blob.url,
      caption: caption ?? "",
      order,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { 
      success: true, 
      data: { id: docRef.id, imageUrl: blob.url } 
    };
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
    await db.collection("project_images").doc(imageId).delete();
    await del(imageUrl);
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
    await db.collection("project_images").doc(imageId).update({ order });
    return { success: true };
  } catch (err) {
    console.error("updateImageOrder error:", err);
    return { success: false, error: "Failed to update image order." };
  }
}
