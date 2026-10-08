import {
  pgTable,
  uuid,
  varchar,
  integer,
  text,
  timestamp,
  pgEnum,
  pgSequence,
  serial,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";

// Enums
export const admissionStatusEnum = pgEnum("admission_status", [
  "pending",
  "under_review",
  "accepted",
  "rejected",
]);

// Admissions Table
export const admissionsTable = pgTable("admissions", {
  id: uuid().defaultRandom().primaryKey(),
  admissionId: uuid().defaultRandom().notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  age: integer().notNull(),
  phone: varchar({ length: 30 }).notNull(),
  imageUrl: text().notNull(),
  status: admissionStatusEnum().notNull().default("pending"),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// User Sequence & Table
export const userIdSequence = pgSequence("user_id_sequence");

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  userCode: varchar("user_code", { length: 14 })
    .notNull()
    .unique()
    .default(
      sql`'EUU/' || lpad(nextval('user_id_sequence')::text, 6, '0') || '/' || to_char(current_date, 'YY')`
    ),
  name: varchar("name", { length: 255 }).notNull(),
  age: integer("age").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 30 }),
  profileUrl: varchar("profile_url", { length: 500 }),
  year: integer("year").notNull(),
  passwordHash: text("password_hash").notNull(),
});

// Courses Table
export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  courseCode: text("course_code").notNull().unique(),
  name: text("name").notNull(),
});

// User-Courses Join Table
export const userCoursesTable = pgTable(
  "user_courses",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id),
    courseId: integer("course_id")
      .notNull()
      .references(() => coursesTable.id),
    semester: integer("semester").notNull(),
    academicYear: integer("academic_year").notNull(),
    grade: varchar("grade", { length: 2 }),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.courseId],
    }),
  ]
);

// Instructor Sequence & Table
export const instructorIdSequence = pgSequence("instructor_id_sequence");

export const instructors = pgTable("instructors", {
  id: serial("id").primaryKey(),
  instructorCode: varchar("instructor_code", { length: 14 })
    .notNull()
    .unique()
    .default(
      // FIXED: typo corrected from 'instuctor_id_sequence' to 'instructor_id_sequence'
      sql`'EUI/' || lpad(nextval('instructor_id_sequence')::text, 6, '0')`
    ),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  profileUrl: varchar("profile_url", { length: 500 }),
  passwordHash: text("password_hash").notNull(),
});

// Instructor-Courses Join Table
export const instructorCourses = pgTable(
  "instructor_courses",
  {
    instructorId: integer("instructor_id")
      .notNull()
      .references(() => instructors.id),
    courseId: integer("course_id")
      .notNull()
      .references(() => coursesTable.id),
  },
  (table) => [
    primaryKey({
      columns: [table.instructorId, table.courseId],
    }),
  ]
);

// COMBINED Relations for coursesTable
export const coursesRelations = relations(
  coursesTable,
  ({ many }) => ({
    userCourses: many(userCoursesTable),
    instructorCourses: many(instructorCourses),
  })
);

// User Relations
export const usersRelations = relations(
  usersTable,
  ({ many }) => ({
    userCourses: many(userCoursesTable),
  })
);

// User Courses Relations
export const userCoursesRelations = relations(
  userCoursesTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [userCoursesTable.userId],
      references: [usersTable.id],
    }),
    course: one(coursesTable, {
      fields: [userCoursesTable.courseId],
      references: [coursesTable.id],
    }),
  })
);

// Instructor Relations
export const instructorRelations = relations(
  instructors,
  ({ many }) => ({
    instructorCourses: many(instructorCourses),
  })
);

// Instructor Courses Relations
export const instructorCoursesRelations = relations(
  instructorCourses,
  ({ one }) => ({
    instructor: one(instructors, {
      fields: [instructorCourses.instructorId],
      references: [instructors.id],
    }),
    course: one(coursesTable, {
      fields: [instructorCourses.courseId],
      references: [coursesTable.id],
    }),
  })
);






export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});