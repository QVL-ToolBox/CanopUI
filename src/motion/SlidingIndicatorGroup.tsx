import { useState, type ReactNode } from "react";
import {
  SlidingIndicatorGroupContext,
  createSlidingIndicatorGroupStore,
} from "./slidingIndicatorRegistry";

export interface SlidingIndicatorGroupProps {
  children: ReactNode;
}

export function SlidingIndicatorGroup({ children }: SlidingIndicatorGroupProps) {
  const [store] = useState(createSlidingIndicatorGroupStore);

  return (
    <SlidingIndicatorGroupContext.Provider value={store}>
      {children}
    </SlidingIndicatorGroupContext.Provider>
  );
}
