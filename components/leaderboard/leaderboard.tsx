import { getLeaderboardBets, getRun } from "@/lib/queries/leaderboard";
import { cn, formatHearts, formatTime } from "@/lib/utils";

const MAX_BETS = 3;

export default async function Leaderboard() {
  const rows = await getLeaderboardBets();
  const currentRun = await getRun();

  if (currentRun.netherEnterTime !== null) {
    return (
      <div className="font-minecraft text-teal [text-shadow:2px_2px_0_#000]">
        Poppang has entered the nether. Bets are closed. Who will win? c:
      </div>
    );
  }

  return (
    <div className="font-minecraft flex min-h-0 flex-1 flex-col overflow-hidden bg-[#58585a] outline outline-[3px] outline-black border-b-[3px] border-b-[#313233] shadow-[inset_0_0_0_3px_#79797b]">
      {/* header pinned above the scroll */}
      <div className="flex h-9 items-center gap-3 border-b border-black/40 bg-[#58585a] px-3 text-xs uppercase tracking-wide text-[#cfcfcf]">
        <span className="h-3 w-3 shrink-0" />
        <span className="w-6 shrink-0 text-right">#</span>
        <span className="min-w-0 flex-1">Player</span>
        <span className="hidden w-28 shrink-0 text-right sm:block">Deaths</span>
        <span className="hidden w-28 shrink-0 text-right sm:block">Hearts</span>
        <span className="hidden w-32 shrink-0 text-right sm:block">Time</span>
        <span className="w-14 shrink-0 text-right">Bets</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {rows.length === 0 ? (
          <div className="p-4 text-center text-sm text-white/60">
            No bets yet
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {rows.map((row, i) => (
              <div
                key={row.username}
                className="flex items-center gap-3 px-3 py-2 text-sm leading-tight text-[#fcfcfc]"
              >
                <span className="h-3 w-3 shrink-0 rounded-full bg-white/30" />
                <span className="w-6 shrink-0 text-right tabular-nums text-[#b8b8b8]">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate">{row.username}</span>
                <span
                  className={cn(
                    "hidden w-28 shrink-0 text-right tabular-nums sm:block",
                    currentRun.deathCount > row.guessDeaths &&
                      "text-white/40 line-through",
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
