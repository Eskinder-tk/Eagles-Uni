"use server";

import { put } from "@vercel/blob";
import { fileTypeFromBlob } from "file-type";
import { db } from "@/db";
import { admissionsTable, usersTable, coursesTable, userCoursesTable, instructors, instructorCourses } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt, { hash } from "bcrypt";
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import z from "zod";

export async function logoutAction() {
  await deleteSession();
  redirect('/');
}

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