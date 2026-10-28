import Box from "@mui/material/Box";
import { Fragment } from "react";
import { glow, useNeonGlow } from "@canop/ui";
import { highlightSegments } from "./highlightSegments";
import type { TextRange } from "./searchTypes";

export interface HighlightedTextProps {
  text: string;
  ranges: TextRange[];
}

export function HighlightedText({ text, ranges }: HighlightedTextProps) {
  const neon = useNeonGlow();

  return (
    <>
      {highlightSegments(text, ranges).map((segment, index) => (
        <Fragment key={index}>
          {segment.highlighted ? (
            <Box
              component="mark"
              sx={{
                backgroundColor: "transparent",
                color: "primary.main",
                fontWeight: 700,
                textShadow: neon ? glow("primary", "faint") : undefined,
              }}
            >
              {segment.text}
            </Box>
          ) : (
            segment.text
          )}
        </Fragment>
      ))}
    </>
  );
}
