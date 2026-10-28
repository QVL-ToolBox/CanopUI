import { useInView } from "../_shared/useInView";

interface HalloweenLayerPause {
  ref: (node: HTMLDivElement | null) => void;
  paused: boolean;
}

export function useHalloweenLayerPause(tabHidden: boolean): HalloweenLayerPause {
  const { ref, inView } = useInView<HTMLDivElement>({ once: false, amount: 0 });
  return { ref, paused: tabHidden || !inView };
}
