import { signIn, signOut } from "@/auth";
import { McButton } from "@/components/ui/mc";

export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("twitch", { redirectTo: "/" });
      }}
    >
      <McButton type="submit" className="w-full">
        Sign in with Twitch
      </McButton>
    </form>
  );
}

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <McButton type="submit" variant="danger" className="px-3 py-1 text-sm">
        Sign out
      </McButton>
    </form>
  );
}
