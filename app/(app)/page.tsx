import { getViewerBet } from "@/actions/bet";
import BetForm from "@/components/bet/bet-form";
import BetView from "@/components/bet/bet-view";
import Leaderboard from "@/components/leaderboard/leaderboard";
import ScoredLeaderboard from "@/components/leaderboard/scored-leaderboard";
import ResultsHeader from "@/components/leaderboard/results-header";
import { McHeading, McLabel, McPanel } from "@/components/ui/mc";
import { McTooltip } from "@/components/ui/mc-tooltip";
import { getRun } from "@/lib/queries/leaderboard";

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
        className="absolute top-1/2 left-1/2 h-[56.25vw] min-h-screen w-screen min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2"
      />
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}

export default async function Home() {
  const run = await getRun();
  const runEnded = run.finishedAt !== null;
  const viewerBet = await getViewerBet();

  return (
    <main className="flex h-dvh flex-col overflow-hidden font-sans lg:flex-row lg:justify-center lg:gap-4">
      <VideoBackground id="DPXs4YlNl7k" />

      {/* Left: Result and prediction */}
      <div className="flex w-full max-w-[800px] flex-col gap-4 overflow-y-auto p-6 lg:w-[420px] lg:shrink-0">
        <div className="font-minecraft text-teal text-lg uppercase [text-shadow:2px_2px_0_#000]">
          Make a Prediction c:
        </div>
        <McPanel>
          <McHeading>Welcome</McHeading>
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
            <span className="text-teal underline decoration-dotted">
              poppang
            </span>
          </McTooltip>{" "}
          tries to beat the ender dragon, can she do it in 24hrs?
          <br />
          make a prediction on death count, hearts at moment of dragon killing,
          and how long it takes her.
          <br />
          <McLabel className="mt-1 border-b-2 border-black/25 pb-1">
            Rules
          </McLabel>
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
                  </>
                }
              >
                <span className="text-teal underline decoration-dotted">
                  close
                </span>
              </McTooltip>{" "}
              to the real values they are.
            </li>
            <li>
              2. you can edit your guesses <span className="text-teal">2</span>{" "}
              times
            </li>
            <li>
              3. guess making / editing closes once poppang enters the nether
              for the first time
            </li>
            <li>4. results revealed after dragon is killed or 24hrs is up</li>
          </ol>
        </McPanel>
        {runEnded && (
          <McPanel className="p-4">
            <ResultsHeader run={run} />
          </McPanel>
        )}

        {viewerBet.count === 0 ? <BetForm /> : <BetView />}
      </div>

      {/* Right: leaderboard table */}
      <div className="flex min-h-0 w-full flex-col gap-4 p-6 lg:w-[800px]">
        <div className="font-minecraft text-teal text-lg uppercase [text-shadow:2px_2px_0_#000]">
          Predictions
        </div>
        {runEnded ? <ScoredLeaderboard /> : <Leaderboard />}
      </div>
    </main>
  );
}
