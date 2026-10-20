import type { CanopIconName } from "../Icon";

export interface CanopSelectionAction {
  id: string;
  label: string;
  icon?: CanopIconName;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  pinned?: boolean;
}
