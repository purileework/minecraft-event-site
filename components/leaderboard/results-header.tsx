import type { Run } from "@/db/schema";
import { getRunTimeSeconds } from "@/lib/time";
import { formatHearts, formatTime } from "@/lib/utils";
import { McHeading, McStat } from "@/components/ui/mc";

export default function ResultsHeader({ run }: { run: Run }) {
  const totalTimeSeconds = getRunTimeSeconds(run);

  if (run.runOutcome === "failed") {
    return (
      <div className="flex flex-col gap-2">
        <McHeading>Results :c</McHeading>
        <p className="font-minecraft text-[#ff5555] [text-shadow:2px_2px_0_#3f0000]">
          The dragon won this time
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <McHeading>Results!! :D</McHeading>
      <div className="flex flex-col">
        <McStat label="Deaths" value={String(run.deathCount)} />
        <McStat
          label="Hearts"
          value={run.heartCount === null ? "—" : formatHearts(run.heartCount)}
        />
        <McStat
          label="Time"
          value={totalTimeSeconds === null ? "—" : formatTime(totalTimeSeconds)}
        />
      </div>
    </div>
  );
}
