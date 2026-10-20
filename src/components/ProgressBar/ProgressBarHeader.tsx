import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface ProgressBarHeaderProps {
  label?: string;
  valueText?: string;
}

export function ProgressBarHeader({ label, valueText }: ProgressBarHeaderProps) {
  if (!label && !valueText) return null;

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {label ? (
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
          }}
        >
          {label}
        </Typography>
      ) : (
        <span />
      )}
      {valueText ? (
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
          }}
        >
          {valueText}
        </Typography>
      ) : null}
    </Stack>
  );
}
