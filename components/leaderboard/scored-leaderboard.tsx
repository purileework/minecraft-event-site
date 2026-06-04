import { getScoredLeaderboard } from "@/lib/queries/leaderboard";
import { getViewerBet } from "@/actions/bet";
import LeaderboardList from "./leaderboard-list";

export default async function ScoredLeaderboard() {
  const rows = await getScoredLeaderboard();
  const viewerBet = await getViewerBet();
  const viewerUsername = viewerBet.latest?.username ?? null;

  return <LeaderboardList rows={rows} viewerUsername={viewerUsername} />;
}
