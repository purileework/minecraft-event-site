"use client";
import { useOptimistic, startTransition, useState, useEffect } from "react";
import { formatDateTime, formatTime } from "@/lib/utils";
import {
  McPanel,
  McHeading,
  McLabel,
  McButton,
  McInput,
} from "@/components/ui/mc";
import type { Run } from "@/db/schema";
import {
  toggleNether,
  startRun,
  decreaseDeath,
  addDeath,
  endRun,
  pauseRun,
  resumeRun,
  resetRun,
  setHeartCount,
} from "@/actions/admin";

interface AdminPanelProps {
  run: Run;
}

function Divider() {
  return <div className="my-1 h-0.5 bg-[#555] shadow-[0_1px_0_0_#fff]" />;
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <McLabel className="text-xs">{label}</McLabel>
      <span className="font-minecraft text-sm text-[#1f1f1f]">{value}</span>
    </div>
  );
}

export default function AdminPanel({ run }: AdminPanelProps) {
  const startTime = run.startedAt ? formatDateTime(run.startedAt) : null;
  const endTime = run.finishedAt ? formatDateTime(run.finishedAt) : null;
  const isRunning = startTime !== null;
  const isPaused = run.pausedAt !== null;
  const isFinished = endTime !== null;

  const [optimisticDeaths, setOptimisticDeaths] = useOptimistic(run.deathCount);

  function changeDeath(delta: number, action: () => Promise<unknown>) {
    startTransition(async () => {
      setOptimisticDeaths((c) => c + delta);
      await action();
    });
  }

  // Displayed/entered in 0-10 (half steps); stored as int 0-20.
  const [hearts, setHearts] = useState(
    run.heartCount === null ? "" : String(run.heartCount / 2),
  );

  function saveHearts() {
    const value = Number(hearts);
    if (value < 0 || value > 10 || (value * 2) % 1 !== 0) return;
    startTransition(async () => {
      await setHeartCount(value * 2);
    });
  }

  const ticking = isRunning && !isPaused && !isFinished;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!ticking) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [ticking]);

  let elapsedSeconds = 0;
  if (run.startedAt) {
    const end = run.finishedAt
      ? run.finishedAt.getTime()
      : run.pausedAt
        ? run.pausedAt.getTime()
        : now;
    elapsedSeconds = Math.max(
      0,
      Math.floor((end - run.startedAt.getTime()) / 1000) -
        run.totalPausedSeconds,
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Time */}
      <McPanel className="flex flex-col gap-3 p-4">
        <McHeading>Time</McHeading>

        <FieldRow label="Start Time" value={startTime ?? "—"} />
        <McButton onClick={() => startRun()} disabled={isRunning}>
          Start
        </McButton>

        <Divider />

        <div className="flex flex-col gap-1">
          <McLabel className="text-xs">
            Elapsed {isPaused && "(paused)"}
          </McLabel>
          <div className="bg-black px-3 py-2 text-center outline outline-2 outline-[#a0a0a0] shadow-[inset_2px_2px_0_0_#000]">
            <span className="font-minecraft text-3xl text-[#5fdc5f] tabular-nums [text-shadow:2px_2px_0_#000]">
              {formatTime(elapsedSeconds)}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <McButton
            className="flex-1"
            onClick={() => pauseRun()}
            disabled={!isRunning || isPaused || isFinished}
          >
            Pause
          </McButton>
          <McButton
            className="flex-1"
            onClick={() => resumeRun()}
            disabled={!isPaused}
          >
            Resume
          </McButton>
        </div>

        <Divider />

        <FieldRow label="End Time" value={endTime ?? "—"} />
        <McButton
          variant="danger"
          onClick={() => endRun()}
          disabled={isFinished}
        >
          End Run
        </McButton>
      </McPanel>

      {/* Nether */}
      <McPanel className="flex flex-col gap-3 p-4">
        <McHeading>Nether</McHeading>
        <McButton onClick={() => toggleNether()}>
          {run.netherEnterTime ? "Exit" : "Enter"} Nether
        </McButton>
        <span className="font-minecraft text-xs text-[#5f5f5f]">
          closes bets
        </span>

        <Divider />

        <McLabel className="text-xs">Danger zone</McLabel>
        <McButton
          variant="danger"
          onClick={() => {
            if (
              window.confirm(
                "Reset the entire run? Clears start/end, nether, pauses, deaths and hearts. Cannot be undone.",
              )
            ) {
              resetRun();
            }
          }}
        >
          Reset All
        </McButton>
      </McPanel>

      {/* Deaths + Hearts */}
      <McPanel className="flex flex-col gap-3 p-4">
        <McHeading>Deaths</McHeading>
        <div className="flex items-center justify-between bg-black px-4 py-2 outline outline-2 outline-[#a0a0a0] shadow-[inset_2px_2px_0_0_#000]">
          <span className="font-minecraft text-4xl text-white tabular-nums [text-shadow:2px_2px_0_#000]">
            {optimisticDeaths}
          </span>
          <div className="flex gap-2">
            <McButton
              className="w-10 px-0"
              onClick={() => changeDeath(-1, decreaseDeath)}
            >
              -
            </McButton>
            <McButton
              className="w-10 px-0"
              onClick={() => changeDeath(1, addDeath)}
            >
              +
            </McButton>
          </div>
        </div>

        <Divider />

        <McLabel className="text-xs">Hearts</McLabel>
        <div className="flex gap-2">
          <McInput
            type="number"
            step="0.5"
            min={0}
            max={10}
            value={hearts}
            onChange={(e) => setHearts(e.target.value)}
            placeholder="—"
          />
          <McButton onClick={saveHearts}>Save</McButton>
        </div>
      </McPanel>
    </div>
  );
}
