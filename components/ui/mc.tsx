import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export const mcPanelClass = `font-minecraft text-slate bg-[#6B6B6E] p-4 outline outline-[3px] outline-black 
  border-b-[8px] border-b-[#313233] shadow-[inset_0_0_0_3px_#9C9EA1]`;

export function McPanel({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(mcPanelClass, className)} {...props} />;
}

export function McHeading({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "font-minecraft border-b-2 border-black/25 pb-1 text-lg text-[#fcfcfc] uppercase [text-shadow:2px_2px_0_#3e3e3e]",
        className,
      )}
      {...props}
    />
  );
}

export function McLabel({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "font-minecraft block text-sm tracking-wide text-[#fcfcfc] uppercase [text-shadow:2px_2px_0_#3e3e3e]",
        className,
      )}
      {...props}
    />
  );
}

// minecraft.wiki-style button matching McPanel metrics: 3px black outline,
// 3px inner bevel, 6px bottom "lip". Active flips the lip to the top so the
// button presses down without changing height. Variants change only colors.
const buttonBase =
  "font-minecraft box-border inline-flex select-none items-center justify-center gap-1.5 " +
  "px-4 py-2 text-center font-bold uppercase whitespace-nowrap " +
  "text-[#fcfcfc] [text-shadow:2px_2px_0_var(--btn-shadow)] " +
  "outline outline-[3px] outline-black " +
  "border-t-0 border-b-[6px] border-b-[var(--btn-edge)] " +
  "[box-shadow:inset_0_0_0_3px_var(--btn-inner)] " +
  "transition-[filter] duration-100 hover:brightness-110 " +
  "active:border-b-0 active:border-t-[6px] active:border-t-[var(--btn-edge)] " +
  "disabled:opacity-50 disabled:brightness-100 disabled:active:border-b-[6px] disabled:active:border-t-0";

const buttonVariants = {
  default:
    "bg-[#3a971e] [--btn-inner:#62b32f] [--btn-edge:#265f13] [--btn-shadow:#1f5010]",
  danger:
    "bg-[#bf3c2c] [--btn-inner:#e0594a] [--btn-edge:#7a241a] [--btn-shadow:#5e1d14]",
} as const;

export function McButton({
  className,
  variant = "default",
  ...props
}: ComponentProps<"button"> & { variant?: keyof typeof buttonVariants }) {
  return (
    <button
      className={cn(buttonBase, buttonVariants[variant], className)}
      {...props}
    />
  );
}

export const mcInputClass =
  "font-minecraft w-full bg-black px-3 pt-[14px] pb-[2px] text-[#fcfcfc] outline outline-2 outline-[#a0a0a0] shadow-[inset_2px_2px_0_0_#000] placeholder:text-[#777] focus:outline-2 focus:outline-[#fcfcfc] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

export function McInput({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(mcInputClass, className)} {...props} />;
}

export const mcErrorClass =
  "font-minecraft text-xs text-[#ff5555] [text-shadow:1px_1px_0_#3f0000]";

// STATUS-menu style row: muted label left, prominent value right, hairline divider.
export function McStat({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-black/15 py-1">
      <span className="font-minecraft">{label}</span>
      <span
        className={cn(
          "font-minecraft text-[#fcfcfc] tabular-nums",
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  );
}
