"use server";

import { put } from "@vercel/blob";
import { fileTypeFromBlob } from "file-type";
import { db } from "@/db";
import { admissionsTable } from "@/db/schema";

const MAX_FILE_SIZE = 4.5 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function uploadToVercelBlob(formData: FormData) {
  const file = formData.get("file");

  // 1. Make sure a real File was supplied
  if (!(file instanceof File)) {
    throw new Error("No valid file provided.");
  }

  // 2. Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image must be smaller than 4.5MB.");
  }

  // 3. Detect the REAL file type from its contents
  const detectedType = await fileTypeFromBlob(file);

  if (!detectedType) {
    throw new Error("Could not determine the file type.");
  }

  // 4. Only allow actual JPEG, PNG, or WEBP files
  if (!ACCEPTED_IMAGE_TYPES.includes(detectedType.mime)) {
    throw new Error("Only JPG, PNG, and WEBP images are allowed.");
  }

  // 5. Generate our own filename
  const filename = `profiles/${crypto.randomUUID()}.${detectedType.ext}`;

  // 6. Upload the validated file
  const blob = await put(filename, file, {
    access: "public",
  });

  return blob.url;
}


export async function createAdmission(data: {
    name: string;
    email: string;
    age: number;
    phone: string;
    imageUrl: string;
  }) {
    const [admission] = await db
      .insert(admissionsTable)
      .values({
        name: data.name,
        email: data.email,
        age: data.age,
        phone: data.phone,
        imageUrl: data.imageUrl,
      })
      .returning({
        admissionId: admissionsTable.admissionId,
      });

    return admission.admissionId;
  }