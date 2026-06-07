import Image from "next/image";
import { cn } from "@/lib/utils";

// Full-viewport blocking overlay. `fixed inset-0` covers the whole page no
// matter where this is rendered. Always mounted and toggled via `show` so it
// can fade both in and out (an unmounted element can't animate its exit).
export function LoadingOverlay({
  show,
  label = "Loading...",
}: {
  show: boolean;
  label?: string;
}) {
  return (
    <div
      aria-hidden={!show}
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300",
        show ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <Image
        src="/assets/cute-rabbits_2.gif"
        alt=""
        width={96}
        height={96}
        unoptimized
        priority
      />
      <span className="font-minecraft text-[#fcfcfc] uppercase [text-shadow:2px_2px_0_#000]">
        {label}
      </span>
    </div>
  );
}
