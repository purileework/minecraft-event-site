"use client";

import { login, type LoginState } from "@/actions/login";
import { useActionState } from "react";
import {
  McPanel,
  McHeading,
  McLabel,
  McInput,
  McButton,
  mcErrorClass,
} from "@/components/ui/mc";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, action, isPending] = useActionState<LoginState, FormData>(
    login,
    initialState,
  );
  return (
    <McPanel>
      <McHeading className="mb-4 text-center">Admin Login</McHeading>
      <form action={action} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <McLabel>Enter Password</McLabel>
          <McInput type="password" name="password" required />
          <span className={mcErrorClass}>{state?.error}</span>
        </div>
        <McButton disabled={isPending} className="w-full">
          {isPending ? "Loading..." : "Enter"}
        </McButton>
      </form>
    </McPanel>
  );
}
