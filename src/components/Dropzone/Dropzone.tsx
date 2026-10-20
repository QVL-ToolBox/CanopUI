import Box from "@mui/material/Box";
import { SquircleDashedBorder, squircleSurface } from "../../squircle";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { Icon } from "../Icon";
import { Stack } from "../Stack";
import { DropzoneOverlay } from "./DropzoneOverlay";
import { useDropzone } from "./useDropzone";

export interface CanopDropzoneProps {
  onFiles: (files: File[]) => void;
  /** Intitulé affiché dans la zone, et nom accessible par défaut. */
  title: string;
  /** Nom accessible explicite de la zone de dépôt. Prend le pas sur `title`. */
  ariaLabel?: string;
  hint?: string;
  overlayLabel?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}

export function Dropzone({
  onFiles,
  title,
  ariaLabel,
  hint,
  overlayLabel,
  accept,
  multiple = true,
  disabled = false,
  children,
}: CanopDropzoneProps) {
  const { isDragging, inputRef, openPicker, handleKeyDown, rootHandlers, inputHandlers } =
    useDropzone({ disabled, multiple, onFiles });

  const isPrompt = !children;
  const resolvedOverlayLabel = overlayLabel ?? title;

  return (
    <Box
      {...rootHandlers}
      {...(isPrompt
        ? {
            role: "button" as const,
            tabIndex: disabled ? -1 : 0,
            "aria-label": ariaLabel ?? title,
            "aria-disabled": disabled,
            onClick: openPicker,
            onKeyDown: handleKeyDown,
          }
        : {})}
      sx={{
        position: "relative",
        outline: "none",
        cursor: isPrompt && !disabled ? "pointer" : "default",
        opacity: disabled ? 0.6 : 1,

        ...(isPrompt
          ? {
              padding: "var(--canop-spacing-2xl)",
              ...squircleSurface({
                radius: "var(--canop-radius-lg)",
                background: "var(--canop-palette-surface-sunken)",
              }),
            }
          : {}),
      }}
    >
      {isPrompt ? (
        <SquircleDashedBorder
          radius="var(--canop-radius-lg)"
          color={
            isDragging && !disabled
              ? "var(--canop-palette-accent-main)"
              : "var(--canop-palette-divider)"
          }
        />
      ) : null}

      {isPrompt ? (
        <Stack gap="xs" alignItems="center">
          <Icon name="upload" size="xl" color="accent" />
          <Typography
            variant="subtitle1"
            align="center"
            sx={{
              color: "text.primary",
            }}
          >
            {title}
          </Typography>
          {hint ? (
            <Typography
              variant="body2"
              align="center"
              sx={{
                color: "text.secondary",
              }}
            >
              {hint}
            </Typography>
          ) : null}
        </Stack>
      ) : (
        children
      )}

      <DropzoneOverlay visible={isDragging && !disabled} label={resolvedOverlayLabel} />

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        hidden
        onChange={inputHandlers.onChange}
      />
    </Box>
  );
}
