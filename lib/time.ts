import type { Run } from "@/db/schema"

export function getRunTimeSeconds(run: Run): number | null {
    if (!run.startedAt || !run.finishedAt) return null

    const wallTime = (run.finishedAt.getTime() - run.startedAt.getTime()) / 1000
    return Math.max(0, Math.round(wallTime - run.totalPausedSeconds))
}