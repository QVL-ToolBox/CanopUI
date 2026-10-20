import { Children, isValidElement, type ReactNode } from "react";
import { PresenceStaggerContext } from "./presenceStagger";

export function staggerChildren(children: ReactNode, stagger: number): ReactNode {
  const step = Math.max(0, stagger);
  let position = 0;
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const delay = position * step;
    position += 1;
    return (
      <PresenceStaggerContext.Provider key={child.key} value={delay}>
        {child}
      </PresenceStaggerContext.Provider>
    );
  });
}
