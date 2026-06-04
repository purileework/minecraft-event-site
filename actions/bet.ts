"use server"

import { db } from "@/db";
import { bets, run, type Bet, type NewBet } from "@/db/schema";
import { BetFormSchema, BetFormSchemaType } from "@/lib/schema";
import { count, desc, eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { z } from "zod"

export type FieldErrors = Partial<Record<keyof BetFormSchemaType, string[]>>;

export type BetFormValues = {
    guessDeaths?: string
    guessHearts?: string
    hours?: string
    minutes?: string
    seconds?: string
}

export type FormState = {
    error?: string;
    success?: boolean;
    values?: BetFormValues;
    errors?: FieldErrors;
};

export async function submitBet(
    _prevState: FormState,
    formData: FormData,
): Promise<FormState> {
    const runs = await db.select().from(run).limit(1)
    const currentRun = runs[0]

    if (!currentRun) {
        return { success: false, error: "Run not initialized" }
    }
    const betsClosed = currentRun.netherEnterTime !== null

    if (betsClosed) {
        return {
            success: false,
            error: "Bets are closed c:<"
        }
    }

    const raw = Object.fromEntries(formData)
    const parsed = BetFormSchema.safeParse({
        guessDeaths: parseInt(raw.guessDeaths as string),
        guessHearts: Number(raw.guessHearts as string),
        hours: parseInt(raw.hours as string),
        minutes: parseInt(raw.minutes as string),
        seconds: parseInt(raw.seconds as string),
    })

    if (!parsed.success) {
        return {
            success: false,
            values: raw,
            errors: z.flattenError(parsed.error).fieldErrors
        }
    }

    const { hours, minutes, seconds, ...rest } = parsed.data
    const newBet: NewBet = {
        username: "temp-player",
        ...rest,
        guessTime: hours * 3600 + minutes * 60 + seconds,
    }


    try {
        await db.insert(bets).values(newBet)
        refresh()
        return { success: true }
    } catch (e) {
        console.error("submitBet failed:", e)
        return { success: false, error: "Something went wrong. Please try again." }
    }
}

export type ViewerBet = {
    latest: Bet;
    count: number
}

export async function getViewerBet(): Promise<ViewerBet> {
    const session = { username: "temp-player" };

    const [latest] = await db.select().from(bets)
        .where(eq(bets.username, session.username))
        .orderBy(desc(bets.submittedAt)).limit(1);

    const [{ value }] = await db.select({ value: count() }).from(bets)
        .where(eq(bets.username, session.username));

    return { latest: latest ?? null, count: value };

}

type Result =
    | { success: true }
    | { success: false; error: string }


export async function resetBets(): Promise<Result> {
    const session = { username: "temp-player" }
    if (!session?.username) {
        return { success: false, error: "You must be logged in" }
    }
    try {
        await db.delete(bets).where(eq(bets.username, session.username))
        refresh()
        return { "success": true }
    } catch (error) {
        console.error(`resetBets failed for ${session.username}:`, error)
        return {
            success: false,
            error: `Failed to delete your bets. Please try again.`
        }
    }
}
