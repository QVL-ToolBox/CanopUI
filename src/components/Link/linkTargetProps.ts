import type { ElementType } from "react";

export interface LinkTargetParams {
  href?: string;
  component?: ElementType;
  to?: string;
  external: boolean;
}

export interface LinkTargetProps {
  href?: string;
  component?: ElementType;
  to?: string;
  target?: "_blank";
  rel?: "noopener noreferrer";
}

const newTabProps = { target: "_blank", rel: "noopener noreferrer" } as const;

export function linkTargetProps({
  href,
  component,
  to,
  external,
}: LinkTargetParams): LinkTargetProps {
  const destination = component ? { component, to } : { href };
  return external ? { ...destination, ...newTabProps } : destination;
}
