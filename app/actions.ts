"use server";

import { del, put } from "@vercel/blob";
import { fileTypeFromBlob } from "file-type";
import { db } from "@/db";
import { admissionsTable, usersTable, coursesTable, userCoursesTable, instructors, instructorCourses } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import bcrypt, { hash } from "bcrypt";
import { createSession, deleteSession, verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import z from "zod";



export async function logoutAction() {
  await deleteSession();
  redirect('/');
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}


const MAX_FILE_SIZE = 1 * 1024 * 1024;

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

    await createSession({ role: "instructor", id: instructor.id });

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
    await createSession({ role: "user", id: student.id });

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






const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  age: z.coerce.number().min(16, "Age must be at least 16.").max(120, "Please enter a valid age."),
  phone: z.string().min(7, "Invalid phone number.").regex(/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, "Invalid phone number format."),
  image: z.string(),
  year: z.coerce.number().int().min(1, "Year must be at least 1"),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .refine(
      (password) => Buffer.byteLength(password, "utf8") <= 72,
      "Password must not exceed 72 bytes"
    ),
});

export async function createUser(input: unknown) {
  // 1. Validate the input on the server
  const result = createUserSchema.safeParse(input);

  if (!result.success) {
  console.error("Validation errors:", result.error.issues);

  return {
    success: false as const,
    error: result.error.issues
      .map((issue) => {
        const field = issue.path.join(".") || "input";
        return `${field}: ${issue.message}`;
      })
      .join("; "),
  };
}

  const data = result.data;

  try {
    // 2. Check whether the email is already registered
    const existingUser = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, data.email))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        success: false as const,
        error: "An account with this email already exists.",
      };
    }

    // 3. Hash the password before storing it
    const passwordHash = await hash(data.password, 12);

    // 4. Create the user
    const [user] = await db
      .insert(usersTable)
      .values({
        name: data.name,
        age: data.age,
        email: data.email,
        phone: data.phone?.trim() || null,
        profileUrl: data.image || null,
        year: data.year,
        passwordHash,
      })
      .returning({
        id: usersTable.id,
        userCode: usersTable.userCode,
        name: usersTable.name,
        age: usersTable.age,
        email: usersTable.email,
        phone: usersTable.phone,
        profileUrl: usersTable.profileUrl,
        year: usersTable.year,
      });

    // 5. Return safe user data, never the password hash
    return {
      success: true as const,
      user,
    };
  } catch (error) {
    const dbError = error as {
      code?: string;
      constraint?: string;
    };

    // Handle unique-constraint violations, including concurrent requests
    if (dbError.code === "23505") {
      if (dbError.constraint?.includes("email")) {
        return {
          success: false as const,
          error: "An account with this email already exists.",
        };
      }

      return {
        success: false as const,
        error: "A user with one of these unique values already exists.",
      };
    }

    // Log the details on the server, not to the client
    console.error("Failed to create user:", error);

    return {
      success: false as const,
      error: "Could not create the user. Please try again.",
    };
  }
}












const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(150),
  email: z
    .string()
    .trim()
    .email()
    .max(254),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine(
      (phone) => phone === "" || /^[+0-9()\s-]+$/.test(phone),
      "Enter a valid phone number."
    )
    .transform((phone) => phone || null),
});

function isUniqueConstraintError(error: unknown): boolean {
  let current: unknown = error;

  while (current && typeof current === "object") {
    if ("code" in current && current.code === "23505") {
      return true;
    }

    current = "cause" in current ? current.cause : undefined;
  }

  return false;
}

async function deleteOldProfileImage(url: string | null) {
  if (!url) return;

  try {
    const parsedUrl = new URL(url);

    // Only attempt cleanup for URLs belonging to Vercel Blob.
    if (
      parsedUrl.protocol === "https:" &&
      parsedUrl.hostname.endsWith(
        ".public.blob.vercel-storage.com"
      )
    ) {
      await del(url);
    }
  } catch (error) {
    // The profile update may already have succeeded.
    console.error("Failed to delete old profile image:", error);
  }
}

