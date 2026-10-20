import Box from "@mui/material/Box";
import { squircleClip } from "../../squircle";
import MuiCheckbox from "@mui/material/Checkbox";
import type { MouseEvent } from "react";
import { Icon, type CanopIconName } from "../Icon";

export interface FileCardPreviewProps {
  name: string;
  iconName: CanopIconName;
  previewUrl?: string;
  selectable: boolean;
  selected: boolean;
  selectLabel: string;
  onSelectionChange?: (selected: boolean) => void;
  onStopPropagation: (event: MouseEvent<HTMLElement>) => void;
}

export function FileCardPreview({
  name,
  iconName,
  previewUrl,
  selectable,
  selected,
  selectLabel,
  onSelectionChange,
  onStopPropagation,
}: FileCardPreviewProps) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "surface.sunken",
        overflow: "hidden",
        ...squircleClip("var(--canop-radius-md)"),
        aspectRatio: "4 / 3",
      }}
    >
      {previewUrl ? (
        <Box
          component="img"
          src={previewUrl}
          alt={name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <Box
          sx={{
            width: "52%",
            display: "flex",
            "& svg": { width: "100%", height: "auto" },
          }}
        >
          <Icon name={iconName} size="xl" color="secondary" variant="solid" />
        </Box>
      )}

      {selectable ? (
        <Box
          onClick={onStopPropagation}
          onKeyDown={(event) => event.stopPropagation()}
          sx={{
            position: "absolute",
            top: "var(--canop-spacing-xs)",
            left: "var(--canop-spacing-xs)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: { xs: "3rem", md: "2.25rem" },
            minHeight: { xs: "3rem", md: "2.25rem" },
            ...squircleClip("var(--canop-radius-sm)"),

            backgroundColor:
              "color-mix(in srgb, var(--canop-palette-surface-overlay) 78%, transparent)",

            backdropFilter: "blur(0.25rem)",
          }}
        >
          <MuiCheckbox
            checked={selected}
            onChange={(event) => onSelectionChange?.(event.target.checked)}
            color="primary"
            size="small"
            slotProps={{ input: { "aria-label": selectLabel } }}
          />
        </Box>
      ) : null}
    </Box>
  );
}
