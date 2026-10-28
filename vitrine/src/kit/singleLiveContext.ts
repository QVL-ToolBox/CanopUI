import { createContext } from "react";

export interface SingleLiveRegistry {
  activeId: string | null;
  report: (id: string, visibility: number) => void;
  release: (id: string) => void;
}

export const SingleLiveContext = createContext<SingleLiveRegistry | null>(null);
