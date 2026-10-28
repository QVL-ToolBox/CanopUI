import Typography from "@mui/material/Typography";
import type { Theme } from "@mui/material/styles";
import type { SystemStyleObject } from "@mui/system";
import type { ElementType, ReactNode } from "react";
import { tokens } from "../../tokens";
import { textToneColor, type CanopTextTone } from "../_shared/textTone";
import { squircleClip } from "../../squircle";
import { lineClamp, singleLineEllipsis } from "../_shared/truncation";

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
  /**
   * Tient sur une ligne et coupe le surplus d'une ellipse. Un élément en ligne (`span`, `code`…)
   * passe en `inline-block` borné à la largeur de son parent ; les autres passent en `block`.
   */
  noWrap?: boolean;
  /** Coupe le texte d'une ellipse au-delà de ce nombre de lignes ; prend le pas sur `noWrap`. */
  lines?: number;
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

const variantSx: Partial<Record<CanopTextVariant, SystemStyleObject<Theme>>> = {
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

const INLINE_ELEMENTS = new Set<ElementType>([
  "a",
  "abbr",
  "b",
  "code",
  "em",
  "i",
  "kbd",
  "label",
  "mark",
  "q",
  "s",
  "samp",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "time",
  "u",
  "var",
]);

const BLOCK_TRUNCATION = { ...singleLineEllipsis, display: "block" };

const INLINE_TRUNCATION = {
  ...singleLineEllipsis,
  display: "inline-block",
  verticalAlign: "bottom",
};

interface TruncationParams {
  element: ElementType;
  noWrap: boolean;
  lines: number | undefined;
}

function truncationSx({ element, noWrap, lines }: TruncationParams): SystemStyleObject<Theme> {
  if (lines !== undefined) return { ...lineClamp(lines), ...WRAP_LONG_WORDS };
  if (!noWrap) return WRAP_LONG_WORDS;
  return INLINE_ELEMENTS.has(element) ? INLINE_TRUNCATION : BLOCK_TRUNCATION;
}

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
  noWrap = false,
  lines,
  children,
}: CanopTextProps) {
  const numeric = numericFeatures(tabularNums ?? numericByDefault.has(variant), slashedZero);
  const element = as ?? defaultElement[variant];

  return (
    <Typography
      component={element}
      align={align}
      gutterBottom={gutterBottom}
      sx={{
        ...variantStyle[variant],
        ...variantSx[variant],
        ...(weight ? { fontWeight: tokens.typography.fontWeight[weight] } : null),
        ...(numeric ? { fontVariantNumeric: numeric } : null),
        ...truncationSx({ element, noWrap, lines }),
        color: color ?? textToneColor[tone],
      }}
    >
      {children}
    </Typography>
  );
}
