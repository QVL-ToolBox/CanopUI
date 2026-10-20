import type { CanopButtonVariant } from "../Button";
import type { CanopIconName } from "../Icon";
import type { CanopSortDirection } from "../DataTable";

export type CanopToolbarView = "grid" | "list";

export interface CanopToolbarAction {
  id: string;
  label: string;
  icon?: CanopIconName;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  variant?: CanopButtonVariant;
  pinned?: boolean;
}

export interface CanopToolbarSortOption {
  id: string;
  label: string;
}

export interface CanopToolbarSearchConfig {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface CanopToolbarSortConfig {
  options: CanopToolbarSortOption[];
  value: string;
  onChange: (id: string) => void;
  direction?: CanopSortDirection;
  onDirectionChange?: (direction: CanopSortDirection) => void;
}

export interface CanopToolbarViewConfig {
  value: CanopToolbarView;
  onChange: (view: CanopToolbarView) => void;
}
