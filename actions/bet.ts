"use server"

import { db } from "@/db";
import { bets, type Bet, type NewBet } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { refresh } from "next/cache";

export type BetValues = {
    deaths: string;
    hearts: string;
    hours: string;
    minutes: string;
    seconds: string;
};

type Result =
    | { success: true }
    | { success: false; error: string }


export type FieldErrors = Partial<Record<keyof BetValues, string>>;

export type FormState = {
    error?: string;
    success?: boolean;
    values?: BetValues;
    errors?: FieldErrors;
};

// non-negative integer
function parseCount(raw: string): number | null {
    if (raw.trim() === "") return null;
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 0) return null;
    return n;
}

export async function submitBet(
    _prevState: FormState,
    formData: FormData,
): Promise<FormState> {
    const values: BetValues = {
        deaths: String(formData.get("deaths") ?? ""),
        hearts: String(formData.get("hearts") ?? ""),
        hours: String(formData.get("hours") ?? ""),
        minutes: String(formData.get("minutes") ?? ""),
        seconds: String(formData.get("seconds") ?? ""),
    };


    const deaths = parseCount(values.deaths);
    const hearts = parseCount(values.hearts);
    const hours = parseCount(values.hours);
    const minutes = parseCount(values.minutes);
    const seconds = parseCount(values.seconds);

    const errors: FieldErrors = {};
    if (deaths === null) errors.deaths = "Enter a whole number ≥ 0";
    if (hearts === null) errors.hearts = "Enter a whole number ≥ 0";
    if (hours === null) errors.hours = "Enter a whole number ≥ 0";
    if (minutes === null) errors.minutes = "Enter a whole number ≥ 0";
    if (seconds === null) errors.seconds = "Enter a whole number ≥ 0";

    if (deaths === null || hearts === null || hours === null || seconds === null || minutes === null) {
        return { success: false, values, errors };
    }

    const newBet: NewBet = {
        username: "temp-player", // TODO: pull from auth/session
        guessDeaths: deaths,
        guessHearts: hearts,
        guessTime: (hours * 3600) + (minutes * 60) + seconds,
    };

    await db.insert(bets).values(newBet);
    refresh()
    return { success: true, values };
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
