import Box from "@mui/material/Box";
import { squircleClip } from "../../squircle";
import IconButton from "@mui/material/IconButton";
import type { PointerEvent } from "react";
import { Heading } from "../Heading";
import { Icon } from "../Icon";
import { useTranslation } from "../../i18n";

export interface SidePanelHeaderProps {
  title?: string;
  titleId: string;
  showHandle: boolean;
  onClose: () => void;
  onStartDrag?: (event: PointerEvent<HTMLDivElement>) => void;
}

export function SidePanelHeader({
  title,
  titleId,
  showHandle,
  onClose,
  onStartDrag,
}: SidePanelHeaderProps) {
  const { t } = useTranslation();

  const startDragFromWholeHeaderExceptButtons = onStartDrag
    ? (event: PointerEvent<HTMLDivElement>) => {
        if ((event.target as HTMLElement).closest("button")) return;
        onStartDrag(event);
      }
    : undefined;

  return (
    <Box
      onPointerDown={startDragFromWholeHeaderExceptButtons}
      sx={[
        {
          flexShrink: 0,
        },
        onStartDrag ? { cursor: "grab", touchAction: "none" } : false,
      ]}
    >
      {showHandle && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "1.75rem",
          }}
        >
          <Box
            aria-hidden
            sx={[
              {
                width: "2.75rem",
                height: "0.3125rem",
                bgcolor: "divider",
              },
              squircleClip("0.15625rem", { shape: "pill" }),
            ]}
          />
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          padding: showHandle ? "0.25rem 1.25rem 1rem" : "1rem 1.25rem",
        }}
      >
        {title ? (
          <Box id={titleId}>
            <Heading level={2} size={4} gutterBottom={false}>
              {title}
            </Heading>
          </Box>
        ) : (
          <span />
        )}
        <IconButton
          onClick={onClose}
          aria-label={t("canop.sidePanel.close")}
          sx={{ color: "text.secondary" }}
        >
          <Icon name="close" size="sm" />
        </IconButton>
      </Box>
    </Box>
  );
}
