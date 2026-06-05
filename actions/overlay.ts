"use server"

import { getRun } from "@/lib/queries/leaderboard"

export type RunState = {
    startedAt: Date | null
    finishedAt: Date | null
    pausedAt: Date | null
    totalPausedSeconds: number
    deathCount: number
}

export async function getRunState(): Promise<RunState> {
    const run = await getRun()
    return {
        startedAt: run.startedAt,
        finishedAt: run.finishedAt,
        pausedAt: run.pausedAt,
        totalPausedSeconds: run.totalPausedSeconds,
        deathCount: run.deathCount,
    }
}