export async function updateStudentProfile(formData: FormData) {
  let newBlobUrl: string | null = null;
  let databaseUpdated = false;

  try {
    // 1. Authenticate the current student.
    const session = await verifySession();
    const userId = session?.account?.id;

    if (!session || session.role !== "user" || !userId) {
      return {
        success: false,
        message: "You must be signed in as a student.",
      };
    }

    // 2. Validate the submitted text fields.
    const parsed = profileSchema.safeParse({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone") ?? "",
    });

    if (!parsed.success) {
      return {
        success: false,
        message:
          parsed.error.issues[0]?.message ??
          "Please check your profile information.",
      };
    }

    const { fullName, email, phone } = parsed.data;

    // 3. Retrieve the current student's record.
    const [currentStudent] = await db
      .select({
        id: usersTable.id,
        profileUrl: usersTable.profileUrl,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!currentStudent) {
      return {
        success: false,
        message: "Student account not found.",
      };
    }

    // 4. Check whether another student uses this email.
    const [existingEmail] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.email, email),
          ne(usersTable.id, userId)
        )
      )
      .limit(1);

    if (existingEmail) {
      return {
        success: false,
        message: "This email address is already in use.",
      };
    }

    // 5. Read the submitted profile image.
    const imageEntry = formData.get("profileImage");

    if (imageEntry !== null && !(imageEntry instanceof File)) {
      return {
        success: false,
        message: "Invalid profile image.",
      };
    }

    const imageFile =
      imageEntry instanceof File ? imageEntry : null;

    const removeImage =
      formData.get("removeProfileImage") === "true";

    if (removeImage && imageFile) {
      return {
        success: false,
        message: "Choose a new photo or remove the existing one.",
      };
    }

    // 6. Upload a new image using YOUR existing helper.
    if (imageFile) {
      const imageFormData = new FormData();

      // Your helper expects the field to be named "file".
      imageFormData.set("file", imageFile);

      newBlobUrl = await uploadToVercelBlob(imageFormData);
    }

    // 7. Decide which image URL should be saved.
    const nextProfileUrl = removeImage
      ? null
      : newBlobUrl ?? currentStudent.profileUrl;

    // 8. Update only fields the student is allowed to edit.
    const updatedRows = await db
      .update(usersTable)
      .set({
        name: fullName,
        email,
        phone,
        profileUrl: nextProfileUrl,
      })
      .where(eq(usersTable.id, userId))
      .returning({ id: usersTable.id });

    if (updatedRows.length === 0) {
      return {
        success: false,
        message: "Student account not found.",
      };
    }

    databaseUpdated = true;

    // 9. Delete the previous image only after the DB update succeeds.
    if (
      currentStudent.profileUrl &&
      currentStudent.profileUrl !== nextProfileUrl
    ) {
      await deleteOldProfileImage(currentStudent.profileUrl);
    }

    return {
      success: true,
      message: "Your profile has been updated successfully.",
    };
  } catch (error) {
    // Remove the newly uploaded image if the DB update failed.
    if (newBlobUrl && !databaseUpdated) {
      try {
        await del(newBlobUrl);
      } catch (cleanupError) {
        console.error(
          "Failed to clean up new profile image:",
          cleanupError
        );
      }
    }

    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        message: "This email address is already in use.",
      };
    }

    // Show expected upload validation messages without exposing
    // database or infrastructure errors to the browser.
    const safeUploadMessages = [
      "No valid file provided.",
      "Image must be smaller than 4.5MB.",
      "Could not determine the file type.",
      "Only JPG, PNG, and WEBP images are allowed.",
    ];

    if (
      error instanceof Error &&
      safeUploadMessages.includes(error.message)
    ) {
      return {
        success: false,
        message: error.message,
      };
    }

    console.error("updateStudentProfile failed:", error);

    return {
      success: false,
      message: "Unable to update your profile. Please try again.",
    };
  }
}