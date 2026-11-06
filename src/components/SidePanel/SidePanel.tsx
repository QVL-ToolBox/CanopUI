import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { AnimatePresence } from "framer-motion";
import { useId, type ReactNode } from "react";
import { OverlayBackdrop } from "../../motion/OverlayBackdrop";
import { SkeletonScope } from "../Skeleton/SkeletonScope";
import { Stack } from "../Stack";
import { SidePanelSurface } from "./SidePanelSurface";
import { useSidePanel } from "./useSidePanel";

export interface CanopSidePanelProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: string;
  children: ReactNode;
  footer?: ReactNode;
  actions?: ReactNode;
}

export function SidePanel({
  open,
  onClose,
  title,
  width = "26.25rem",
  children,
  footer,
  actions,
}: CanopSidePanelProps) {
  const titleId = useId();
  const { render, isBottomSheet, panelMotion, backdropMotion, dragConfig, onExitComplete } =
    useSidePanel({ open, onClose });

  return (
    <SkeletonScope surface={null}>
      <Modal open={render} onClose={onClose} hideBackdrop>
        <Box sx={{ position: "fixed", inset: 0 }}>
          <AnimatePresence onExitComplete={onExitComplete}>
            {open && (
              <OverlayBackdrop
                key="canop-sidepanel-backdrop"
                animation={backdropMotion}
                onClick={onClose}
              />
            )}
            {open && (
              <SidePanelSurface
                key="canop-sidepanel-surface"
                isBottomSheet={isBottomSheet}
                title={title}
                titleId={titleId}
                width={width}
                animation={panelMotion}
                dragConfig={dragConfig}
                footer={
                  actions ? (
                    <Stack direction="row" gap="sm" justifyContent="end">
                      {actions}
                    </Stack>
                  ) : (
                    footer
                  )
                }
                onClose={onClose}
              >
                {children}
              </SidePanelSurface>
            )}
          </AnimatePresence>
        </Box>
      </Modal>
    </SkeletonScope>
  );
}
