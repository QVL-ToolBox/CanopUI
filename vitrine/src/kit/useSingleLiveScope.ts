import { useCallback, useMemo, useState } from "react";
import type { SingleLiveRegistry } from "./singleLiveContext";

type VisibilityById = Readonly<Record<string, number>>;

function mostVisible(visibilities: VisibilityById): string | null {
  let activeId: string | null = null;
  let best = 0;
  for (const [id, visibility] of Object.entries(visibilities)) {
    if (visibility > best) {
      activeId = id;
      best = visibility;
    }
  }
  return activeId;
}

function without(visibilities: VisibilityById, id: string): VisibilityById {
  if (!(id in visibilities)) return visibilities;
  return Object.fromEntries(Object.entries(visibilities).filter(([key]) => key !== id));
}

export function useSingleLiveScope(): SingleLiveRegistry {
  const [visibilities, setVisibilities] = useState<VisibilityById>({});

  const report = useCallback((id: string, visibility: number) => {
    setVisibilities((current) =>
      current[id] === visibility ? current : { ...current, [id]: visibility },
    );
  }, []);

  const release = useCallback((id: string) => {
    setVisibilities((current) => without(current, id));
  }, []);

  const activeId = useMemo(() => mostVisible(visibilities), [visibilities]);

  return useMemo(() => ({ activeId, report, release }), [activeId, report, release]);
}
