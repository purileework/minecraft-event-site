import { getViewerBet } from "@/actions/bet";
import BetForm from "@/components/bet/bet-form";
import BetView from "@/components/bet/bet-view";
import Leaderboard from "@/components/leaderboard/leaderboard";

export default async function Home() {
  const viewerBet = await getViewerBet();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div>make a prediction c:</div>
      {viewerBet.count === 0 ? (
        <div className="max-w-3xl w-full mx-auto">
          <BetForm />
        </div>
      ) : (
        <div className="max-w-xl w-full mx-auto">
          <BetView />
        </div>
      )}
      <Leaderboard />
    </div>
  );
}
