import type { ScoredLeaderboardRow } from "@/lib/queries/leaderboard";
import { cn, formatHearts, formatTime } from "@/lib/utils";

const panelSurface =
  "bg-[#6B6B6E] outline outline-[3px] outline-black border-b-[6px] border-b-[#313233] shadow-[inset_0_0_0_3px_#9C9EA1]";

// Top 3 rank circles: gold, silver, bronze.
const RANK_BG: Record<number, string> = {
  1: "bg-[#ffd700]/60",
  2: "bg-[#c0c0c0]/60",
  3: "bg-[#cd7f32]/60",
};

function Cell({
  guess,
  score,
  width,
}: {
  guess: string;
  score: number;
  width: string;
}) {
  return (
    <span
      className={cn(
        "hidden shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-1 tabular-nums sm:grid",
        width,
      )}
    >
      <span className="text-right text-[#b8b8b8]">{guess}</span>
      <span className="text-white/30">|</span>
      <span className="text-left text-[#fcfcfc]">{score}</span>
    </span>
  );
}

function HeaderBlock() {
  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-black/40 bg-[#6B6B6E] p-4 pb-1 text-sm tracking-wide text-[#fcfcfc] uppercase shadow-[inset_3px_0_0_0_#9C9EA1,inset_-3px_0_0_0_#9C9EA1,inset_0_3px_0_0_#9C9EA1] [text-shadow:2px_2px_0_#3e3e3e]">
      <span className="w-6 shrink-0 text-center">#</span>
      <span className="min-w-0 flex-1">username</span>
      <span className="hidden w-28 shrink-0 text-center sm:block">Deaths</span>
      <span className="hidden w-28 shrink-0 text-center sm:block">Hearts</span>
      <span className="hidden w-32 shrink-0 text-center sm:block">Time</span>
      <span className="w-26 shrink-0 text-right whitespace-nowrap">
        Total Score
      </span>
    </div>
  );
}

function LeaderboardRow({
  row,
  isViewer,
  pinned,
}: {
  row: ScoredLeaderboardRow;
  isViewer: boolean;
  pinned?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2 text-sm leading-tight text-[#fcfcfc]",
        pinned &&
          "sticky top-0 z-10 border-b border-black/40 bg-[#6B6B6E] shadow-[inset_3px_0_0_0_#9C9EA1,inset_-3px_0_0_0_#9C9EA1]",
        isViewer && pinned && "bg-[#48494a]",
      )}
    >
      <span
        className={cn(
          "shrink-0 tabular-nums",
          row.rank <= 3
            ? cn(
                "flex h-6 w-6 items-center justify-center rounded-sm leading-none text-[#1f1f1f]",
                RANK_BG[row.rank],
              )
            : "w-6 text-center text-[#b8b8b8]",
        )}
      >
        <span className="translate-y-[2px]">{row.rank}</span>
      </span>

      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span style={{ color: row.color ?? undefined }}>{row.username}</span>
        {row.calledFailure && (
          <span className="font-minecraft shrink-0 rounded-sm bg-[#a13b3b]/70 px-1 text-xs whitespace-nowrap text-[#fcfcfc]">
            💀 called the failure
          </span>
        )}
      </span>

      <Cell
        guess={String(row.guessDeaths)}
        score={row.deathsScore}
        width="w-28"
      />
      <Cell
        guess={
          row.guessIsFailing
            ? "💀"
            : row.guessHearts === null
              ? "—"
              : formatHearts(row.guessHearts)
        }
        score={row.heartsScore}
        width="w-28"
      />
      <Cell
        guess={
          row.guessIsFailing
            ? "💀"
            : row.guessTime === null
              ? "—"
              : formatTime(row.guessTime)
        }
        score={row.timeScore}
        width="w-32"
      />

      <span className="text-teal w-26 shrink-0 text-right text-lg tabular-nums">
        {row.totalScore}
      </span>
    </div>
  );
}

export default function LeaderboardList({
  rows,
  viewerUsername,
}: {
  rows: ScoredLeaderboardRow[];
  viewerUsername?: string | null;
}) {
  if (rows.length === 0) {
    return (
      <div className="font-minecraft text-center text-white/60">
        No bets to score.
      </div>
    );
  }

  const viewerRow = viewerUsername
    ? rows.find((r) => r.username === viewerUsername)
    : undefined;
  const rest = viewerRow ? rows.filter((r) => r !== viewerRow) : rows;

  return (
    <div
      className={cn(
        "font-minecraft flex max-h-[80dvh] min-h-[250px] flex-col overflow-hidden",
        panelSurface,
      )}
    >
      <HeaderBlock />
      <div className="min-h-0 flex-1 overflow-y-auto">
        {viewerRow && <LeaderboardRow row={viewerRow} isViewer pinned />}
        <div className="divide-y divide-white/10">
          {rest.map((row) => (
            <LeaderboardRow key={row.username} row={row} isViewer={false} />
          ))}
        </div>
      </div>
    </div>
  );
}
