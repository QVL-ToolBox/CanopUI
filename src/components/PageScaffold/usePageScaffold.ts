import useMediaQuery from "@mui/material/useMediaQuery";
import type { Variants } from "framer-motion";
import type { ReactNode } from "react";
import { motionDurationSeconds, motionEasing, useReducedMotion } from "../../motion";
import type { CanopNavbarItem } from "../Navbar";

const ENTER_DISTANCE = "0.75rem";

export type CanopActionsPlacement = "header" | "floating";

export interface CanopPageEnterMotion {
  container: { initial: string; animate: string; variants: Variants };
  item: { variants: Variants };
}

export interface UsePageScaffoldParams {
  items: CanopNavbarItem[];
  activeHref?: string;
  headerActions?: ReactNode;
  actionsPlacement?: CanopActionsPlacement;
}

export interface UsePageScaffoldResult {
  isMobile: boolean;
  pageContext?: string;
  inlineActions?: ReactNode;
  floatingActions?: ReactNode;
  enter: CanopPageEnterMotion;
}

function resolveActiveLabel(items: CanopNavbarItem[], activeHref?: string): string | undefined {
  if (!activeHref) return undefined;
  const match = items.find((item) => {
    if (item.href === "/") return activeHref === "/";
    return activeHref === item.href || activeHref.startsWith(`${item.href}/`);
  });
  return match?.label;
}

export function usePageScaffold({
  items,
  activeHref,
  headerActions,
  actionsPlacement = "header",
}: UsePageScaffoldParams): UsePageScaffoldResult {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const reduced = useReducedMotion();
  const isFloating = actionsPlacement === "floating";

  const enter: CanopPageEnterMotion = {
    container: {
      initial: "hidden",
      animate: "visible",
      variants: {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduced ? 0 : motionDurationSeconds.instant,
            delayChildren: reduced ? 0 : motionDurationSeconds.fast,
          },
        },
      },
    },
    item: {
      variants: reduced
        ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
        : {
            hidden: { opacity: 0, y: ENTER_DISTANCE },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: motionDurationSeconds.base, ease: motionEasing.organic },
            },
          },
    },
  };

  return {
    isMobile,
    pageContext: resolveActiveLabel(items, activeHref),
    inlineActions: isFloating ? undefined : headerActions,
    floatingActions: isFloating ? headerActions : undefined,
    enter,
  };
}
