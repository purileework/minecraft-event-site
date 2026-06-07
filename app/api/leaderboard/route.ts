import { getLeaderboardBets, getRun } from "@/lib/queries/leaderboard"

export type LeaderboardSnapshot = {
    rows: Awaited<ReturnType<typeof getLeaderboardBets>>
    deathCount: number
    netherClosed: boolean
    runEnded: boolean
}

export async function GET() {
    const [rows, run] = await Promise.all([getLeaderboardBets(), getRun()])

    const snapshot: LeaderboardSnapshot = {
        rows,
        deathCount: run.deathCount,
        netherClosed: run.netherEnterTime !== null,
        runEnded: run.finishedAt !== null,
    }

    return Response.json(snapshot)
}
