import { useBreakpointDown } from "@canop/ui";

export interface PropsTableLayout {
  compact: boolean;
}

export function usePropsTableLayout(): PropsTableLayout {
  return { compact: useBreakpointDown("md") };
}
