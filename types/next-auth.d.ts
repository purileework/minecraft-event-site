import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        color?: string | null
        user: {
            id: string
            name?: string | null
            email?: string | null
            image?: string | null
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        twitchUserId?: string
        displayName?: string | null
        color?: string | null
    }
}
