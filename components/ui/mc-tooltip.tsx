"use client";

import { useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type McTooltipProps = {
  children: ReactNode;
  content: ReactNode;
};

// Minecraft item tooltip: dark purple-black box, bright purple inner frame,
// follows the cursor. Pass the body via the `content` slot.
export function McTooltip({ children, content }: McTooltipProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const track = (e: React.MouseEvent) => setPos({ x: e.clientX, y: e.clientY });

  return (
    <>
      <span
        className="inline-block"
        onMouseEnter={track}
        onMouseMove={track}
        onMouseLeave={() => setPos(null)}
      >
        {children}
      </span>

      {pos &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="font-minecraft pointer-events-none fixed z-50 max-w-[280px] border-2 border-[#280050] bg-[#0f0014]/95 px-3 py-2 text-sm leading-relaxed text-[#fcfcfc] shadow-[inset_0_0_0_1px_#46019a]"
            style={{ left: pos.x + 14, top: pos.y + 14 }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
