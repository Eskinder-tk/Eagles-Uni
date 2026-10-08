"use server";

import { put } from "@vercel/blob";
import { fileTypeFromBlob } from "file-type";
import { db } from "@/db";
import { admissionsTable, usersTable, coursesTable, userCoursesTable, instructors, instructorCourses } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcrypt";
import { createSession } from '@/lib/session';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}


const MAX_FILE_SIZE = 4.5 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function Login (id: string, password: string) {
  if (id.includes("EUI")) {
    const instructor = await db.query.instructors.findFirst({where: eq(instructors.instructorCode, id)})
    if (!instructor) {
      return {
        success: false,
        error: "Invalid Id!"
      }
    }

    const isValid = await bcrypt.compare(password, instructor.passwordHash)

    if (!isValid) {
      return {
        success: false,
        error: "Incorrect Password!"
      }
    }

    return {
      success: true,
      instructor: instructor
    }
  }

  if (id.includes("EUU")){
    const student = await db.query.usersTable.findFirst({where: eq(usersTable.userCode, id)})

    if (!student) {
      return {
        success: false,
        error: "Invalid Id!"
      }
    }

    const isValid = await bcrypt.compare(password, student.passwordHash)

    if (!isValid) {
      return {
        success: false,
        error: "Incorrect Password!"
      }
    }
    await createSession(String(student.id));

    return {
      success: true,
      student: student
    }
  }

  return {
    success: false,
    error: "Invalid Id!"
  }

}

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

export async function getAdmissionStatus(
  email: string,
  admissionId: string
) {
  try {
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedAdmissionId = admissionId.trim();

    // Check if admissionId is a valid UUID format (if your DB column is type UUID)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(sanitizedAdmissionId)) {
      return {
        success: false,
        error: "Invalid Admission ID format.",
      };
    }

    const admission = await db
      .select({
        admissionId: admissionsTable.admissionId,
        name: admissionsTable.name,
        status: admissionsTable.status,
        createdAt: admissionsTable.createdAt,
      })
      .from(admissionsTable)
      .where(
        and(
          eq(admissionsTable.email, sanitizedEmail),
          eq(admissionsTable.admissionId, sanitizedAdmissionId)
        )
      )
      .limit(1);

    if (admission.length === 0) {
      return {
        success: false,
        error: "No admission found with those details.",
      };
    }

    return {
      success: true,
      admission: admission[0],
    };
  } catch (error) {
    console.error("Error in getAdmissionStatus:", error);
    return {
      success: false,
      error: "Something went wrong on the server. Please try again later.",
    };
  }
}

export async function createAdmission(data: {
  name: string;
  email: string;
  age: number;
  phone: string;
  imageUrl: string;
}): Promise<
  | { success: true; admissionId: string }
  | { success: false; error: string }
> {
  const email = data.email.trim();

  const sameUser = await db.query.admissionsTable.findFirst({
    where: eq(admissionsTable.email, email),
  });

  if (sameUser) {
    return {
      success: false,
      error: "This email has already been used for an admission.",
    };
  }

  const [admission] = await db
    .insert(admissionsTable)
    .values({
      ...data,
      email,
    })
    .returning({
      admissionId: admissionsTable.admissionId,
    });

  if (!admission) {
    return {
      success: false,
      error: "Unable to create admission. Please try again.",
    };
  }

  return {
    success: true,
    admissionId: admission.admissionId,
  };
}