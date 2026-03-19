"use server";

import admin from "firebase-admin";
import { revalidatePath } from "next/cache";
import type { ActionResult, SiteLinkFormData } from "@/types";

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

export async function saveSiteLinks(data: SiteLinkFormData): Promise<ActionResult> {
  try {
    const entries = [
      { id: "github", url: data.github, label: "GitHub" },
      { id: "linkedin", url: data.linkedin, label: "LinkedIn" },
      { id: "cv", url: data.cv, label: "CV" },
    ];

    await Promise.all(
      entries.map(({ id, url, label }) =>
        db.collection("site_links").doc(id).set(
          { url, label, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
          { merge: true }
        )
      )
    );

    revalidatePath("/admin/site-links");
    revalidatePath("/contact");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("saveSiteLinks error:", err);
    return { success: false, error: "Failed to save site links." };
  }
}
