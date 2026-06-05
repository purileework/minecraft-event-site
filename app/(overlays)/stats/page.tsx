import { getRunState } from "@/actions/overlay";
import StatsOverlay from "@/components/overlay/stats-overlay";

export default async function StatsPage() {
  const initial = await getRunState();
  return <StatsOverlay initial={initial} />;
}
