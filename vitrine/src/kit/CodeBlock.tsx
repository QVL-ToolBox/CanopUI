import Box from "@mui/material/Box";
import { squircleClip, tokens as canopTokens } from "@canop/ui";
import { useMemo } from "react";
import { tokenizeTsx, type TokenKind } from "./highlightTsx";

const tokenColors: Record<TokenKind, string> = {
  keyword: "var(--canop-palette-primary-main)",
  string: "var(--canop-palette-success-main)",
  comment: "var(--canop-palette-text-disabled)",
  number: "var(--canop-palette-accent-main)",
  tag: "var(--canop-palette-info-main)",
  attr: "var(--canop-palette-warning-main)",
  plain: "var(--canop-palette-text-primary)",
};

export const monoFontFamily =
  "ui-monospace, 'Cascadia Code', 'Fira Code', Consolas, 'Courier New', monospace";

export interface CodeBlockProps {
  code: string;
  bare?: boolean;
}

const frameRadius = canopTokens.radius.md;
const frameGeometry = { exponent: 4 };
const frameBorder = "0.0625rem";

export function CodeBlock({ code, bare = false }: CodeBlockProps) {
  const tokens = useMemo(() => tokenizeTsx(code.trim()), [code]);

  return (
    <Box
      sx={
        bare
          ? undefined
          : {
              ...squircleClip(frameRadius, frameGeometry),
              padding: frameBorder,
              backgroundColor: "var(--canop-palette-divider)",
            }
      }
    >
      <Box
        component="pre"
        sx={{
          margin: 0,
          padding: "1rem 1.25rem",
          ...(bare ? {} : squircleClip(`calc(${frameRadius} - ${frameBorder})`, frameGeometry)),

          backgroundColor:
            "color-mix(in srgb, var(--canop-palette-secondary-light) 14%, var(--canop-palette-background-paper))",

          overflowX: "auto",
          fontFamily: monoFontFamily,
          fontSize: "0.85rem",
          lineHeight: 1.7,
        }}
      >
        <Box
          component="code"
          sx={{
            fontFamily: "inherit",
          }}
        >
          {tokens.map((token, index) => (
            <Box key={index} component="span" sx={{ color: tokenColors[token.kind] }}>
              {token.text}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
