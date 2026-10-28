import { useReducedMotion } from "../../motion";
import { useDocumentVisible } from "../_shared/useDocumentVisible";
import { useInView } from "../_shared/useInView";

export interface LavaMotionState {
  moving: boolean;
  running: boolean;
}

export interface LavaMotion extends LavaMotionState {
  ref: (node: HTMLElement | null) => void;
}

const IN_VIEW_OPTIONS = { once: false, amount: 0 };

export function useLavaMotion(animated: boolean): LavaMotion {
  const { ref, inView } = useInView<HTMLElement>(IN_VIEW_OPTIONS);
  const documentVisible = useDocumentVisible();
  const reducedMotion = useReducedMotion();
  const moving = animated && !reducedMotion;

  return {
    ref,
    moving,
    running: moving && inView && documentVisible,
  };
}
