import type { ScoredLeaderboardRow } from "@/lib/queries/leaderboard";
import { cn, formatHearts, formatTime } from "@/lib/utils";

const panelSurface =
  "bg-[#58585a] outline outline-[3px] outline-black border-b-[6px] border-b-[#313233] shadow-[inset_0_0_0_3px_#79797b]";

// Top 3 rows get a purple tint of decreasing intensity.
const ROW_STYLES: Record<number, string> = {
  1: "bg-[#280050]",
  2: "bg-[#280050]/60",
  3: "bg-[#280050]/30",
};

// Top 3 rank numbers: gold, silver, bronze.
const RANK_STYLES: Record<number, string> = {
  1: "text-[#ffd700]",
  2: "text-[#c0c0c0]",
  3: "text-[#cd7f32]",
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
    <div className="sticky top-0 z-20 border-b border-black/40 bg-[#58585a]">
      <div className="flex h-9 items-center gap-3 px-3 text-xs tracking-wide text-[#fcfcfc] uppercase [text-shadow:2px_2px_0_#3e3e3e]">
        <span className="h-3 w-3 shrink-0" />
        <span className="w-6 shrink-0 text-right">#</span>
        <span className="min-w-0 flex-1">username</span>
        <span className="hidden w-28 shrink-0 text-center sm:block">
          Deaths
        </span>
        <span className="hidden w-28 shrink-0 text-center sm:block">
          Hearts
        </span>
        <span className="hidden w-32 shrink-0 text-center sm:block">Time</span>
        <span className="w-14 shrink-0 text-right">Total</span>
      </div>
      <div className="hidden h-5 items-center gap-3 px-3 text-[10px] text-white/50 sm:flex">
        <span className="h-3 w-3 shrink-0" />
        <span className="w-6 shrink-0" />
        <span className="min-w-0 flex-1" />
        <span className="grid w-28 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-1">
          <span className="text-right">guess</span>
          <span>|</span>
          <span className="text-left">score</span>
        </span>
        <span className="grid w-28 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-1">
          <span className="text-right">guess</span>
          <span>|</span>
          <span className="text-left">score</span>
        </span>
        <span className="grid w-32 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-1">
          <span className="text-right">guess</span>
          <span>|</span>
          <span className="text-left">score</span>
        </span>
        <span className="w-14 shrink-0" />
      </div>
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
        "flex items-center gap-3 px-3 py-2 text-sm leading-tight text-[#fcfcfc]",
        ROW_STYLES[row.rank],
        pinned && "sticky top-0 z-10 border-b border-black/40 bg-[#58585a]",
        isViewer && pinned && "bg-[#48494a]",
      )}
    >
      <span
        className={cn(
          "w-6 shrink-0 text-right tabular-nums",
          RANK_STYLES[row.rank] ?? "text-[#b8b8b8]",
        )}
      >
        {row.rank}
      </span>

      <span className="flex min-w-0 flex-1 gap-2">
        <span>{row.username}</span>
      </span>

      <Cell
        guess={String(row.guessDeaths)}
        score={row.deathsScore}
        width="w-28"
      />
      <Cell
        guess={formatHearts(row.guessHearts)}
        score={row.heartsScore}
        width="w-28"
      />
      <Cell
        guess={formatTime(row.guessTime)}
        score={row.timeScore}
        width="w-32"
      />

      <span className="text-teal w-14 shrink-0 text-right text-lg tabular-nums">
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
        "font-minecraft flex min-h-0 flex-1 flex-col overflow-hidden",
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
