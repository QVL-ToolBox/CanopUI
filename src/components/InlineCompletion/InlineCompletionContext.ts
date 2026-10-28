import { createContext, useContext } from "react";
import type { InlineCompletionGhost } from "./inlineCompletionTypes";

export const InlineCompletionContext = createContext<InlineCompletionGhost | null>(null);

export function useInlineCompletionGhost(): InlineCompletionGhost | null {
  return useContext(InlineCompletionContext);
}
