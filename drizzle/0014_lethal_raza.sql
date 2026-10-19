ALTER TABLE "courses" RENAME COLUMN "creditHour" TO "credit_hour";--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "year" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "semester" integer NOT NULL;