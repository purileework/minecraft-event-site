import { db } from "@/db"
import { bets, type Run, run } from "@/db/schema"
import { count, desc } from "drizzle-orm"


export type LeaderboardRow = {
    username: string
    guessDeaths: number
    guessHearts: number
    guessTime: number
    betsUsed: number
}

export async function getLeaderboardBets(): Promise<LeaderboardRow[]> {
    const latest = await db
        .selectDistinctOn([bets.username], {
            username: bets.username,
            guessDeaths: bets.guessDeaths,
            guessHearts: bets.guessHearts,
            guessTime: bets.guessTime,
            submittedAt: bets.submittedAt,
        })
        .from(bets)
        .orderBy(bets.username, desc(bets.submittedAt))

    const counts = await db
        .select({ username: bets.username, value: count() })
        .from(bets)
        .groupBy(bets.username)

    const countMap = new Map(counts.map((c) => [c.username, c.value]))

    return latest
        .map((row) => ({
            username: row.username,
            guessDeaths: row.guessDeaths,
            guessHearts: row.guessHearts,
            guessTime: row.guessTime,
            betsUsed: countMap.get(row.username) ?? 0,
        }))
        .sort((a, b) => a.username.localeCompare(b.username))
}


export async function getRun(): Promise<Run> {
    const runs = await db.select().from(run).limit(1)
    return runs[0]
}