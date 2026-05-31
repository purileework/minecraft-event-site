"use server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation";

export type LoginState = {
    error?: string;
}

export async function login(
    _prev: LoginState,
    formData: FormData
): Promise<LoginState> {

    if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_AUTH_SECRET) {
        console.error("Auth env vars not set")
        return { error: "Server misconfigured" }
    }

    const password = String(formData.get("password") ?? "")

    if (password !== process.env.ADMIN_PASSWORD) {
        return { error: "Wrong password." }
    }

    const cookieStore = await cookies()
    cookieStore.set("minecraft_auth", process.env.ADMIN_AUTH_SECRET, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        path: "/",
        secure: process.env.NODE_ENV === "production",
    });

    redirect("/admin")
}