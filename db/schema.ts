import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const bets = pgTable("bets", {
    id: serial("id").primaryKey(),
    // Stable Twitch identity — used for the 3-bet cap and "your bet" lookup.
    twitchUserId: text("twitch_user_id").notNull(),
    // Twitch display name at submit time (can change, so not the identity key).
    username: text("username").notNull(),
    guessDeaths: integer("guess_deaths").notNull(),
    // Null when the viewer predicts failure: time & hearts only exist if the
    // dragon is killed, so failure-predicters skip both.
    guessTime: integer("guess_time"),
    guessHearts: integer("guess_hearts"),
    submittedAt: timestamp("submitted_at").notNull().defaultNow(),
    guessIsFailing: boolean("guess_is_failing").notNull().default(false)
});

export const users = pgTable("users", {
    // Stable Twitch identity.
    twitchUserId: text("twitch_user_id").primaryKey(),
    username: text("username").notNull(),
    // Twitch chat color hex (e.g. "#FF0000"), null if unset.
    color: text("color"),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const run = pgTable("run", {
    id: serial("id").primaryKey(),
    startedAt: timestamp("started_at"),
    finishedAt: timestamp("finished_at"),
    netherEnterTime: timestamp("nether_enter_time"),
    pausedAt: timestamp("paused_at"),
    totalPausedSeconds: integer("total_paused_seconds").notNull().default(0),
    deathCount: integer("death_count").notNull().default(0),
    heartCount: integer("heart_count"),
    // 'finished' = dragon beaten, 'failed' = run died, null = still going.
    runOutcome: text("run_outcome", { enum: ["finished", "failed"] }),
})

export type RunOutcome = "finished" | "failed"

export type Bet = typeof bets.$inferSelect
export type NewBet = typeof bets.$inferInsert

export type Run = typeof run.$inferSelect
export type NewRun = typeof run.$inferInsert

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert



