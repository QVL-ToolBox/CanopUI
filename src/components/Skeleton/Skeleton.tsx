import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { squircleClip } from "../../squircle";
import { tokens } from "../../tokens";
import { SkeletonBar } from "./SkeletonBar";
import { useSkeleton, type CanopSkeletonVariant } from "./useSkeleton";

export type { CanopSkeletonVariant };

interface CanopSkeletonSharedProps {
  width?: string;
  animated?: boolean;
}

export interface CanopSkeletonBlockProps extends CanopSkeletonSharedProps {
  variant?: "block";
  height?: string;
  lines?: never;
}

export interface CanopSkeletonLinesProps extends CanopSkeletonSharedProps {
  variant: "lines";
  lines?: number;
  height?: never;
}

export type CanopSkeletonProps = CanopSkeletonBlockProps | CanopSkeletonLinesProps;

const DEFAULT_WIDTH = "100%";
const DEFAULT_BLOCK_HEIGHT = "4rem";
const DEFAULT_LINE_COUNT = 3;
const LINE_HEIGHT = "0.75rem";
const LINE_GAP = "0.625rem";
const BLOCK_SHAPE = squircleClip(tokens.radius.sm);
const LINE_SHAPE = squircleClip("0.375rem", { shape: "pill" });

export function Skeleton(props: CanopSkeletonProps) {
  const { width = DEFAULT_WIDTH, animated = true } = props;
  const { pulsing, lineModels } = useSkeleton({
    variant: props.variant ?? "block",
    lines: props.variant === "lines" ? (props.lines ?? DEFAULT_LINE_COUNT) : DEFAULT_LINE_COUNT,
    animated,
  });

  if (props.variant !== "lines") {
    return (
      <Box aria-hidden data-variant="block" sx={{ width, maxWidth: "100%" }}>
        <SkeletonBar
          width="100%"
          height={props.height ?? DEFAULT_BLOCK_HEIGHT}
          shape={BLOCK_SHAPE}
          pulsing={pulsing}
        />
      </Box>
    );
  }

  return (
    <Stack
      aria-hidden
      data-variant="lines"
      spacing={LINE_GAP}
      useFlexGap
      sx={{ width, maxWidth: "100%" }}
    >
      {lineModels.map((line) => (
        <SkeletonBar
          key={line.key}
          width={line.width}
          height={LINE_HEIGHT}
          shape={LINE_SHAPE}
          pulsing={pulsing}
          delay={line.delay}
        />
      ))}
    </Stack>
  );
}
