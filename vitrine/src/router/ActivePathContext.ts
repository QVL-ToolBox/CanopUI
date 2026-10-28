import { createContext, useContext } from "react";
import { HOME_PATH } from "./routes";

export const ActivePathContext = createContext<string>(HOME_PATH);

export function useActivePath(): string {
  return useContext(ActivePathContext);
}
