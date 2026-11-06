import Box from "@mui/material/Box";
import { useCopyToClipboard } from "../../clipboard";
import { useTranslation } from "../../i18n";
import { squircleSurface } from "../../squircle";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Stack } from "../Stack";
import { Text } from "../Text";

export type CanopShareTone = "hit" | "near" | "miss";

export interface CanopShareResultProps {
  rows: readonly (readonly CanopShareTone[])[];
  text: string;
  copyLabel?: string;
  copiedLabel?: string;
  failedLabel?: string;
  ariaLabel?: string;
  cellSize?: string;
}

const toneBackground: Record<CanopShareTone, string> = {
  hit: "var(--canop-palette-success-main)",
  near: "var(--canop-palette-warning-main)",
  miss: "var(--canop-palette-action-disabledBackground)",
};

export function ShareResult({
  rows,
  text,
  copyLabel,
  copiedLabel,
  failedLabel,
  ariaLabel,
  cellSize = "1.25rem",
}: CanopShareResultProps) {
  const { t } = useTranslation();
  const { copied, failed, copy } = useCopyToClipboard(text);

  const label = copied
    ? (copiedLabel ?? t("canop.share.copied"))
    : failed
      ? (failedLabel ?? t("canop.share.failed"))
      : (copyLabel ?? t("canop.share.copy"));

  return (
    <Stack gap="md" alignItems="start">
      <Box
        role="img"
        aria-label={ariaLabel ?? t("canop.share.grid", { rows: rows.length })}
        sx={{ display: "grid", gap: "0.25rem" }}
      >
        {rows.map((row, rowIndex) => (
          <Box key={rowIndex} sx={{ display: "flex", gap: "0.25rem" }}>
            {row.map((tone, cellIndex) => (
              <Box
                key={cellIndex}
                sx={{
                  width: cellSize,
                  height: cellSize,
                  ...squircleSurface({
                    radius: `calc(${cellSize} * 0.28)`,
                    background: toneBackground[tone],
                  }),
                }}
              />
            ))}
          </Box>
        ))}
      </Box>
      <Button
        variant={failed ? "secondary" : "primary"}
        size="small"
        onClick={() => copy()}
        startIcon={<Icon name={copied ? "check" : "clipboard"} size="sm" />}
      >
        {label}
      </Button>
      {failed && (
        <Text variant="caption" tone="error">
          {t("canop.share.failedHint")}
        </Text>
      )}
    </Stack>
  );
}
