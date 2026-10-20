import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { AnimatePresence } from "framer-motion";
import { useId } from "react";
import { useTranslation } from "../../i18n";
import { OverlayBackdrop } from "../../motion/OverlayBackdrop";
import { LightboxSurface } from "./LightboxSurface";
import { useLightbox } from "./useLightbox";

export interface CanopLightboxItem {
  src: string;
  kind?: "image" | "document" | "video";
  alt?: string;
  title?: string;
}

export interface CanopLightboxProps {
  open: boolean;
  onClose: () => void;
  items: CanopLightboxItem[];
  index?: number;
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
}

export function Lightbox({
  open,
  onClose,
  items,
  index,
  initialIndex,
  onIndexChange,
}: CanopLightboxProps) {
  const titleId = useId();
  const { t } = useTranslation();
  const {
    render,
    currentIndex,
    hasMultiple,
    goNext,
    goPrev,
    handleKeyDown,
    onExitComplete,
    surfaceMotion,
    backdropMotion,
  } = useLightbox({
    open,
    onClose,
    itemsCount: items.length,
    index,
    initialIndex,
    onIndexChange,
  });

  const item = items[currentIndex];

  return (
    <Modal open={render} onClose={onClose} hideBackdrop>
      <Box sx={{ position: "fixed", inset: 0 }}>
        <AnimatePresence onExitComplete={onExitComplete}>
          {open && item && (
            <OverlayBackdrop
              key="canop-lightbox-backdrop"
              animation={backdropMotion}
              onClick={onClose}
            />
          )}
          {open && item && (
            <LightboxSurface
              key="canop-lightbox-surface"
              item={item}
              titleId={titleId}
              animation={surfaceMotion}
              hasMultiple={hasMultiple}
              counterLabel={t("canop.lightbox.counter", {
                current: currentIndex + 1,
                total: items.length,
              })}
              closeLabel={t("canop.lightbox.close")}
              previousLabel={t("canop.lightbox.previous")}
              nextLabel={t("canop.lightbox.next")}
              onClose={onClose}
              onPrev={goPrev}
              onNext={goNext}
              onKeyDown={handleKeyDown}
            />
          )}
        </AnimatePresence>
      </Box>
    </Modal>
  );
}
