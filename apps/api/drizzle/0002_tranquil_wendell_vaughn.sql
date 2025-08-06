DROP TABLE "chat_parts_file" CASCADE;--> statement-breakpoint
DROP TABLE "chat_parts_reasoning" CASCADE;--> statement-breakpoint
DROP TABLE "chat_parts_source_url" CASCADE;--> statement-breakpoint
DROP TABLE "chat_parts_tool" CASCADE;--> statement-breakpoint
DROP TABLE "chat_parts_text" CASCADE;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD COLUMN "parts" jsonb NOT NULL;