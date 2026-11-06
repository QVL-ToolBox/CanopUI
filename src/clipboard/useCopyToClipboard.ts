import { useCallback } from "react";
import { useTransientState } from "../time";

export type CanopCopyOutcome = "idle" | "copied" | "failed";

export interface UseCopyToClipboardOptions {
  duration?: number;
}

export interface UseCopyToClipboardResult {
  copied: boolean;
  failed: boolean;
  outcome: CanopCopyOutcome;
  copy: (text?: string) => void;
}

export function useCopyToClipboard(
  text?: string,
  options: UseCopyToClipboardOptions = {},
): UseCopyToClipboardResult {
  const { value, show } = useTransientState<CanopCopyOutcome>("idle", {
    duration: options.duration ?? 1600,
  });

  const copy = useCallback(
    (override?: string) => {
      const payload = override ?? text ?? "";
      const clipboard = typeof navigator === "undefined" ? undefined : navigator.clipboard;
      if (typeof clipboard?.writeText !== "function") {
        show("failed");
        return;
      }
      const reportRejectionAsFailure = () => show("failed");
      clipboard.writeText(payload).then(() => show("copied"), reportRejectionAsFailure);
    },
    [show, text],
  );

  return { copied: value === "copied", failed: value === "failed", outcome: value, copy };
}
