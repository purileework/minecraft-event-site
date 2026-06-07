"use client";

import { useFormStatus } from "react-dom";
import { McButton } from "@/components/ui/mc";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import type { ComponentProps } from "react";

// Submit button for server-action <form>s. While the action is pending it
// disables itself and shows a full-page loading overlay. Must be rendered
// inside the <form> so useFormStatus can read its status.
export function SubmitOverlayButton({
  overlayLabel,
  children,
  ...props
}: ComponentProps<typeof McButton> & { overlayLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <>
      <McButton type="submit" disabled={pending} {...props}>
        {children}
      </McButton>
      <LoadingOverlay show={pending} label={overlayLabel} />
    </>
  );
}
