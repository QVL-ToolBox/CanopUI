import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ElementType, ReactNode } from "react";
import { tokens } from "../../tokens";
import { textToneColor, type CanopTextTone } from "../_shared/textTone";
import { squircleClip } from "../../squircle";

export type CanopTextVariant =
  | "lead"
  | "body-lg"
  | "body-md"
  | "body-sm"
  | "label"
  | "caption"
  | "overline"
  | "metric"
  | "display"
  | "code";

export type CanopTextWeight = keyof typeof tokens.typography.fontWeight;
export type { CanopTextTone };
export type CanopTextAlign = "left" | "center" | "right";

export interface CanopTextProps {
  variant?: CanopTextVariant;
  weight?: CanopTextWeight;
  tone?: CanopTextTone;
  align?: CanopTextAlign;
  as?: ElementType;
  tabularNums?: boolean;
  slashedZero?: boolean;
  gutterBottom?: boolean;
  color?: string;
  children: ReactNode;
}

const defaultElement: Record<CanopTextVariant, ElementType> = {
  lead: "p",
  "body-lg": "p",
  "body-md": "p",
  "body-sm": "p",
  label: "span",
  caption: "span",
  overline: "span",
  metric: "span",
  display: "span",
  code: "code",
};

const displayCompact = tokens.typography.display["display-3"];
const displayWide = tokens.typography.display["display-2"];

const variantStyle = {
  ...tokens.typography.app,
  display: {
    ...displayCompact,
    fontSize: { xs: displayCompact.fontSize, md: displayWide.fontSize },
    letterSpacing: { xs: displayCompact.letterSpacing, md: displayWide.letterSpacing },
  },
};

const numericByDefault = new Set<CanopTextVariant>(["metric", "display"]);

const variantSx: Partial<Record<CanopTextVariant, SxProps<Theme>>> = {
  overline: { textTransform: "uppercase" },
  code: {
    display: "inline-block",
    px: tokens.spacing["2xs"],
    py: tokens.spacing["3xs"],
    ...squircleClip(tokens.radius.xs),
    bgcolor: "surface.sunken",
  },
};

function numericFeatures(tabularNums: boolean, slashedZero: boolean): string | undefined {
  const features = [tabularNums ? "tabular-nums" : "", slashedZero ? "slashed-zero" : ""].filter(
    Boolean,
  );
  return features.length > 0 ? features.join(" ") : undefined;
}

const WRAP_LONG_WORDS = { overflowWrap: "break-word" } as const;

export function Text({
  variant = "body-md",
  weight,
  tone = "default",
  align = "left",
  as,
  tabularNums,
  slashedZero = false,
  gutterBottom = false,
  color,
  children,
}: CanopTextProps) {
  const numeric = numericFeatures(tabularNums ?? numericByDefault.has(variant), slashedZero);

  return (
    <Typography
      component={as ?? defaultElement[variant]}
      align={align}
      gutterBottom={gutterBottom}
      sx={{
        ...variantStyle[variant],
        ...variantSx[variant],
        ...(weight ? { fontWeight: tokens.typography.fontWeight[weight] } : null),
        ...(numeric ? { fontVariantNumeric: numeric } : null),
        ...WRAP_LONG_WORDS,
        color: color ?? textToneColor[tone],
      }}
    >
      {children}
    </Typography>
  );
}
