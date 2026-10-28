import Box from "@mui/material/Box";
import { squircleClip } from "../../squircle";
import type { SxProps, Theme } from "@mui/material/styles";
import { motion, useDragControls } from "framer-motion";
import type { ReactNode } from "react";
import { SidePanelHeader } from "./SidePanelHeader";
import type { CanopSidePanelDragConfig, CanopSidePanelMotion } from "./useSidePanel";

const MotionBox = motion.create(Box);

export interface SidePanelSurfaceProps {
  isBottomSheet: boolean;
  title?: string;
  titleId: string;
  width: string;
  animation: CanopSidePanelMotion;
  dragConfig?: CanopSidePanelDragConfig;
  footer?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}

const shadowCarrierBase = {
  position: "fixed",
  display: "flex",
  flexDirection: "column",
  filter: "var(--canop-drop-shadow-e4)",
} as const;

const clippedSurfaceBase = {
  display: "flex",
  flexDirection: "column",
  flex: "1 1 auto",
  minHeight: 0,
  boxSizing: "border-box",
  bgcolor: "surface.overlay",
  color: "text.primary",
  overflow: "hidden",
} as const;

function drawerCarrierSx(width: string): SxProps<Theme> {
  return {
    ...shadowCarrierBase,
    top: 0,
    right: 0,
    bottom: 0,
    width,
    maxWidth: "90vw",
  };
}

const sheetCarrierSx: SxProps<Theme> = {
  ...shadowCarrierBase,
  left: 0,
  right: 0,
  bottom: 0,
  maxHeight: "92dvh",
};

const drawerSurfaceSx: SxProps<Theme> = {
  ...clippedSurfaceBase,
  ...squircleClip({
    topLeft: "var(--canop-radius-xl)",
    bottomLeft: "var(--canop-radius-xl)",
  }),
};

const sheetSurfaceSx: SxProps<Theme> = {
  ...clippedSurfaceBase,
  ...squircleClip({
    topLeft: "var(--canop-radius-2xl)",
    topRight: "var(--canop-radius-2xl)",
  }),
  paddingBottom: "env(safe-area-inset-bottom)",
};

export function SidePanelSurface({
  isBottomSheet,
  title,
  titleId,
  width,
  animation,
  dragConfig,
  footer,
  onClose,
  children,
}: SidePanelSurfaceProps) {
  const dragControls = useDragControls();
  const swipeable = isBottomSheet && dragConfig !== undefined;

  return (
    <MotionBox
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      initial={animation.initial}
      animate={animation.animate}
      exit={animation.exit}
      transition={animation.transition}
      {...(swipeable ? { ...dragConfig, dragListener: false, dragControls } : {})}
      sx={isBottomSheet ? sheetCarrierSx : drawerCarrierSx(width)}
    >
      <Box sx={isBottomSheet ? sheetSurfaceSx : drawerSurfaceSx}>
        <SidePanelHeader
          title={title}
          titleId={titleId}
          showHandle={isBottomSheet}
          onClose={onClose}
          onStartDrag={swipeable ? (event) => dragControls.start(event) : undefined}
        />

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            padding: "0 1.25rem 1.25rem",
            overflowY: "auto",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {children}
        </Box>

        {footer && (
          <Box
            sx={{
              padding: "1rem 1.25rem",
              flexShrink: 0,
            }}
          >
            {footer}
          </Box>
        )}
      </Box>
    </MotionBox>
  );
}
