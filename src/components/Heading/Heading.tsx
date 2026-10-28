import Typography from "@mui/material/Typography";
import { useForkRef } from "@mui/material/utils";
import type { ReactNode, Ref } from "react";
import { tokens, type CanopBreakpoint } from "../../tokens";
import { BREAKPOINTS } from "../_shared/responsiveValue";
import { textToneColor, type CanopTextTone } from "../_shared/textTone";

export type CanopHeadingLevel = 1 | 2 | 3 | 4;
export type CanopHeadingSize = 1 | 2 | 3 | 4 | 5 | 6;
export type CanopHeadingAlign = "left" | "center";
export type CanopHeadingTextElement = "p" | "span" | "div";

/**
 * Taille par point de rupture, dans la forme que MUI comprend déjà partout
 * ailleurs dans la librairie : `size={{ xs: 5, md: 3 }}`.
 *
 * Les paliers non renseignés retombent sur `level`, ce qui laisse un
 * `<Heading level={2} size={{ md: 2 }}>` lisible sous `md` au lieu de perdre
 * toute taille de titre.
 */
export type CanopResponsiveHeadingSize = Partial<Record<CanopBreakpoint, CanopHeadingSize>>;

export interface CanopHeadingProps {
  ref?: Ref<HTMLElement>;
  /** `-1` rend le titre focalisable par programme, sans l'ajouter à l'ordre de tabulation. */
  tabIndex?: number;
  level?: CanopHeadingLevel;
  size?: CanopHeadingSize | CanopResponsiveHeadingSize;
  align?: CanopHeadingAlign;
  tone?: CanopTextTone;
  gutterBottom?: boolean;
  color?: string;
  component?: CanopHeadingTextElement;
  children: ReactNode;
}

const sizeMapping = {
  1: tokens.typography.heading.h1,
  2: tokens.typography.heading.h2,
  3: tokens.typography.heading.h3,
  4: tokens.typography.heading.h4,
  5: tokens.typography.heading.h5,
  6: tokens.typography.heading.h6,
} as const;

type HeadingStyle = (typeof sizeMapping)[CanopHeadingSize];

function responsiveSizeAndLetterSpacingOnly(
  size: CanopResponsiveHeadingSize,
  level: CanopHeadingLevel,
) {
  const base: HeadingStyle = sizeMapping[size.xs ?? level];
  const fontSize: Partial<Record<CanopBreakpoint, string>> = { xs: base.fontSize };
  const letterSpacing: Partial<Record<CanopBreakpoint, string>> = { xs: base.letterSpacing };

  for (const breakpoint of BREAKPOINTS) {
    const step = size[breakpoint];
    if (breakpoint === "xs" || step === undefined) continue;
    fontSize[breakpoint] = sizeMapping[step].fontSize;
    letterSpacing[breakpoint] = sizeMapping[step].letterSpacing;
  }

  return {
    fontFamily: base.fontFamily,
    fontWeight: base.fontWeight,
    lineHeight: base.lineHeight,
    fontSize,
    letterSpacing,
  };
}

function headingStyle(
  size: CanopHeadingSize | CanopResponsiveHeadingSize | undefined,
  level: CanopHeadingLevel,
) {
  if (size === undefined) return sizeMapping[level];
  if (typeof size === "number") return sizeMapping[size];
  return responsiveSizeAndLetterSpacingOnly(size, level);
}

function largerSize(current: CanopHeadingSize, candidate: CanopHeadingSize): CanopHeadingSize {
  return candidate < current ? candidate : current;
}

function largestDisplayedSize(
  size: CanopHeadingSize | CanopResponsiveHeadingSize | undefined,
  level: CanopHeadingLevel,
): CanopHeadingSize {
  if (size === undefined) return level;
  if (typeof size === "number") return size;
  return BREAKPOINTS.reduce<CanopHeadingSize>(
    (largest, breakpoint) => largerSize(largest, size[breakpoint] ?? largest),
    size.xs ?? level,
  );
}

function headingVariant(
  size: CanopHeadingSize | CanopResponsiveHeadingSize | undefined,
  level: CanopHeadingLevel,
): `h${CanopHeadingSize}` {
  return `h${largestDisplayedSize(size, level)}`;
}

const WRAP_LONG_WORDS = { overflowWrap: "break-word" } as const;

export function Heading({
  ref,
  tabIndex,
  level = 2,
  size,
  align = "left",
  tone = "default",
  gutterBottom = true,
  color,
  component,
  children,
}: CanopHeadingProps) {
  const headingRef = useForkRef<HTMLElement>(ref);

  return (
    <Typography
      ref={headingRef}
      tabIndex={tabIndex}
      variant={headingVariant(size, level)}
      component={component ?? `h${level}`}
      align={align}
      gutterBottom={gutterBottom}
      sx={{
        ...headingStyle(size, level),
        ...WRAP_LONG_WORDS,
        color: color ?? textToneColor[tone],
      }}
    >
      {children}
    </Typography>
  );
}
