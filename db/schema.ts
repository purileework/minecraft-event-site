import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const bet = pgTable("bets", {
    id: serial("id").primaryKey(),
    username: text("username").notNull(),
    guessDeaths: integer("guess_deaths").notNull(),
    guessTime: integer("guess_time").notNull(),
    guessHearts: integer("guess_hearts").notNull(),
    submittedAt: timestamp("submitted_at").notNull().defaultNow()
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
})