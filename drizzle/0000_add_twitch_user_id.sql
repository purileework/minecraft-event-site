CREATE TABLE "bets" (
	"id" serial PRIMARY KEY NOT NULL,
	"twitch_user_id" text NOT NULL,
	"username" text NOT NULL,
	"guess_deaths" integer NOT NULL,
	"guess_time" integer NOT NULL,
	"guess_hearts" integer NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "run" (
	"id" serial PRIMARY KEY NOT NULL,
	"started_at" timestamp,
	"finished_at" timestamp,
	"nether_enter_time" timestamp,
	"paused_at" timestamp,
	"total_paused_seconds" integer DEFAULT 0 NOT NULL,
	"death_count" integer DEFAULT 0 NOT NULL,
	"heart_count" integer
);
