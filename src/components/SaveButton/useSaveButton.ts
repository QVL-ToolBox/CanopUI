import { useCallback, useEffect, useRef, useState } from "react";

export type CanopSaveState = "idle" | "saving" | "saved" | "failed";

export interface UseSaveButtonResult {
  state: CanopSaveState;
  save: () => Promise<void>;
  dismiss: () => void;
}

export function useSaveButton(onSave: () => void | Promise<void>): UseSaveButtonResult {
  const [state, setState] = useState<CanopSaveState>("idle");
  const mounted = useRef(true);
  const running = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const save = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    setState("saving");
    try {
      await onSave();
      if (mounted.current) setState("saved");
    } catch {
      if (mounted.current) setState("failed");
    } finally {
      running.current = false;
    }
  }, [onSave]);

  const dismiss = useCallback(() => setState("idle"), []);

  return { state, save, dismiss };
}
