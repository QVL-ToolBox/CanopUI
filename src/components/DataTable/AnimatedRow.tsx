import TableRow from "@mui/material/TableRow";
import { useEffect } from "react";
import type { ComponentProps, ReactNode } from "react";
import { useReducedMotion } from "../../motion";
import { useInView } from "../_shared/useInView";

export interface AnimatedRowProps extends ComponentProps<typeof TableRow> {
  animate: boolean;
  scrollRoot: Element | null;
  index: number;
  alreadyAnimated: boolean;
  onAnimated: () => void;
  children: ReactNode;
}

const enterDuration = "0.2s";
const baseDelay = 0.04;
const maxStaggeredRows = 12;

export function AnimatedRow({
  animate,
  scrollRoot,
  index,
  alreadyAnimated,
  onAnimated,
  children,
  sx,
  ...rowProps
}: AnimatedRowProps) {
  const reducedMotion = useReducedMotion();
  const { ref, inView } = useInView<HTMLTableRowElement>({
    root: scrollRoot,
    amount: 0.1,
    once: true,
  });

  const visible = inView || alreadyAnimated;

  useEffect(() => {
    if (inView && !alreadyAnimated) onAnimated();
  }, [inView, alreadyAnimated, onAnimated]);

  if (!animate || reducedMotion) {
    return (
      <TableRow sx={sx} {...rowProps}>
        {children}
      </TableRow>
    );
  }

  const delay = `${Math.min(index, maxStaggeredRows) * baseDelay}s`;

  return (
    <TableRow
      ref={ref}
      sx={[
        {
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.7)",
          transformOrigin: "center top",
          transitionProperty: "opacity, transform",
          transitionDuration: alreadyAnimated ? "0s" : enterDuration,
          transitionTimingFunction: "ease-out",
          transitionDelay: visible && !alreadyAnimated ? delay : "0s",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rowProps}
    >
      {children}
    </TableRow>
  );
}
