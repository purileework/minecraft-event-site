"use client";

import { useEffect, useState } from "react";
import { getRunState, type RunState } from "@/actions/overlay";
import { formatTime } from "@/lib/utils";
import { McPanel } from "@/components/ui/mc";
import Image from "next/image";
import lily from "@/public/assets/Lily_of_the_Valley.webp";

function elapsedSeconds(run: RunState, now: number): number {
  if (!run.startedAt) return 0;
  const start = new Date(run.startedAt).getTime();
  const end = run.finishedAt
    ? new Date(run.finishedAt).getTime() // stopped
    : run.pausedAt
      ? new Date(run.pausedAt).getTime() // frozen
      : now; // live
  return Math.max(0, Math.floor((end - start) / 1000) - run.totalPausedSeconds);
}

export default function StatsOverlay({ initial }: { initial: RunState }) {
  const [run, setRun] = useState(initial);
  const [now, setNow] = useState(() => Date.now());

  // Local tick for the live timer.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Poll the run state (deaths, pause, finish) from the server.
  useEffect(() => {
    const id = setInterval(async () => setRun(await getRunState()), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mt-10 w-55 p-4">
      <Image
        src={lily}
        alt="lily"
        className="pointer-events-none absolute bottom-full left-6 h-auto w-14 translate-y-4 [image-rendering:pixelated]"
        priority
      />
      <McPanel className="flex justify-between gap-6 p-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#bdbdbd] uppercase">Time</span>
          <span className="text-2xl text-[#fcfcfc] tabular-nums">
            {formatTime(elapsedSeconds(run, now))}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-[#bdbdbd] uppercase">Deaths</span>
          <span className="text-right text-2xl text-[#fcfcfc] tabular-nums">
            {run.deathCount}
          </span>
        </div>
      </McPanel>
    </div>
  );
}
