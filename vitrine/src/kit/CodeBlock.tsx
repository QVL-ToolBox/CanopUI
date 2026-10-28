import Box from "@mui/material/Box";
import { scrollbarSx, squircleClip, tokens } from "@canop/ui";
import { useDocLocale } from "../i18n/useDocLocale";
import { monoFontFamily } from "./codeStyle";
import { CopyCodeButton } from "./CopyCodeButton";
import { docKitTexts } from "./docKitTexts";
import type { TokenKind } from "./highlightTsx";
import { useHighlightedCode } from "./useHighlightedCode";

const tokenColors: Record<TokenKind, string> = {
  keyword: "var(--canop-palette-primary-main)",
  string: "var(--canop-palette-success-main)",
  comment: "var(--canop-palette-text-disabled)",
  number: "var(--canop-palette-accent-main)",
  tag: "var(--canop-palette-info-main)",
  attr: "var(--canop-palette-warning-main)",
  plain: "var(--canop-palette-text-primary)",
};

const CODE_SURFACE =
  "color-mix(in srgb, var(--canop-palette-secondary-light) 14%, var(--canop-palette-background-paper))";
const FRAME_RADIUS = tokens.radius.md;
const FRAME_GEOMETRY = { exponent: 4 };
const HAIRLINE = "0.0625rem";

export interface CodeBlockProps {
  code: string;
  bare?: boolean;
}

interface CodeLinesProps {
  code: string;
  framed: boolean;
}

function CodeLines({ code, framed }: CodeLinesProps) {
  const highlighted = useHighlightedCode(code);
  const t = docKitTexts[useDocLocale()];

  return (
    <Box
      component="pre"
      tabIndex={0}
      role="region"
      aria-label={t.codeRegion}
      sx={{
        margin: 0,
        minWidth: 0,
        maxWidth: "100%",
        padding: framed ? "0.25rem 1.25rem 1.125rem" : "1rem 1.25rem",
        overflowX: "auto",
        backgroundColor: CODE_SURFACE,
        fontFamily: monoFontFamily,
        fontSize: "0.85rem",
        lineHeight: 1.7,
        tabSize: 2,
        ...scrollbarSx("thin"),
      }}
    >
      <Box component="code" sx={{ fontFamily: "inherit" }}>
        {highlighted.map((token, index) => (
          <Box key={index} component="span" sx={{ color: tokenColors[token.kind] }}>
            {token.text}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function CodeBlock({ code, bare = false }: CodeBlockProps) {
  if (bare) return <CodeLines code={code} framed={false} />;

  return (
    <Box
      sx={{
        minWidth: 0,
        maxWidth: "100%",
        padding: HAIRLINE,
        backgroundColor: "var(--canop-palette-divider)",
        ...squircleClip(FRAME_RADIUS, FRAME_GEOMETRY),
      }}
    >
      <Box
        sx={{
          backgroundColor: CODE_SURFACE,
          ...squircleClip(`calc(${FRAME_RADIUS} - ${HAIRLINE})`, FRAME_GEOMETRY),
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "0.5rem 0.5rem 0",
          }}
        >
          <CopyCodeButton code={code} />
        </Box>
        <CodeLines code={code} framed />
      </Box>
    </Box>
  );
}
