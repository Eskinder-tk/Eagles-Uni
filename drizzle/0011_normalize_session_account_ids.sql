DELETE FROM "sessions";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "sessions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "sessions_instructor_id_instructors_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "user_id" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "user_id" TYPE integer USING NULL::integer;
--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "instructor_id" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "instructor_id" TYPE integer USING NULL::integer;
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_instructor_id_instructors_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;
