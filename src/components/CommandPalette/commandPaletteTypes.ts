import type { CanopIconName } from "../Icon";

export interface CanopCommandItem {
  id: string;
  label: string;
  group?: string;
  icon?: CanopIconName;
  keywords?: string[];
  href?: string;
  onSelect?: () => void;
}

export interface CanopCommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CanopCommandItem[];
  placeholder?: string;
  emptyLabel?: string;
  onSelect?: (item: CanopCommandItem) => void;
}
