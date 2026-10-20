import type { CanopIconName } from "../Icon";

export interface CanopBreadcrumbItem {
  id: string;
  label: string;
  icon?: CanopIconName;
  onClick?: () => void;
}

export type CanopBreadcrumbSegment =
  | { kind: "item"; item: CanopBreadcrumbItem; isCurrent: boolean }
  | { kind: "collapse"; items: CanopBreadcrumbItem[] };
