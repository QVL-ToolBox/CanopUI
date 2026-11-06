import Box from "@mui/material/Box";
import { IconActionButton } from "../IconActionButton";
import { LiveRegion } from "../LiveRegion";
import { Stack } from "../Stack";
import { Text } from "../Text";
import { copyFieldButtonSx, copyFieldSurfaceSx, copyFieldValueSx } from "./copyFieldSx";
import { useCopyField } from "./useCopyField";

export interface CanopCopyFieldProps {
  value: string;
  label?: string;
  copyLabel?: string;
  copiedLabel?: string;
  failedLabel?: string;
}

export function CopyField({
  value,
  label,
  copyLabel,
  copiedLabel,
  failedLabel,
}: CanopCopyFieldProps) {
  const { copyText, failedText, announcement, icon, confirming, failed, handleCopy } = useCopyField(
    { value, copyLabel, copiedLabel, failedLabel },
  );

  return (
    <Stack gap="xs" role="group" ariaLabel={label}>
      {label ? (
        <Text variant="label" tone="muted">
          {label}
        </Text>
      ) : null}
      <Box sx={copyFieldSurfaceSx()}>
        <Box component="span" sx={copyFieldValueSx()}>
          {value}
        </Box>
        <Box
          component="span"
          data-confirming={confirming ? "on" : "off"}
          sx={copyFieldButtonSx(confirming)}
        >
          <IconActionButton icon={icon} ariaLabel={copyText} onClick={handleCopy} />
        </Box>
      </Box>
      {failed ? (
        <Text variant="caption" tone="error">
          {failedText}
        </Text>
      ) : null}
      <LiveRegion message={announcement} />
    </Stack>
  );
}
