"use client";

import { submitBet, type BetValues, type FormState } from "@/actions/bet";
import { useActionState, useEffect } from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const initialState: FormState = {};

type BetFormProps = {
  initial?: Partial<BetValues>;
  onSuccessAction?: () => void;
};

export default function BetForm({ initial, onSuccessAction }: BetFormProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    submitBet,
    initialState,
  );

  useEffect(() => {
    if (state.success) onSuccessAction?.();
  }, [state.success, onSuccessAction]);

  return (
    <div>
      <form action={formAction}>
        <Field>
          <FieldLabel>Deaths</FieldLabel>
          <Input
            name="deaths"
            defaultValue={state.values?.deaths ?? initial?.deaths}
          />
          <FieldError>{state.errors?.deaths}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Hearts</FieldLabel>
          <Input
            name="hearts"
            defaultValue={state.values?.hearts ?? initial?.hearts}
          />
          <FieldError>{state.errors?.hearts}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Time</FieldLabel>
          <div className="flex gap-2">
            <div>
              <Input
                name="hours"
                defaultValue={state.values?.hours ?? initial?.hours}
              />
              <FieldDescription>Hours</FieldDescription>
              <FieldError>{state.errors?.hours}</FieldError>
            </div>

            <div>
              <Input
                name="minutes"
                defaultValue={state.values?.minutes ?? initial?.minutes}
              />
              <FieldDescription>Minutes</FieldDescription>
              <FieldError>{state.errors?.minutes}</FieldError>
            </div>

            <div>
              <Input
                name="seconds"
                defaultValue={state.values?.seconds ?? initial?.seconds}
              />
              <FieldDescription>Seconds</FieldDescription>
              <FieldError>{state.errors?.seconds}</FieldError>
            </div>
          </div>

          <Button disabled={isPending}>
            {isPending ? "Saving..." : "Make Prediction c:"}
          </Button>
        </Field>
      </form>
    </div>
  );
}
