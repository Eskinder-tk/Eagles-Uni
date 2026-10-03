import {
  pgTable,
  uuid,
  varchar,
  integer,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const admissionStatusEnum = pgEnum("admission_status", [
  "pending",
  "under_review",
  "accepted",
  "rejected",
]);

export const admissionsTable = pgTable("admissions", {
  // Internal database ID
  id: uuid().defaultRandom().primaryKey(),

  // ID given to the applicant
  admissionId: uuid().defaultRandom().notNull().unique(),

  // Applicant information
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  age: integer().notNull(),
  phone: varchar({ length: 30 }).notNull(),

  // URL returned from Vercel Blob
  imageUrl: text().notNull(),

  // Admission status
  status: admissionStatusEnum().notNull().default("pending"),

  // Timestamps
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});