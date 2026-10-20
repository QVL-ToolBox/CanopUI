import { useCallback, useEffect, useRef, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import type { PanInfo, Transition } from "framer-motion";
import { motionDurationSeconds, motionEasing, useReducedMotion } from "../../motion";
import {
  buildOverlayBackdropMotion,
  overlayExitTransition,
  reducedOverlayMotion,
  type CanopOverlayMotion,
} from "../../motion/overlayMotion";

const CLOSE_DISTANCE = 96;
const CLOSE_PROJECTION_SECONDS = 0.2;

const DRAG_WITHOUT_ELASTIC_REBOUND = { top: 0, bottom: 0 } as const;

export interface UseSidePanelOptions {
  open: boolean;
  onClose: () => void;
}

export type CanopSidePanelMotion = CanopOverlayMotion;

export interface CanopSidePanelDragConfig {
  drag: "y";
  dragConstraints: { top: number };
  dragElastic: { top: number; bottom: number };
  dragMomentum: false;
  onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
}

export interface UseSidePanelResult {
  render: boolean;
  isBottomSheet: boolean;
  panelMotion: CanopSidePanelMotion;
  backdropMotion: CanopSidePanelMotion;
  dragConfig: CanopSidePanelDragConfig | undefined;
  onExitComplete: () => void;
}

const enterTransition: Transition = {
  duration: motionDurationSeconds.base,
  ease: motionEasing.decelerate,
};

const drawerMotion: CanopSidePanelMotion = {
  initial: { x: "100%" },
  animate: { x: 0 },
  exit: { x: "100%", transition: overlayExitTransition },
  transition: enterTransition,
};

const sheetMotion: CanopSidePanelMotion = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "100%", transition: overlayExitTransition },
  transition: enterTransition,
};

export function useSidePanel({ open, onClose }: UseSidePanelOptions): UseSidePanelResult {
  const theme = useTheme();
  const isBottomSheet = useMediaQuery(theme.breakpoints.down("sm"));
  const reducedMotion = useReducedMotion();
  const [render, setRender] = useState(open);
  const openRef = useRef(open);

  useEffect(() => {
    openRef.current = open;
    if (open) setRender(true);
  }, [open]);

  const onExitComplete = useCallback(() => {
    if (!openRef.current) setRender(false);
  }, []);

  const scrimOpacity = theme.palette.mode === "dark" ? 0.62 : 0.44;

  const panelMotion = reducedMotion
    ? reducedOverlayMotion
    : isBottomSheet
      ? sheetMotion
      : drawerMotion;

  const backdropMotion = buildOverlayBackdropMotion(scrimOpacity, reducedMotion);

  const dragConfig: CanopSidePanelDragConfig | undefined = isBottomSheet
    ? {
        drag: "y",
        dragConstraints: { top: 0 },
        dragElastic: DRAG_WITHOUT_ELASTIC_REBOUND,
        dragMomentum: false,
        onDragEnd: (_event, info) => {
          const projectedFingerDestination =
            info.offset.y + info.velocity.y * CLOSE_PROJECTION_SECONDS;
          if (projectedFingerDestination > CLOSE_DISTANCE) onClose();
        },
      }
    : undefined;

  return {
    render,
    isBottomSheet,
    panelMotion,
    backdropMotion,
    dragConfig,
    onExitComplete,
  };
}
