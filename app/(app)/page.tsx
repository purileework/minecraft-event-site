import { getViewerBet } from "@/actions/bet";
import BetSection from "@/components/bet/bet-section";
import EventTabs from "@/components/event/event-tabs";
import LiveLeaderboard from "@/components/leaderboard/live-leaderboard";
import ScoredLeaderboard from "@/components/leaderboard/scored-leaderboard";
import ResultsHeader from "@/components/leaderboard/results-header";
import { McLabel, McPanel } from "@/components/ui/mc";
import { McTooltip } from "@/components/ui/mc-tooltip";
import { SignInButton, SignOutButton } from "@/components/auth/auth-buttons";
import ColorSync from "@/components/auth/color-sync";
import { getLeaderboardBets, getRun } from "@/lib/queries/leaderboard";
import { auth } from "@/auth";

function VideoBackground({ id }: { id: string }) {
  const src =
    `https://www.youtube.com/embed/${id}` +
    `?autoplay=1&mute=1&loop=1&playlist=${id}` +
    `&controls=0&playsinline=1&modestbranding=1&rel=0`;
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <iframe
        src={src}
        allow="autoplay; encrypted-media"
        title="background"
        tabIndex={-1}
        className="pointer-events-none absolute top-1/2 left-1/2 h-[56.25vw] min-h-screen w-screen min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2"
      />
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}

export default async function Home() {
  const run = await getRun();
  const runEnded = run.finishedAt !== null;
  const enteredNether = run.netherEnterTime !== null;
  const session = await auth();
  const isAuthed = !!session?.user?.id;
  const viewerBet = await getViewerBet();
  // SSR the initial leaderboard so first paint has real content; the client
  // component then polls /api/leaderboard for live updates.
  const leaderboardRows = runEnded ? [] : await getLeaderboardBets();

  const rules = (
    <>
      <McTooltip
        content={
          <>
            <div className="text-[#ffaaff]">poppang 🐰</div>
            <div className="text-[#aaaaaa]">fav block: sea lantern</div>
            <div className="mt-2 text-[#55ff55]">determination: III</div>
            <div className="text-[#ff5555]">sense of direction: 0</div>
          </>
        }
      >
        <span className="text-teal underline decoration-dotted">poppang</span>
      </McTooltip>{" "}
      is trying to beat the ender dragon, can she do it in
      <span className="text-teal"> 12hrs?</span>
      <br />
      make a prediction on death count, hearts at moment of dragon killing, and
      how long it takes her.
      <br />
      <McLabel className="mt-1 border-b-2 border-black/25 pb-1">Rules</McLabel>
      <ol>
        <li>
          1. guesses will be scored on how{" "}
          <McTooltip
            content={
              <>
                <div className="text-[#55ffff]">Scoring</div>
                <div className="mt-1 text-[#aaaaaa]">per category:</div>
                <div className="text-[#55ff55]">
                  100 − (|guess − real| ÷ max) × 100
                </div>
                <div className="mt-2 text-[#aaaaaa]">max difference:</div>
                <div>Deaths: 10</div>
                <div>Hearts: 10</div>
                <div>Time: 20 min</div>
                <div className="mt-2 text-[#ffff55]">
                  total = deaths + hearts + time
                </div>
                <div className="mt-2 text-[#ffff55]">
                  in the case of score ties, first to submit bet wins
                </div>
              </>
            }
          >
            <span className="text-teal underline decoration-dotted">close</span>
          </McTooltip>{" "}
          to the real values they are.
        </li>
        <li>
          2. you can edit your guesses <span className="text-teal">2</span>{" "}
          times
        </li>
        <li>
          3. guess making / editing
          <span className="text-teal"> closes </span>
          once poppang meets the dragon
        </li>
        <li>4. results revealed after dragon is killed OR 12hrs is up</li>
      </ol>
      {!isAuthed && !runEnded && (
        <McPanel className="mt-4 flex flex-col gap-3 p-4">
          <span className="font-minecraft text-[#fcfcfc] [text-shadow:2px_2px_0_#3e3e3e]">
            Sign in to place your prediction.
          </span>
          <SignInButton />
        </McPanel>
      )}
    </>
  );

  const prediction = (
    <div className="flex flex-col gap-4">
      {isAuthed ? (
        <>
          <ColorSync />
          <BetSection
            viewerBet={viewerBet}
            runEnded={runEnded}
            initialNetherClosed={enteredNether}
            initialDeathCount={run.deathCount}
            runStartedAt={run.startedAt}
            totalPausedSeconds={run.totalPausedSeconds}
            pausedAt={run.pausedAt}
          />
        </>
      ) : runEnded ? (
        <span className="font-minecraft text-[#fcfcfc] [text-shadow:2px_2px_0_#3e3e3e]">
          event ended join us next time c:
        </span>
      ) : (
        <McPanel className="flex flex-col gap-3 p-4">
          <span className="font-minecraft text-[#fcfcfc] [text-shadow:2px_2px_0_#3e3e3e]">
            Sign in to place your prediction.
          </span>
          <SignInButton />
        </McPanel>
      )}
    </div>
  );

  return (
    <main className="flex min-h-dvh flex-col font-sans lg:flex-row lg:items-start lg:justify-center lg:gap-4">
      <VideoBackground id="DPXs4YlNl7k" />

      {/* Left: results + rules/prediction tabs */}
      <div className="flex w-full max-w-[800px] flex-col gap-3 p-3 pb-0 sm:gap-4 sm:p-6 sm:pb-0 lg:w-[420px] lg:shrink-0 lg:pr-1 lg:pb-6">
        {runEnded && (
          <McPanel className="p-4">
            <ResultsHeader run={run} />
          </McPanel>
        )}
        <EventTabs
          name={session?.user?.name ?? "viewer"}
          signedIn={isAuthed}
          signOut={isAuthed && <SignOutButton className="shrink-0" />}
          rules={rules}
          prediction={prediction}
        />
      </div>

      {/* Right: leaderboard table */}
      <div className="flex w-full flex-col p-3 sm:p-6 lg:w-[800px] lg:pl-0">
        {runEnded ? (
          <ScoredLeaderboard />
        ) : (
          <LiveLeaderboard
            initialRows={leaderboardRows}
            initialDeathCount={run.deathCount}
            initialNetherClosed={enteredNether}
          />
        )}
      </div>
    </main>
  );
}
