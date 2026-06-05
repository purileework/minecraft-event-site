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

const buttonBase =
  "font-minecraft px-4 py-2 uppercase text-[#fcfcfc] outline outline-2 outline-black [text-shadow:2px_2px_0_#3f3f3f] shadow-[inset_-3px_-3px_0_0_#3f3f3f,inset_3px_3px_0_0_#fff] active:shadow-[inset_3px_3px_0_0_#3f3f3f,inset_-3px_-3px_0_0_#fff] disabled:opacity-50 disabled:active:shadow-[inset_-3px_-3px_0_0_#3f3f3f,inset_3px_3px_0_0_#fff]";

const buttonVariants = {
  default: "bg-[#8b8b8b] hover:bg-[#6b9b4b] disabled:hover:bg-[#8b8b8b]",
  danger: "bg-[#a13b3b] hover:bg-[#c24b4b] disabled:hover:bg-[#a13b3b]",
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
  "font-minecraft w-full bg-black px-3 pt-[14px] pb-[2px] text-[#fcfcfc] outline outline-2 outline-[#a0a0a0] shadow-[inset_2px_2px_0_0_#000] placeholder:text-[#777] focus:outline-2 focus:outline-[#fcfcfc]";

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
