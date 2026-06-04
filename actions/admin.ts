"use server"
import { db } from "@/db"
import { run } from "@/db/schema"
import { eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

type Result =
    | { success: true }
    | { success: false; error: string }

export async function startRun(): Promise<Result> {
    const runs = await db.select().from(run).limit(1)
    if (runs[0] == null) {
        console.error("Run not initiated.")
        return { success: false, error: "Run not initiated." }
    }

    if (runs[0].startedAt !== null) {
        console.error("Run already started.")
        return { success: false, error: "Run already started." }
    }

    await db.update(run)
        .set({ startedAt: new Date() })
        .where(eq(run.id, 1))

    revalidatePath("/admin")
    return { success: true }
}

export async function endRun(): Promise<Result> {
    const runs = await db.select().from(run).limit(1)
    if (runs[0] == null) {
        console.error("Run not initiated.")
        return { success: false, error: "Run not initiated." }
    }

    if (runs[0].startedAt == null) {
        console.error("Run hasn't started.")
        return { success: false, error: "Run hasn't started." }
    }

    if (runs[0].finishedAt !== null) {
        console.error("Run already ended.")
        return { success: false, error: "Run already ended." }
    }

    await db.update(run)
        .set({ finishedAt: new Date() })
        .where(eq(run.id, 1))

    revalidatePath("/admin")
    return { success: true }
}

export async function setHeartCount(value: number): Promise<Result> {
    if (!Number.isInteger(value) || value < 0) {
        return { success: false, error: "Hearts must be a non-negative integer." }
    }

    const runs = await db.select().from(run).limit(1)
    if (runs[0] == null) {
        console.error("Run not initiated.")
        return { success: false, error: "Run not initiated." }
    }

    await db.update(run)
        .set({ heartCount: value })
        .where(eq(run.id, 1))

    revalidatePath("/admin")
    return { success: true }
}

export async function resetRun(): Promise<Result> {
    const runs = await db.select().from(run).limit(1)
    if (runs[0] == null) {
        console.error("Run not initiated.")
        return { success: false, error: "Run not initiated." }
    }

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

    revalidatePath("/admin")
    return { success: true }
}

export async function pauseRun(): Promise<Result> {
    const runs = await db.select().from(run).limit(1)
    if (runs[0] == null) {
        console.error("Run not initiated.")
        return { success: false, error: "Run not initiated." }
    }

    if (runs[0].startedAt === null) {
        console.error("Run not started.")
        return { success: false, error: "Run not started." }
    }

    if (runs[0].finishedAt !== null) {
        console.error("Run already ended.")
        return { success: false, error: "Run already ended." }
    }

    if (runs[0].pausedAt !== null) {
        console.error("Run already paused.")
        return { success: false, error: "Run already paused." }
    }

    await db.update(run)
        .set({ pausedAt: new Date() })
        .where(eq(run.id, 1))

    revalidatePath("/admin")
    return { success: true }
}

export async function resumeRun(): Promise<Result> {
    const runs = await db.select().from(run).limit(1)
    if (runs[0] == null) {
        console.error("Run not initiated.")
        return { success: false, error: "Run not initiated." }
    }

    if (runs[0].pausedAt === null) {
        console.error("Run not paused.")
        return { success: false, error: "Run not paused." }
    }

    const pausedSeconds = Math.floor(
        (Date.now() - runs[0].pausedAt.getTime()) / 1000
    )

    await db.update(run)
        .set({
            pausedAt: null,
            totalPausedSeconds: sql`${run.totalPausedSeconds} + ${pausedSeconds}`,
        })
        .where(eq(run.id, 1))

    revalidatePath("/admin")
    return { success: true }
}

export async function toggleNether(): Promise<Result> {
    const runs = await db.select().from(run).limit(1)
    if (runs[0] == null) {
        console.error("Run not initiated.")
        return { success: false, error: "Run not initiated." }
    }

    if (runs[0].netherEnterTime !== null) {
        await db.update(run)
            .set({ netherEnterTime: null })
            .where(eq(run.id, 1))

    } else {
        await db.update(run)
            .set({ netherEnterTime: new Date() })
            .where(eq(run.id, 1))
    }

    revalidatePath("/admin")
    return { success: true }
}

export async function addDeath() {
    const runs = await db.select().from(run).limit(1)
    if (runs[0] == null) {
        console.error("Run not initiated.")
        return { success: false, error: "Run not initiated." }
    }

    await db.update(run)
        .set({ deathCount: sql`${run.deathCount} + 1` })
        .where(eq(run.id, 1))

    revalidatePath("/admin")
    return { success: true }
}

export async function decreaseDeath() {
    const runs = await db.select().from(run).limit(1)
    if (runs[0] == null) {
        console.error("Run not initiated.")
        return { success: false, error: "Run not initiated." }
    }

    await db.update(run)
        .set({ deathCount: sql`${run.deathCount} - 1` })
        .where(eq(run.id, 1))

    revalidatePath("/admin")
    return { success: true }
}

