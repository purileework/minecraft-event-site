import { db } from "@/db"
import { bets, type Run, run } from "@/db/schema"
import { count, desc } from "drizzle-orm"
import { calculateScore, type RunResults } from "@/lib/scoring"
import { getRunTimeSeconds } from "@/lib/time"


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

export type ScoredLeaderboardRow = {
    rank: number

    username: string
    guessDeaths: number
    guessHearts: number
    guessTime: number

    deathsScore: number
    heartsScore: number
    timeScore: number
    totalScore: number
}

export async function getScoredLeaderboard(): Promise<ScoredLeaderboardRow[]> {
    const currentRun = await getRun()
    const totalTimeSeconds = getRunTimeSeconds(currentRun)

    if (currentRun.heartCount === null || totalTimeSeconds === null) {
        return []
    }

    const results: RunResults = {
        deathCount: currentRun.deathCount,
        heartCount: currentRun.heartCount,
        totalTimeSeconds,
    }

    // latest bet per user
    const latest = await db
        .selectDistinctOn([bets.username])
        .from(bets)
        .orderBy(bets.username, desc(bets.submittedAt))

    return latest
        .map((bet) => {
            const score = calculateScore(bet, results)
            return {
                username: bet.username,
                guessDeaths: bet.guessDeaths,
                guessHearts: bet.guessHearts,
                guessTime: bet.guessTime,
                ...score,
            }
        })
        .sort((a, b) => b.totalScore - a.totalScore)
        .map((row, i) => ({ rank: i + 1, ...row }))
}