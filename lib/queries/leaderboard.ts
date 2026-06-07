import { db } from "@/db"
import { bets, users, type Run, type RunOutcome, run } from "@/db/schema"
import { count, desc, eq } from "drizzle-orm"
import { calculateScore, type RunResults } from "@/lib/scoring"
import { getRunTimeSeconds } from "@/lib/time"


export type LeaderboardRow = {
    username: string
    color: string | null
    guessDeaths: number
    guessHearts: number | null
    guessTime: number | null
    guessIsFailing: boolean
    betsUsed: number
}

export async function getLeaderboardBets(): Promise<LeaderboardRow[]> {
    const latest = await db
        .selectDistinctOn([bets.username], {
            username: bets.username,
            color: users.color,
            guessDeaths: bets.guessDeaths,
            guessHearts: bets.guessHearts,
            guessTime: bets.guessTime,
            guessIsFailing: bets.guessIsFailing,
            submittedAt: bets.submittedAt,
        })
        .from(bets)
        .leftJoin(users, eq(users.twitchUserId, bets.twitchUserId))
        .orderBy(bets.username, desc(bets.submittedAt))

    const counts = await db
        .select({ username: bets.username, value: count() })
        .from(bets)
        .groupBy(bets.username)

    const countMap = new Map(counts.map((c) => [c.username, c.value]))

    return latest
        .map((row) => ({
            username: row.username,
            color: row.color,
            guessDeaths: row.guessDeaths,
            guessHearts: row.guessHearts,
            guessTime: row.guessTime,
            guessIsFailing: row.guessIsFailing,
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
    color: string | null
    guessDeaths: number
    guessHearts: number | null
    guessTime: number | null
    guessIsFailing: boolean
    // Correctly predicted the run would fail.
    calledFailure: boolean

    deathsScore: number
    heartsScore: number
    timeScore: number
    totalScore: number
}

export async function getScoredLeaderboard(): Promise<ScoredLeaderboardRow[]> {
    const currentRun = await getRun()
    const totalTimeSeconds = getRunTimeSeconds(currentRun)
    // Legacy runs ended before outcomes existed are treated as successes.
    const outcome: RunOutcome = currentRun.runOutcome ?? "finished"

    // Hearts & time only feed a successful run's closeness scores; a failed run
    // scores them purely on the failure prediction, so neither is required.
    if (outcome === "finished" && (currentRun.heartCount === null || totalTimeSeconds === null)) {
        return []
    }

    const results: RunResults = {
        deathCount: currentRun.deathCount,
        heartCount: currentRun.heartCount ?? 0,
        totalTimeSeconds: totalTimeSeconds ?? 0,
        outcome,
    }

    // latest bet per user
    const latest = await db
        .selectDistinctOn([bets.username])
        .from(bets)
        .orderBy(bets.username, desc(bets.submittedAt))

    const colorRows = await db
        .select({ twitchUserId: users.twitchUserId, color: users.color })
        .from(users)
    const colorMap = new Map(colorRows.map((r) => [r.twitchUserId, r.color]))

    return latest
        .map((bet) => {
            const score = calculateScore(bet, results)
            return {
                username: bet.username,
                color: colorMap.get(bet.twitchUserId) ?? null,
                guessDeaths: bet.guessDeaths,
                guessHearts: bet.guessHearts,
                guessTime: bet.guessTime,
                guessIsFailing: bet.guessIsFailing,
                calledFailure: outcome === "failed" && bet.guessIsFailing,
                submittedAt: bet.submittedAt,
                ...score,
            }
        })
        // Highest score first; ties broken by the earlier latest-bet submission
        // (we score each viewer on their final guess, so its timestamp decides).
        .sort(
            (a, b) =>
                b.totalScore - a.totalScore ||
                a.submittedAt.getTime() - b.submittedAt.getTime(),
        )
        .map((row, i) => ({ rank: i + 1, ...row }))
}