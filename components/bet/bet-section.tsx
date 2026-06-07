"use client";

import BetForm from "./bet-form";
import BetCard from "./bet-card";
import type { ViewerBet } from "@/actions/bet";
import { useRunStatus } from "@/lib/use-run-status";

// Renders the viewer's bet UI and keeps it in sync with the live run status.
// Betting closes the moment poppang enters the nether (or the run ends): the
// form disappears and an existing card flips to read-only without a reload.
export default function BetSection({
  viewerBet,
  runEnded,
  initialNetherClosed,
  initialDeathCount,
  runStartedAt,
  totalPausedSeconds,
  pausedAt,
}: {
  viewerBet: ViewerBet;
  runEnded: boolean;
  initialNetherClosed: boolean;
  initialDeathCount: number;
  runStartedAt: Date | null;
  totalPausedSeconds: number;
  pausedAt: Date | null;
}) {
  const { netherClosed, deathCount } = useRunStatus({
    netherClosed: initialNetherClosed,
    deathCount: initialDeathCount,
  });
  const closed = netherClosed || runEnded;

  if (viewerBet.count === 0) {
    return closed ? null : <BetForm />;
  }

  return (
    <BetCard
      bet={viewerBet}
      readOnly={closed}
      deathCount={deathCount}
      runStartedAt={runStartedAt}
      totalPausedSeconds={totalPausedSeconds}
      pausedAt={pausedAt}
    />
  );
}
