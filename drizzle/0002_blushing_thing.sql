CREATE SEQUENCE "public"."user_id_sequence" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_code" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "courses_course_code_unique" UNIQUE("course_code")
);
--> statement-breakpoint
CREATE TABLE "user_courses" (
	"user_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"semester" integer NOT NULL,
	"academic_year" integer NOT NULL,
	"grade" varchar(2),
	CONSTRAINT "user_courses_user_id_course_id_pk" PRIMARY KEY("user_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_code" varchar(14) DEFAULT 'EUU/' || lpad(nextval('user_id_sequence')::text, 6, '0') || '/' || to_char(current_date, 'YY') NOT NULL,
	"name" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(30),
	"profile_url" varchar(500),
	"year" integer NOT NULL,
	CONSTRAINT "users_user_code_unique" UNIQUE("user_code"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;