import { useOverflowActions, type UseOverflowActionsResult } from "../_shared/useOverflowActions";
import type { CanopSelectionAction } from "./selectionTypes";

export interface UseSelectionBarParams {
  actions: CanopSelectionAction[];
}

export type UseSelectionBarResult = UseOverflowActionsResult<CanopSelectionAction>;

export function useSelectionBar({ actions }: UseSelectionBarParams): UseSelectionBarResult {
  return useOverflowActions(actions);
}
