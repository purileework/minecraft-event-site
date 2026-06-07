import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function splitTime(total: number) {
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { hours, minutes, seconds };
}

export function formatTime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

// Hearts are stored as half-heart units (0-20); display as 0-10 (e.g. 17 -> "8.5").
// Live elapsed run time in seconds, excluding paused spans. Returns 0 before
// the run starts. `now` is injected so a ticking clock can drive re-renders.
export function elapsedRunSeconds(
  startedAt: Date | null,
  totalPausedSeconds: number,
  pausedAt: Date | null,
  now: number = Date.now(),
): number {
  if (!startedAt) return 0;
  let seconds = (now - startedAt.getTime()) / 1000 - totalPausedSeconds;
  if (pausedAt) seconds -= (now - pausedAt.getTime()) / 1000;
  return Math.max(0, seconds);
}

export function formatHearts(halfHearts: number): string {
  return (halfHearts / 2).toString();
}

export function formatDateTime(date: Date) {
  const month = date.toLocaleString("en-US", { month: "short" });
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${month} ${date.getDate()} ${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}