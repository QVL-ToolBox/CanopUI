import type { ReactNode } from "react";
import { SingleLiveContext } from "./singleLiveContext";
import { useSingleLiveScope } from "./useSingleLiveScope";

export interface SingleLiveScopeProps {
  children: ReactNode;
}

export function SingleLiveScope({ children }: SingleLiveScopeProps) {
  const registry = useSingleLiveScope();
  return <SingleLiveContext.Provider value={registry}>{children}</SingleLiveContext.Provider>;
}
