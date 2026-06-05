"use server"

import { db } from "@/db";
import { bets, run, type Bet, type NewBet } from "@/db/schema";
import { BetFormSchema, BetFormSchemaType } from "@/lib/schema";
import { count, desc, eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { z } from "zod"
import { auth } from "@/auth";

const MAX_BETS = 3;

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
    const session = await auth()
    const twitchUserId = session?.user?.id
    if (!twitchUserId) {
        return { success: false, error: "Sign in with Twitch to place a bet." }
    }

    const runs = await db.select().from(run).limit(1)
    const currentRun = runs[0]

    if (!currentRun) {
        return { success: false, error: "Run not initialized" }
    }
    if (currentRun.netherEnterTime !== null) {
        return { success: false, error: "Bets are closed c:<" }
    }

    const [{ value: used }] = await db
        .select({ value: count() })
        .from(bets)
        .where(eq(bets.twitchUserId, twitchUserId))
    if (used >= MAX_BETS) {
        return { success: false, error: "You've used all your bets c:<" }
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
        twitchUserId,
        username: session.user.name ?? "anon",
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
    const session = await auth()
    const twitchUserId = session?.user?.id
    if (!twitchUserId) {
        return { latest: null as unknown as Bet, count: 0 }
    }

    const [latest] = await db.select().from(bets)
        .where(eq(bets.twitchUserId, twitchUserId))
        .orderBy(desc(bets.submittedAt)).limit(1);

    const [{ value }] = await db.select({ value: count() }).from(bets)
        .where(eq(bets.twitchUserId, twitchUserId));

    return { latest: latest ?? null, count: value };
}

type Result =
    | { success: true }
    | { success: false; error: string }

export async function resetBets(): Promise<Result> {
    const session = await auth()
    const twitchUserId = session?.user?.id
    if (!twitchUserId) {
        return { success: false, error: "You must be signed in." }
    }
    try {
        await db.delete(bets).where(eq(bets.twitchUserId, twitchUserId))
        refresh()
        return { success: true }
    } catch (error) {
        console.error(`resetBets failed for ${twitchUserId}:`, error)
        return {
            success: false,
            error: `Failed to delete your bets. Please try again.`
        }
    }
}
