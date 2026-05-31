"use client";

import { login, type LoginState } from "@/actions/login";
import { useActionState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, action, isPending] = useActionState<LoginState, FormData>(
    login,
    initialState,
  );
  return (
    <form action={action}>
      <Field>
        <FieldLabel>Enter Password</FieldLabel>
        <Input type="password" name="password" required />
        <FieldError>{state?.error}</FieldError>
      </Field>
      <Button disabled={isPending}>{isPending ? "loading..." : "Enter"}</Button>
    </form>
  );
}
