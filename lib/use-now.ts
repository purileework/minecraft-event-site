"use client";

import { useEffect, useState } from "react";

// Ticking clock: re-renders the consumer every `intervalMs` so time-derived UI
// (e.g. elapsed-run comparisons) stays live without any network calls.
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
