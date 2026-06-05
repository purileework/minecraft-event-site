"use client";

import { useEffect } from "react";
import { syncChatColor } from "@/actions/color";

// Fire-and-forget: writes the viewer's chat color cookie once after auth.
export default function ColorSync() {
  useEffect(() => {
    syncChatColor();
  }, []);
  return null;
}
