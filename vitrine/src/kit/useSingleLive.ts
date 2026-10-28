import { useContext, useEffect, useId, useState } from "react";
import { SingleLiveContext, type SingleLiveRegistry } from "./singleLiveContext";

export interface UseSingleLiveResult {
  ref: (node: HTMLElement | null) => void;
  live: boolean;
}

const VISIBILITY_STEPS = [0, 0.25, 0.5, 0.75, 1];

function useSingleLiveRegistry(): SingleLiveRegistry {
  const registry = useContext(SingleLiveContext);
  if (!registry) throw new Error("useSingleLive must be used inside a SingleLiveScope");
  return registry;
}

export function useSingleLive(): UseSingleLiveResult {
  const { activeId, report, release } = useSingleLiveRegistry();
  const id = useId();
  const [node, setNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      report(id, 1);
      return () => release(id);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          report(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
      },
      { threshold: VISIBILITY_STEPS },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      release(id);
    };
  }, [node, id, report, release]);

  return { ref: setNode, live: activeId === id };
}
