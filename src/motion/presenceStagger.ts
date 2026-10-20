import { createContext, useContext } from "react";

export const PresenceStaggerContext = createContext(0);

export function usePresenceStaggerDelay(): number {
  return useContext(PresenceStaggerContext);
}
