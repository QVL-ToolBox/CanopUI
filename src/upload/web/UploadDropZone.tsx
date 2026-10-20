import Box from "@mui/material/Box";
import { SquircleDashedBorder, squircleSurface } from "../../squircle";
import Typography from "@mui/material/Typography";
import { useCallback, useRef, useState, type DragEvent } from "react";
import { Icon } from "../../components/Icon";
import { Stack } from "../../components/Stack";

export interface CanopUploadDropZoneProps {
  /** Intitulé affiché dans la zone, et nom accessible par défaut. */
  title: string;
  /** Nom accessible explicite de la zone de dépôt. Prend le pas sur `title`. */
  ariaLabel?: string;
  hint: string;
  disabled?: boolean;
  onFileSelected: (file: File) => void;
}

export function UploadDropZone({
  title,
  ariaLabel,
  hint,
  disabled = false,
  onFileSelected,
}: CanopUploadDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openPicker = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      if (disabled) {
        return;
      }
      const file = event.dataTransfer.files.item(0);
      if (file) {
        onFileSelected(file);
      }
    },
    [disabled, onFileSelected],
  );

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled],
  );

  return (
    <Box
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel ?? title}
      aria-disabled={disabled}
      onClick={openPicker}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openPicker();
        }
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragging(false)}
      sx={{
        padding: "2rem",

        ...squircleSurface({
          radius: "var(--canop-radius-sm)",
          background: isDragging ? "action.hover" : "background.paper",
        }),

        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        outline: "none",
      }}
    >
      <SquircleDashedBorder
        radius="var(--canop-radius-sm)"
        color={isDragging ? "var(--canop-palette-accent-main)" : "var(--canop-palette-divider)"}
      />
      <Stack gap="sm" alignItems="center">
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
        <Typography
          variant="body2"
          align="center"
          sx={{
            color: "text.secondary",
          }}
        >
          {hint}
        </Typography>
      </Stack>
      <input
        ref={inputRef}
        type="file"
        hidden
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.item(0);
          if (file) {
            onFileSelected(file);
          }
          event.target.value = "";
        }}
      />
    </Box>
  );
}
