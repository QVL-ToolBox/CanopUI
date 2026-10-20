import { useCallback } from "react";
import { useTransientState } from "../time";

export type CanopCopyOutcome = "idle" | "copied" | "failed";

export interface UseCopyToClipboardOptions {
  /** Durée de la confirmation, en millisecondes. */
  duration?: number;
}

export interface UseCopyToClipboardResult {
  copied: boolean;
  /**
   * L'échec est exposé, pas avalé.
   *
   * La copie échoue pour des raisons ordinaires : origine non sécurisée, où
   * l'API n'existe simplement pas, document qui n'a pas le focus, permission
   * refusée. Un bouton qui ne dit rien laisse alors croire que le texte est
   * parti.
   */
  failed: boolean;
  outcome: CanopCopyOutcome;
  /** Copie le texte donné à l'appel, sinon celui passé au hook. */
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
