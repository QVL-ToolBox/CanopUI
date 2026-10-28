import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Stack, tokens } from "@canop/ui";
import { monoFontFamily } from "../../kit/codeStyle";
import { useTypeSpecimenSizing } from "./useTypeSpecimenSizing";

export interface TypeSpecimenStyle {
  fontFamily?: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: string;
}

export interface TypeSpecimenProps {
  token: string;
  style: TypeSpecimenStyle;
  sample: string;
  uppercase?: boolean;
}

const SUMMARY_SEPARATOR = "  ·  ";

function specSummary(style: TypeSpecimenStyle): string {
  return [style.fontSize, style.fontWeight, style.lineHeight, style.letterSpacing].join(
    SUMMARY_SEPARATOR,
  );
}

interface ReducedSizeHintProps {
  media: string;
  label: string;
}

function ReducedSizeHint({ media, label }: ReducedSizeHintProps) {
  return (
    <Box component="span" sx={{ display: "none", [media]: { display: "inline" } }}>
      {SUMMARY_SEPARATOR}
      {label}
    </Box>
  );
}

export function TypeSpecimen({ token, style, sample, uppercase = false }: TypeSpecimenProps) {
  const sizing = useTypeSpecimenSizing(style.fontSize);

  return (
    <Stack gap="xs">
      <Typography
        component="p"
        sx={{
          color: "text.secondary",
          fontSize: "0.75rem",
          fontFamily: monoFontFamily,
          overflowWrap: "anywhere",
        }}
      >
        {token}
      </Typography>
      <Typography
        component="p"
        sx={{
          color: "text.primary",
          ...style,
          fontSize: sizing.sampleFontSize,
          overflowWrap: "break-word",
          textTransform: uppercase ? "uppercase" : "none",
        }}
      >
        {sample}
      </Typography>
      <Typography
        component="p"
        sx={{
          color: "text.disabled",
          fontSize: "0.75rem",
          fontFamily: monoFontFamily,
        }}
      >
        {specSummary(style)}
        {sizing.reducedMedia ? (
          <ReducedSizeHint media={sizing.reducedMedia} label={sizing.reducedLabel} />
        ) : null}
      </Typography>
    </Stack>
  );
}

export interface TypeSpecimenListProps {
  children: React.ReactNode;
}

export function TypeSpecimenList({ children }: TypeSpecimenListProps) {
  return (
    <Box
      sx={{
        border: "0.0625rem solid",
        borderColor: "divider",
        borderRadius: tokens.radius.md,
        overflow: "hidden",
        "& > * + *": { borderTop: "0.0625rem solid", borderColor: "divider" },
        "& > *": { padding: { xs: tokens.spacing.md, md: tokens.spacing.lg } },
      }}
    >
      {children}
    </Box>
  );
}
