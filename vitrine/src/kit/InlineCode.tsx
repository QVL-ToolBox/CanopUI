import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { inlineCodeSurface, monoFontFamily } from "./codeStyle";

export interface InlineCodeProps {
  children: ReactNode;
}

export function InlineCode({ children }: InlineCodeProps) {
  return (
    <Box
      component="code"
      sx={{
        padding: "0.125rem 0.375rem",
        borderRadius: "0.375rem",
        fontFamily: monoFontFamily,
        fontSize: "0.8rem",
        lineHeight: 1.7,
        overflowWrap: "anywhere",
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
        backgroundColor: inlineCodeSurface,
      }}
    >
      {children}
    </Box>
  );
}
