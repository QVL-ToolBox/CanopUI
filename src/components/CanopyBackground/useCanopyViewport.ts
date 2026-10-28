import { useState } from "react";
import { useDocumentVisible } from "../_shared/useDocumentVisible";
import { useInView } from "../_shared/useInView";

const VIEWPORT_MARGIN = "20%";

export interface UseCanopyViewportResult {
  ref: (node: HTMLDivElement | null) => void;
  seen: boolean;
  active: boolean;
}

export function useCanopyViewport(): UseCanopyViewportResult {
  const { ref, inView } = useInView<HTMLDivElement>({
    once: false,
    amount: 0,
    rootMargin: VIEWPORT_MARGIN,
  });
  const documentVisible = useDocumentVisible();
  const [seen, setSeen] = useState(false);
  if (inView && !seen) setSeen(true);

  return { ref, seen, active: inView && documentVisible };
}
