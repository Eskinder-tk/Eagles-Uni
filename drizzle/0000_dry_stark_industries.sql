CREATE TYPE "public"."admission_status" AS ENUM('pending', 'under_review', 'accepted', 'rejected');--> statement-breakpoint
CREATE TABLE "admissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admissionId" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"phone" varchar(30) NOT NULL,
	"imageUrl" text NOT NULL,
	"status" "admission_status" DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admissions_admissionId_unique" UNIQUE("admissionId")
);
