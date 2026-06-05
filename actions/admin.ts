"use server"
import { db } from "@/db"
import { run } from "@/db/schema"
import { eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

type Result =
    | { success: true }
    | { success: false; error: string }

function revalidate() {
    revalidatePath("/admin")
    revalidatePath("/")
}

async function loadRun() {
    return (await db.select().from(run).limit(1))[0] ?? null
}

export async function startRun(): Promise<Result> {
    const currentRun = await loadRun()
    if (currentRun === null) {
        return { success: false, error: "Run not initiated." }
    }
    if (currentRun.startedAt !== null) {
        return { success: false, error: "Run already started." }
    }

    try {
        await db.update(run).set({ startedAt: new Date() }).where(eq(run.id, 1))
    } catch (e) {
        console.error("startRun failed:", e)
        return { success: false, error: "Failed to start run." }
    }

    revalidate()
    return { success: true }
}

export async function endRun(): Promise<Result> {
    const currentRun = await loadRun()
    if (currentRun === null) {
        return { success: false, error: "Run not initiated." }
    }
    if (currentRun.startedAt === null) {
        return { success: false, error: "Run hasn't started." }
    }
    if (currentRun.finishedAt !== null) {
        return { success: false, error: "Run already ended." }
    }

    try {
        await db.update(run).set({ finishedAt: new Date() }).where(eq(run.id, 1))
    } catch (e) {
        console.error("endRun failed:", e)
        return { success: false, error: "Failed to end run." }
    }

    revalidate()
    return { success: true }
}

export async function setHeartCount(value: number): Promise<Result> {
    if (!Number.isInteger(value) || value < 0) {
        return { success: false, error: "Hearts must be a non-negative integer." }
    }

    const currentRun = await loadRun()
    if (currentRun === null) {
        return { success: false, error: "Run not initiated." }
    }

    try {
        await db.update(run).set({ heartCount: value }).where(eq(run.id, 1))
    } catch (e) {
        console.error("setHeartCount failed:", e)
        return { success: false, error: "Failed to set heart count." }
    }

    revalidate()
    return { success: true }
}

export async function resetRun(): Promise<Result> {
    const currentRun = await loadRun()
    if (currentRun === null) {
        return { success: false, error: "Run not initiated." }
    }

    try {
        await db.update(run)
            .set({
                startedAt: null,
                finishedAt: null,
                netherEnterTime: null,
                pausedAt: null,
                totalPausedSeconds: 0,
                deathCount: 0,
                heartCount: null,
            })
            .where(eq(run.id, 1))
    } catch (e) {
        console.error("resetRun failed:", e)
        return { success: false, error: "Failed to reset run." }
    }

    revalidate()
    return { success: true }
}

export async function pauseRun(): Promise<Result> {
    const currentRun = await loadRun()
    if (currentRun === null) {
        return { success: false, error: "Run not initiated." }
    }
    if (currentRun.startedAt === null) {
        return { success: false, error: "Run not started." }
    }
    if (currentRun.finishedAt !== null) {
        return { success: false, error: "Run already ended." }
    }
    if (currentRun.pausedAt !== null) {
        return { success: false, error: "Run already paused." }
    }

    try {
        await db.update(run).set({ pausedAt: new Date() }).where(eq(run.id, 1))
    } catch (e) {
        console.error("pauseRun failed:", e)
        return { success: false, error: "Failed to pause run." }
    }

    revalidate()
    return { success: true }
}

export async function resumeRun(): Promise<Result> {
    const currentRun = await loadRun()
    if (currentRun === null) {
        return { success: false, error: "Run not initiated." }
    }
    if (currentRun.pausedAt === null) {
        return { success: false, error: "Run not paused." }
    }

    const pausedSeconds = Math.floor(
        (Date.now() - currentRun.pausedAt.getTime()) / 1000
    )

    try {
        await db.update(run)
            .set({
                pausedAt: null,
                totalPausedSeconds: sql`${run.totalPausedSeconds} + ${pausedSeconds}`,
            })
            .where(eq(run.id, 1))
    } catch (e) {
        console.error("resumeRun failed:", e)
        return { success: false, error: "Failed to resume run." }
    }

    revalidate()
    return { success: true }
}

export async function toggleNether(): Promise<Result> {
    const currentRun = await loadRun()
    if (currentRun === null) {
        return { success: false, error: "Run not initiated." }
    }

    try {
        const newValue = currentRun.netherEnterTime === null ? new Date() : null
        await db.update(run).set({ netherEnterTime: newValue }).where(eq(run.id, 1))
    } catch (e) {
        console.error("toggleNether failed:", e)
        return { success: false, error: "Failed to toggle Nether state." }
    }

    revalidate()
    return { success: true }
}

export async function addDeath(): Promise<Result> {
    const currentRun = await loadRun()
    if (currentRun === null) {
        return { success: false, error: "Run not initiated." }
    }

    try {
        await db.update(run)
            .set({ deathCount: sql`${run.deathCount} + 1` })
            .where(eq(run.id, 1))
    } catch (e) {
        console.error("addDeath failed:", e)
        return { success: false, error: "Failed to add death." }
    }

    revalidate()
    return { success: true }
}

export async function decreaseDeath(): Promise<Result> {
    const currentRun = await loadRun()
    if (currentRun === null) {
        return { success: false, error: "Run not initiated." }
    }

    if (currentRun.deathCount === 0) {
        return { success: false, error: "Death count is already 0." }
    }

    try {
        await db.update(run)
            .set({ deathCount: sql`${run.deathCount} - 1` })
            .where(sql`${run.id} = 1 AND ${run.deathCount} > 0`)
    } catch (e) {
        console.error("decreaseDeath failed:", e)
        return { success: false, error: "Failed to decrease death." }
    }

    revalidate()
    return { success: true }
}
