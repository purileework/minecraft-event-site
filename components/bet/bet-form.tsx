"use client";

import type { BetFormSchemaType } from "@/lib/schema";
import { submitBet, type FormState } from "@/actions/bet";
import { Fragment, useActionState, useEffect, useRef, useState } from "react";
import {
  McPanel,
  McHeading,
  McLabel,
  McInput,
  McButton,
  mcErrorClass,
} from "@/components/ui/mc";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { cn } from "@/lib/utils";

const initialState: FormState = {};

// Clamp an uncontrolled number input to [min, max] on blur.
function clampOnBlur(min: number, max: number) {
  return (e: React.FocusEvent<HTMLInputElement>) => {
    const n = parseFloat(e.target.value);
    if (Number.isNaN(n)) return;
    e.target.value = String(Math.min(max, Math.max(min, n)));
  };
}

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
        <span>{label}</span>
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

  const [failing, setFailing] = useState<boolean>(
    state.values?.guessIsFailing === "on" || initial?.guessIsFailing || false,
  );
  const failingRef = useRef<HTMLInputElement>(null);

  // React 19 resets the <form> DOM after each action. Uncontrolled inputs
  // re-fill from defaultValue, but the controlled checkbox would desync (DOM
  // unchecked, state still true) — re-sync it from the returned values when a
  // new action result arrives (adjust-state-during-render, no effect needed).
  const [seenState, setSeenState] = useState(state);
  if (state !== seenState) {
    setSeenState(state);
    if (state.values) setFailing(state.values.guessIsFailing === "on");
  }

  useEffect(() => {
    if (state.success) onSuccessAction?.();
  }, [state.success, onSuccessAction]);

  return (
    <McPanel>
      <LoadingOverlay show={isPending} label="Submitting bet..." />
      <McHeading className="mb-4">Make a Prediction</McHeading>

      {state.error && <p className={mcErrorClass}>{state.error}</p>}

      <form action={formAction} className="flex flex-col">
        <FieldRow label="Deaths" error={state.errors?.guessDeaths?.[0]}>
          <McInput
            name="guessDeaths"
            className="w-24 text-right"
            type="number"
            min={0}
            required
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
            required={!failing}
            className={cn("w-24 text-right", failing && "opacity-40")}
            defaultValue={state.values?.guessHearts ?? initial?.guessHearts}
            onBlur={clampOnBlur(0, 10)}
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
          <div className="flex items-center gap-1">
            {(
              [
                ["hours", 11],
                ["minutes", 59],
                ["seconds", 59],
              ] as const
            ).map(([name, max], i) => (
              <Fragment key={name}>
                {i > 0 && (
                  <span className="font-minecraft text-[#fcfcfc]">:</span>
                )}
                <McInput
                  name={name}
                  type="number"
                  min={0}
                  max={max}
                  required={!failing}
                  className={cn("w-12 text-center", failing && "opacity-40")}
                  placeholder={name[0]}
                  defaultValue={
                    state.values?.[name] ??
                    (initial?.[name] as number | undefined)
                  }
                  onBlur={clampOnBlur(0, max)}
                />
              </Fragment>
            ))}
          </div>
        </FieldRow>

        <div className="flex cursor-pointer items-center gap-2 border-b border-black/15 py-2">
          <input
            ref={failingRef}
            type="checkbox"
            name="guessIsFailing"
            checked={failing}
            onChange={(e) => setFailing(e.target.checked)}
            className="h-4 w-4 accent-[#a13b3b]"
          />
          <McLabel
            className="cursor-pointer"
            onClick={() => failingRef.current?.click()}
          >
            I don&apos;t think you&apos;ll beat Jean, no offense :p
          </McLabel>
        </div>

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
