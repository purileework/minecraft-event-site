import NextAuth from "next-auth"
import Twitch from "next-auth/providers/twitch"
import { db } from "@/db"
import { users } from "@/db/schema"

// Persist (or refresh) the viewer's identity + chat color in the DB so the
// leaderboard can render every player's name in their real Twitch color.
async function upsertUser(
    twitchUserId: string,
    username: string,
    color: string | null,
) {
    try {
        await db
            .insert(users)
            .values({ twitchUserId, username, color })
            .onConflictDoUpdate({
                target: users.twitchUserId,
                set: { username, color, updatedAt: new Date() },
            })
    } catch (e) {
        console.error("upsertUser failed:", e)
    }
}

// Twitch chat color via the Helix API. Returns a hex string like "#FF0000",
// or null if the user has no color set / the request fails.
async function fetchChatColor(
    userId: string,
    accessToken: string,
): Promise<string | null> {
    try {
        const res = await fetch(
            `https://api.twitch.tv/helix/chat/color?user_id=${userId}`,
            {
                headers: {
                    "Client-Id": process.env.TWITCH_CLIENT_ID!,
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        )
        if (!res.ok) return null
        const data = await res.json()
        return data?.data?.[0]?.color || null
    } catch (e) {
        console.error("fetchChatColor failed:", e)
        return null
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Twitch({
            clientId: process.env.TWITCH_CLIENT_ID,
            clientSecret: process.env.TWITCH_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            // Only on initial sign in (account/profile present).
            if (account && profile) {
                token.twitchUserId = profile.sub as string
                token.displayName =
                    (profile.preferred_username as string) ??
                    (profile.name as string) ??
                    null
                if (account.access_token && token.twitchUserId) {
                    token.color = await fetchChatColor(
                        token.twitchUserId,
                        account.access_token,
                    )
                }
                if (token.twitchUserId) {
                    await upsertUser(
                        token.twitchUserId,
                        token.displayName ?? "anon",
                        token.color ?? null,
                    )
                }
            }
            return token
        },
        async session({ session, token }) {
            if (token.twitchUserId) session.user.id = token.twitchUserId
            if (token.displayName) session.user.name = token.displayName
            session.color = token.color ?? null
            return session
        },
    },
})
