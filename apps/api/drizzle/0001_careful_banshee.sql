CREATE TYPE "public"."bookmark_metadata_status" AS ENUM('pending', 'processing', 'succeeded', 'failed');--> statement-breakpoint
CREATE TYPE "public"."bookmark_type" AS ENUM('website', 'article', 'video', 'image', 'audio', 'document', 'other');--> statement-breakpoint
CREATE TABLE "bookmark" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"url" text NOT NULL,
	"normalizedUrl" text,
	"title" text,
	"description" text,
	"siteName" text,
	"faviconUrl" text,
	"imageUrl" text,
	"type" "bookmark_type" DEFAULT 'website' NOT NULL,
	"metadataStatus" "bookmark_metadata_status" DEFAULT 'pending' NOT NULL,
	"metadataFetchedAt" timestamp,
	"metadataError" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookmark_userId_idx" ON "bookmark" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "bookmark_userId_createdAt_idx" ON "bookmark" USING btree ("userId","createdAt");--> statement-breakpoint
CREATE INDEX "bookmark_metadataStatus_idx" ON "bookmark" USING btree ("metadataStatus");