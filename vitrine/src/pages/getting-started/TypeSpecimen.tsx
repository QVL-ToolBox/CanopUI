import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Stack, tokens } from "@canop/ui";
import { monoFontFamily } from "../../kit/CodeBlock";

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

function specSummary(style: TypeSpecimenStyle): string {
  return [style.fontSize, style.fontWeight, style.lineHeight, style.letterSpacing].join("  ·  ");
}

export function TypeSpecimen({ token, style, sample, uppercase = false }: TypeSpecimenProps) {
  return (
    <Stack gap="xs">
      <Typography
        component="p"
        sx={{
          color: "text.secondary",
          fontSize: "0.75rem",
          fontFamily: monoFontFamily,
        }}
      >
        {token}
      </Typography>
      <Typography
        component="p"
        sx={{
          color: "text.primary",
          ...style,
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
