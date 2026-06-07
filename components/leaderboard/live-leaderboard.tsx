"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Infinity as InfinityIcon } from "lucide-react";
import type { LeaderboardRow } from "@/lib/queries/leaderboard";
import type { LeaderboardSnapshot } from "@/app/api/leaderboard/route";
import { McPanel } from "@/components/ui/mc";
import { cn, formatHearts, formatTime } from "@/lib/utils";

const MAX_BETS = 3;
const POLL_MS = 5000;

function Row({ row, deathCount }: { row: LeaderboardRow; deathCount: number }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 text-xs leading-tight text-[#fcfcfc] sm:gap-3 sm:px-4 sm:text-sm">
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate" style={{ color: row.color ?? undefined }}>
          {row.username}
        </span>
      </span>
      <span
        className={cn(
          "w-14 shrink-0 text-right tabular-nums sm:w-28",
          deathCount > row.guessDeaths && "text-[#ff5555]/60",
        )}
      >
        {row.guessDeaths}
      </span>
      <span className="flex w-14 shrink-0 justify-end tabular-nums sm:w-28">
        {row.guessIsFailing || row.guessHearts === null ? (
          <InfinityIcon className="h-4 w-4" aria-label="predicts failure" />
        ) : (
          formatHearts(row.guessHearts)
        )}
      </span>
      <span className="flex w-16 shrink-0 justify-end tabular-nums sm:w-32">
        {row.guessIsFailing || row.guessTime === null ? (
          <InfinityIcon className="h-4 w-4" aria-label="predicts failure" />
        ) : (
          formatTime(row.guessTime)
        )}
      </span>
      <span className="w-16 shrink-0 text-right tabular-nums sm:w-14">
        {row.betsUsed}/{MAX_BETS}
      </span>
    </div>
  );
}

export default function LiveLeaderboard({
  initialRows,
  initialDeathCount,
  initialNetherClosed,
}: {
  initialRows: LeaderboardRow[];
  initialDeathCount: number;
  initialNetherClosed: boolean;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [deathCount, setDeathCount] = useState(initialDeathCount);
  const [netherClosed, setNetherClosed] = useState(initialNetherClosed);

  useEffect(() => {
    // Poll the snapshot endpoint. On any network/parse error, keep the last
    // good data instead of crashing or flashing empty.
    async function poll() {
      try {
        const res = await fetch("/api/leaderboard", { cache: "no-store" });
        if (!res.ok) return;
        const data: LeaderboardSnapshot = await res.json();
        // Run just ended: refresh the server component so the page swaps this
        // live view for the scored leaderboard (and reveals results).
        if (data.runEnded) {
          router.refresh();
          return;
        }
        setRows(data.rows);
        setDeathCount(data.deathCount);
        setNetherClosed(data.netherClosed);
      } catch {
        // ignore — last good state stays on screen
      }
    }

    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [router]);

  if (netherClosed) {
    return (
      <McPanel className="text-teal text-center [text-shadow:2px_2px_0_#000]">
        Poppang has entered the nether.
        <br />
        Pediction changes are closed. Let&apos;s see who wins c:
      </McPanel>
    );
  }

  return (
    <div className="font-minecraft flex max-h-[80dvh] min-h-[250px] flex-col overflow-hidden border-b-8 border-b-[#313233] bg-[#6B6B6E] shadow-[inset_0_0_0_3px_#9C9EA1] outline-[3px] outline-black">
      {/* header pinned above the scroll */}
      <div className="flex items-center gap-2 border-b border-black/40 bg-[#6B6B6E] p-3 pb-1 text-xs tracking-wide text-[#fcfcfc] uppercase shadow-[inset_3px_0_0_0_#9C9EA1,inset_-3px_0_0_0_#9C9EA1,inset_0_3px_0_0_#9C9EA1] [text-shadow:2px_2px_0_#3e3e3e] sm:gap-3 sm:p-4 sm:pb-1 sm:text-sm">
        <span className="min-w-0 flex-1">Player</span>
        <span className="w-14 shrink-0 text-right sm:w-28">Deaths</span>
        <span className="w-14 shrink-0 text-right sm:w-28">Hearts</span>
        <span className="w-16 shrink-0 text-right sm:w-32">Time</span>
        <span className="w-16 shrink-0 text-right sm:w-14">Guesses</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {rows.length === 0 ? (
          <div className="p-4 text-center text-sm text-white/60">
            No bets yet
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {rows.map((row) => (
              <Row key={row.username} row={row} deathCount={deathCount} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
