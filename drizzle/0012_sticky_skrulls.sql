ALTER TABLE "user_courses" DROP CONSTRAINT "user_courses_user_id_course_id_pk";--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "instructor_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_user_id_course_id_semester_academic_year_pk" PRIMARY KEY("user_id","course_id","semester","academic_year");