import { signIn, signOut } from "@/auth";
import { SubmitOverlayButton } from "@/components/ui/submit-overlay-button";
import { cn } from "@/lib/utils";

export function SignInButton({ className }: { className?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("twitch", { redirectTo: "/" });
      }}
    >
      <SubmitOverlayButton
        overlayLabel="Signing in..."
        className={cn("w-full", className)}
      >
        Sign in with Twitch
      </SubmitOverlayButton>
    </form>
  );
}

export function SignOutButton({ className }: { className?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <SubmitOverlayButton
        variant="danger"
        overlayLabel="Signing out..."
        className={cn("px-3 py-1 text-sm", className)}
      >
        Sign out
      </SubmitOverlayButton>
    </form>
  );
}
