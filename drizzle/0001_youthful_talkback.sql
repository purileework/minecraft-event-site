CREATE TABLE "users" (
	"twitch_user_id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"color" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
