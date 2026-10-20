import Tooltip, { type TooltipProps } from "@mui/material/Tooltip";

export interface OptionalTooltipProps {
  title?: string;
  placement?: TooltipProps["placement"];
  describeChild?: boolean;
  children: TooltipProps["children"];
}

export function OptionalTooltip({
  title,
  placement,
  describeChild,
  children,
}: OptionalTooltipProps) {
  if (!title) return children;

  return (
    <Tooltip title={title} placement={placement} describeChild={describeChild}>
      {children}
    </Tooltip>
  );
}
