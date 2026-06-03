"use client";
import { useOptimistic, startTransition, useState, useEffect } from "react";
import { formatDateTime, formatTime } from "@/lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
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
} from "@/actions/admin";

interface AdminPanelProps {
  run: Run;
}

export default function AdminPanel({ run }: AdminPanelProps) {
  const startTime = run.startedAt ? formatDateTime(run.startedAt) : null;
  const endTime = run.finishedAt ? formatDateTime(run.finishedAt) : null;
  const isRunning = startTime !== null;
  const isPaused = run.pausedAt !== null;
  const isFinished = endTime !== null;

  const [optimisticDeaths, setOptimisticDeaths] = useOptimistic(
    run.deathCount,
  );

  function changeDeath(delta: number, action: () => Promise<unknown>) {
    startTransition(async () => {
      setOptimisticDeaths((c) => c + delta);
      await action();
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
      <Card>
        <CardHeader>
          <CardTitle>Time</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-col gap-3 ">
            <span className="text-sm text-muted-foreground">Start Time</span>
            <span className="text-sm text-muted-foreground">
              {startTime ?? "—"}
            </span>
          </div>

          <Button onClick={() => startRun()} disabled={startTime !== null}>
            Start
          </Button>
          <Separator />

          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">
              Elapsed {isPaused && "(paused)"}
            </span>
            <span className="text-3xl font-bold tabular-nums">
              {formatTime(elapsedSeconds)}
            </span>
          </div>
          <Separator />

          <div className="flex flex-wrap gap-2">
            <Button
              className="flex-1"
              onClick={() => pauseRun()}
              disabled={!isRunning || isPaused || isFinished}
            >
              Pause
            </Button>
            <Button
              className="flex-1"
              onClick={() => resumeRun()}
              disabled={!isPaused}
            >
              Resume
            </Button>
          </div>
          <Separator />

          <div className="flex flex-col gap-3">
            <span className="text-sm text-muted-foreground">End Time</span>
            <span className="text-sm text-muted-foreground">
              {endTime ?? "—"}
            </span>
          </div>
          <Button
            variant="destructive"
            onClick={() => endRun()}
            disabled={endTime !== null}
          >
            End Run
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nether</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button onClick={() => toggleNether()}>
            {run.netherEnterTime ? "Exit" : "Enter"} Nether
          </Button>
          <span className="text-sm text-muted-foreground">close bets</span>

          <Separator />

          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Danger zone</span>
            <Button
              variant="destructive"
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
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deaths</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-3xl font-bold tabular-nums">
            {optimisticDeaths}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => changeDeath(-1, decreaseDeath)}
            >
              -
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => changeDeath(1, addDeath)}
            >
              +
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
