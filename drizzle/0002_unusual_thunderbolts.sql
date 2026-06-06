ALTER TABLE "bets" ALTER COLUMN "guess_time" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "bets" ADD COLUMN "guess_is_failing" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "run" ADD COLUMN "run_outcome" text;