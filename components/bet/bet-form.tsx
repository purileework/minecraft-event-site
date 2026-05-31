"use client";

import type { BetFormSchemaType } from "@/lib/schema";
import { submitBet, type FormState } from "@/actions/bet";
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
  initial?: Partial<BetFormSchemaType>;
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
            name="guessDeaths"
            defaultValue={state.values?.guessDeaths ?? initial?.guessDeaths}
          />
          <FieldError>{state.errors?.guessDeaths?.[0]}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Hearts</FieldLabel>
          <Input
            name="guessHearts"
            defaultValue={state.values?.guessHearts ?? initial?.guessHearts}
          />
          <FieldError>{state.errors?.guessHearts?.[0]}</FieldError>
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
              <FieldError>{state.errors?.hours?.[0]}</FieldError>
            </div>

            <div>
              <Input
                name="minutes"
                defaultValue={state.values?.minutes ?? initial?.minutes}
              />
              <FieldDescription>Minutes</FieldDescription>
              <FieldError>{state.errors?.minutes?.[0]}</FieldError>
            </div>

            <div>
              <Input
                name="seconds"
                defaultValue={state.values?.seconds ?? initial?.seconds}
              />
              <FieldDescription>Seconds</FieldDescription>
              <FieldError>{state.errors?.seconds?.[0]}</FieldError>
            </div>
          </div>
        </Field>
        <Button disabled={isPending}>
          {isPending ? "Saving..." : "Make Prediction c:"}
        </Button>
      </form>
    </div>
  );
}
