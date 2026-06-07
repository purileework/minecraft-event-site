"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type McTooltipProps = {
  children: ReactNode;
  content: ReactNode;
};

// Minecraft item tooltip: dark purple-black box, bright purple inner frame.
// On desktop it follows the cursor; on mobile (no cursor) it's centered on
// screen so it never gets clipped at the edges. Pass the body via `content`.
export function McTooltip({ children, content }: McTooltipProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
            className={cn(
              "font-minecraft pointer-events-none fixed z-50 max-w-[280px] border-2 border-[#280050] bg-[#0f0014]/95 px-3 py-2 text-sm leading-relaxed text-[#fcfcfc] shadow-[inset_0_0_0_1px_#46019a]",
              mobile &&
                "top-1/2 left-1/2 max-w-[90vw] -translate-x-1/2 -translate-y-1/2",
            )}
            style={mobile ? undefined : { left: pos.x + 14, top: pos.y + 14 }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
