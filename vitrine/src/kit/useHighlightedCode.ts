import { useMemo } from "react";
import { tokenizeTsx, type CodeToken } from "./highlightTsx";

export function useHighlightedCode(code: string): CodeToken[] {
  return useMemo(() => tokenizeTsx(code.trim()), [code]);
}
