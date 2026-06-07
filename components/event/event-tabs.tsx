"use client";

import { useState, type ReactNode } from "react";
import { McHeading, mcPanelClass } from "@/components/ui/mc";
import { cn } from "@/lib/utils";

type Tab = "rules" | "prediction";

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "font-minecraft flex-1 border-b-2 px-3 py-2 text-sm tracking-wide uppercase transition-[color,border-color] [text-shadow:2px_2px_0_#3e3e3e]",
        active
          ? "border-teal text-[#fcfcfc]"
          : "border-transparent text-[#fcfcfc]/50 hover:text-[#fcfcfc]/80",
      )}
    >
      {children}
    </button>
  );
}

export default function EventTabs({
  name,
  signedIn,
  signOut,
  rules,
  prediction,
}: {
  name: string;
  signedIn?: boolean;
  signOut?: ReactNode;
  rules: ReactNode;
  prediction: ReactNode;
}) {
  const [tab, setTab] = useState<Tab>(signedIn ? "prediction" : "rules");

  return (
    <div className={cn(mcPanelClass, "flex flex-col p-0")}>
      {/* header — pinned */}
      <div className="flex items-center justify-between gap-2 border-b-2 border-black/25 p-3 sm:p-4 sm:pb-1">
        <McHeading className="min-w-0 flex-1 border-b-0 leading-none">
          Welcome, {name} c:
        </McHeading>
        {signOut}
      </div>

      {/* tabs — pinned */}
      <div className="flex border-b-2 border-black/25 px-3 sm:px-4">
        <TabButton active={tab === "rules"} onClick={() => setTab("rules")}>
          Rules
        </TabButton>
        <TabButton
          active={tab === "prediction"}
          onClick={() => setTab("prediction")}
        >
          Prediction
        </TabButton>
      </div>

      {/* content */}
      <div className="p-3 sm:p-4">{tab === "rules" ? rules : prediction}</div>
    </div>
  );
}
