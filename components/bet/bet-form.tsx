"use client";

import type { BetFormSchemaType } from "@/lib/schema";
import { submitBet, type FormState } from "@/actions/bet";
import { useActionState, useEffect } from "react";
import {
  McPanel,
  McHeading,
  McLabel,
  McInput,
  McButton,
  mcErrorClass,
} from "@/components/ui/mc";

const initialState: FormState = {};

function FieldRow({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-black/15 py-2">
      <div className="flex items-center justify-between gap-2">
        <McLabel>{label}</McLabel>
        {children}
      </div>
      {error && <span className={mcErrorClass}>{error}</span>}
    </div>
  );
}

type BetFormProps = {
  initial?: Partial<BetFormSchemaType>;
  onSuccessAction?: () => void;
  onCancel?: () => void;
};

export default function BetForm({
  initial,
  onSuccessAction,
  onCancel,
}: BetFormProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    submitBet,
    initialState,
  );

  useEffect(() => {
    if (state.success) onSuccessAction?.();
  }, [state.success, onSuccessAction]);

  return (
    <McPanel>
      <McHeading className="mb-4">Make a Prediction</McHeading>

      {state.error && <p className={mcErrorClass}>{state.error}</p>}

      <form action={formAction} className="flex flex-col">
        <FieldRow label="Deaths" error={state.errors?.guessDeaths?.[0]}>
          <McInput
            name="guessDeaths"
            className="w-24 text-right"
            defaultValue={state.values?.guessDeaths ?? initial?.guessDeaths}
          />
        </FieldRow>

        <FieldRow label="Hearts" error={state.errors?.guessHearts?.[0]}>
          <McInput
            name="guessHearts"
            type="number"
            step="0.5"
            min={0}
            max={10}
            className="w-24 text-right"
            defaultValue={state.values?.guessHearts ?? initial?.guessHearts}
          />
        </FieldRow>

        <FieldRow
          label="Time"
          error={
            state.errors?.hours?.[0] ??
            state.errors?.minutes?.[0] ??
            state.errors?.seconds?.[0]
          }
        >
          <div className="flex gap-1">
            {(["hours", "minutes", "seconds"] as const).map((name) => (
              <McInput
                key={name}
                name={name}
                className="w-12 text-center"
                placeholder={name[0]}
                defaultValue={
                  state.values?.[name] ??
                  initial?.[name as keyof BetFormSchemaType]
                }
              />
            ))}
          </div>
        </FieldRow>

        <McButton type="submit" disabled={isPending} className="my-4 w-full">
          {isPending ? "Saving..." : "Make Prediction c:"}
        </McButton>

        {onCancel && (
          <McButton
            disabled={isPending}
            variant="danger"
            onClick={() => onCancel()}
            className="w-full"
          >
            Cancel
          </McButton>
        )}
      </form>
    </McPanel>
  );
}
