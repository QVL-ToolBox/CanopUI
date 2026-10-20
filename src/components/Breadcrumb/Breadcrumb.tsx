import Box from "@mui/material/Box";
import { Fragment } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../i18n";
import { useEnterAnimation } from "../../motion";
import { Icon } from "../Icon";
import { BreadcrumbCollapse } from "./BreadcrumbCollapse";
import { BreadcrumbLink } from "./BreadcrumbLink";
import { useBreadcrumb } from "./useBreadcrumb";
import type { CanopBreadcrumbItem, CanopBreadcrumbSegment } from "./breadcrumbTypes";

const MotionNav = motion.nav;

export interface CanopBreadcrumbProps {
  items: CanopBreadcrumbItem[];
  maxItems?: number;
  ariaLabel?: string;
}

function segmentKey(segment: CanopBreadcrumbSegment, index: number): string {
  return segment.kind === "item" ? segment.item.id : `collapse-${index}`;
}

export function Breadcrumb({ items, maxItems, ariaLabel }: CanopBreadcrumbProps) {
  const { t } = useTranslation();
  const enter = useEnterAnimation({ direction: "left", distance: "0.5rem" });
  const { segments, collapseOpen, collapseAnchor, openCollapse, closeCollapse } = useBreadcrumb({
    items,
    maxItems,
  });

  return (
    <MotionNav
      aria-label={ariaLabel ?? t("canop.breadcrumb.navigation")}
      initial={enter.initial}
      animate={enter.animate}
      transition={enter.transition}
    >
      <Box
        component="ol"
        sx={{
          display: "flex",
          alignItems: "center",
          margin: 0,
          padding: 0,
          listStyle: "none",
          flexWrap: "nowrap",
          minWidth: 0,
        }}
      >
        {segments.map((segment, index) => (
          <Fragment key={segmentKey(segment, index)}>
            {index > 0 && (
              <Box
                component="li"
                aria-hidden
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  marginX: 0.25,
                  color: "text.disabled",
                }}
              >
                <Icon name="caretRight" variant="outline" size="xs" color="inherit" />
              </Box>
            )}
            <Box
              component="li"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                minWidth: 0,
              }}
            >
              {segment.kind === "item" ? (
                <BreadcrumbLink item={segment.item} isCurrent={segment.isCurrent} />
              ) : (
                <BreadcrumbCollapse
                  items={segment.items}
                  open={collapseOpen}
                  anchor={collapseAnchor}
                  onOpen={openCollapse}
                  onClose={closeCollapse}
                />
              )}
            </Box>
          </Fragment>
        ))}
      </Box>
    </MotionNav>
  );
}
