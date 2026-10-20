import { useOverflowActions, type UseOverflowActionsResult } from "../_shared/useOverflowActions";
import type { CanopToolbarAction } from "./toolbarTypes";

export interface UseToolbarParams {
  actions: CanopToolbarAction[];
}

export type UseToolbarResult = UseOverflowActionsResult<CanopToolbarAction>;

export function useToolbar({ actions }: UseToolbarParams): UseToolbarResult {
  return useOverflowActions(actions);
}
