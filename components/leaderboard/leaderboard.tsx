import {
  getLeaderboardBets,
  getRun,
  type LeaderboardRow,
} from "@/lib/queries/leaderboard";
import { cn, formatHearts, formatTime } from "@/lib/utils";

const MAX_BETS = 3;

function Row({ row, deathCount }: { row: LeaderboardRow; deathCount: number }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 text-sm leading-tight text-[#fcfcfc]">
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate" style={{ color: row.color ?? undefined }}>
          {row.username}
        </span>
      </span>
      <span
        className={cn(
          "hidden w-28 shrink-0 text-right tabular-nums sm:block",
          deathCount > row.guessDeaths && "text-[#ff5555]/60",
        )}
      >
        {row.guessDeaths}
      </span>
      <span className="hidden w-28 shrink-0 text-right tabular-nums sm:block">
        {formatHearts(row.guessHearts)}
      </span>
      <span className="hidden w-32 shrink-0 text-right tabular-nums sm:block">
        {formatTime(row.guessTime)}
      </span>
      <span className="w-14 shrink-0 text-right tabular-nums">
        {row.betsUsed}/{MAX_BETS}
      </span>
    </div>
  );
}

export default async function Leaderboard() {
  const rows = await getLeaderboardBets();
  const currentRun = await getRun();

  if (currentRun.netherEnterTime !== null) {
    return (
      <div className="font-minecraft text-teal [text-shadow:2px_2px_0_#000]">
        Poppang has entered the nether. Bets are closed. Let&apos;s see who wins
        c:
      </div>
    );
  }

  return (
    <div className="font-minecraft flex min-h-[250px] flex-col overflow-hidden border-b-8 border-b-[#313233] bg-[#6B6B6E] shadow-[inset_0_0_0_3px_#9C9EA1] outline-[3px] outline-black">
      {/* header pinned above the scroll */}
      <div className="flex items-center gap-3 border-b border-black/40 bg-[#6B6B6E] p-4 pb-1 text-sm tracking-wide text-[#fcfcfc] uppercase shadow-[inset_3px_0_0_0_#9C9EA1,inset_-3px_0_0_0_#9C9EA1,inset_0_3px_0_0_#9C9EA1] [text-shadow:2px_2px_0_#3e3e3e]">
        <span className="min-w-0 flex-1">Player</span>
        <span className="hidden w-28 shrink-0 text-right sm:block">Deaths</span>
        <span className="hidden w-28 shrink-0 text-right sm:block">Hearts</span>
        <span className="hidden w-32 shrink-0 text-right sm:block">Time</span>
        <span className="w-14 shrink-0 text-right">Guesses</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {rows.length === 0 ? (
          <div className="p-4 text-center text-sm text-white/60">
            No bets yet
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {rows.map((row) => (
              <Row
                key={row.username}
                row={row}
                deathCount={currentRun.deathCount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
