"use client";

import { useEffect, useState } from "react";
import type { LeaderboardSnapshot } from "@/app/api/leaderboard/route";

const POLL_MS = 5000;

type RunStatus = { deathCount: number; netherClosed: boolean };

// Polls /api/leaderboard for the live run status (death count + whether the
// nether has been entered, which closes betting). Seeds from SSR values so the
// first paint is correct, then keeps them fresh. On any fetch/parse error the
// last good status stays.
export function useRunStatus(initial: RunStatus): RunStatus {
  const [status, setStatus] = useState(initial);

  useEffect(() => {
    let active = true;
    async function poll() {
      try {
        const res = await fetch("/api/leaderboard", { cache: "no-store" });
        if (!res.ok) return;
        const data: LeaderboardSnapshot = await res.json();
        if (active) {
          setStatus({
            deathCount: data.deathCount,
            netherClosed: data.netherClosed,
          });
        }
      } catch {
        // ignore — keep last good status
      }
    }

    const id = setInterval(poll, POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return status;
}
