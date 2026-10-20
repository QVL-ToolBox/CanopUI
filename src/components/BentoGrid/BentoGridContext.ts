import { createContext, useContext } from "react";
import { DEFAULT_BENTO_COLUMNS, resolveBentoColumns, type BentoCounts } from "./bentoLayout";

export const BentoGridContext = createContext<BentoCounts>(
  resolveBentoColumns(DEFAULT_BENTO_COLUMNS),
);

export function useBentoGridColumns(): BentoCounts {
  return useContext(BentoGridContext);
}
