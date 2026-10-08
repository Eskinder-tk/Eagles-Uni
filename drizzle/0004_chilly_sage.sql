CREATE TABLE "instructor_courses" (
	"instructor_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	CONSTRAINT "instructor_courses_instructor_id_course_id_pk" PRIMARY KEY("instructor_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "instructors" (
	"id" serial PRIMARY KEY NOT NULL,
	"instructor_code" varchar(14) DEFAULT 'EUI/' || lpad(nextval('user_id_sequence')::text, 6, '0') NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"profile_url" varchar(500),
	"password_hash" text NOT NULL,
	CONSTRAINT "instructors_instructor_code_unique" UNIQUE("instructor_code"),
	CONSTRAINT "instructors_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "instructor_courses" ADD CONSTRAINT "instructor_courses_instructor_id_instructors_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instructor_courses" ADD CONSTRAINT "instructor_courses_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;