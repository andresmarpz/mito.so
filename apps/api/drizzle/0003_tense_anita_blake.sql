ALTER TABLE "chat_messages" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "chats" ALTER COLUMN "chat_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "chats" DROP COLUMN "values";