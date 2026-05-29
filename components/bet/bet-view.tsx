import { getViewerBet, type ViewerBet } from "@/actions/bet";
import BetCard from "./bet-card";

export default async function BetView() {
  const viewerBet = (await getViewerBet()) as ViewerBet;
  return <BetCard bet={viewerBet} />;
}
