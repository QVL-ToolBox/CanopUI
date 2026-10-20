import type { ReactNode } from "react";
import { visuallyHiddenStyle } from "../_shared/visuallyHiddenStyle";

export type CanopVisuallyHiddenElement = "span" | "div";

export interface CanopVisuallyHiddenProps {
  as?: CanopVisuallyHiddenElement;
  id?: string;
  children: ReactNode;
}

export function VisuallyHidden({ as: Tag = "span", id, children }: CanopVisuallyHiddenProps) {
  return (
    <Tag id={id} style={visuallyHiddenStyle}>
      {children}
    </Tag>
  );
}
