"use client";

import { useState, useTransition } from "react";
import BetForm from "./bet-form";
import { resetBets, type ViewerBet } from "@/actions/bet";
import { cn, formatHearts, formatTime, splitTime } from "@/lib/utils";
import { McPanel, McHeading, McButton, McStat } from "@/components/ui/mc";

export default function BetCard({
  bet,
  readOnly = false,
  deathCount = 0,
}: {
  bet: ViewerBet;
  readOnly?: boolean;
  deathCount?: number;
}) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (bet.count == 0) {
    return <>no bets found</>;
  }

  const latestTime = splitTime(bet.latest.guessTime);
  const canEdit = bet.count < 3;

  const handleClear = () => {
    startTransition(async () => {
      const res = await resetBets();
      if (!res.success) {
        console.error(res.error);
      }
    });
  };

  if (editing) {
    return (
      <div className="flex flex-col gap-2">
        <BetForm
          onCancel={() => setEditing(false)}
          onSuccessAction={() => setEditing(false)}
          initial={{
            guessDeaths: bet.latest.guessDeaths,
            guessHearts: bet.latest.guessHearts / 2,
            hours: latestTime.hours,
            minutes: latestTime.minutes,
            seconds: latestTime.seconds,
          }}
        />
        =
      </div>
    );
  }

  return (
    <McPanel>
      <div className="mb-4 flex items-center justify-between border-b-2 border-black/25 pb-1">
        <McHeading className="border-b-0 pb-0">Your Prediction</McHeading>
        <span className="font-minecraft text-md text-[#fcfcfc]">
          {bet.count}/3
        </span>
      </div>

      <div className="mb-4 flex flex-col">
        <McStat
          label="Deaths"
          value={String(bet.latest.guessDeaths)}
          valueClassName={cn(
            deathCount > bet.latest.guessDeaths && "text-[#ff5555]/60",
          )}
        />
        <McStat label="Hearts" value={formatHearts(bet.latest.guessHearts)} />
        <McStat label="Time" value={formatTime(bet.latest.guessTime)} />
      </div>

      {!readOnly && (
        <div className="flex gap-2">
          <McButton
            disabled={!canEdit || isPending}
            onClick={() => setEditing(true)}
            className="flex-1"
          >
            Edit
          </McButton>
          <McButton
            disabled={isPending}
            onClick={handleClear}
            className="flex-1"
            variant="danger"
          >
            {isPending ? "Clearing..." : "Clear"}
          </McButton>
        </div>
      )}
    </McPanel>
  );
}
