"use server"

import { cookies } from "next/headers"
import { auth } from "@/auth"

// Persist the viewer's Twitch chat color (from the session) into a cookie so
// overlays can render their username in their real chat color.
export async function syncChatColor() {
    const session = await auth()
    const color = session?.color
    if (!color) return

    const store = await cookies()
    store.set("twitch_color", color, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
    })
}
