import Box from "@mui/material/Box";
import { tokens } from "../../tokens";
import { Stack } from "../Stack";
import { Skeleton } from "./Skeleton";
import { skeletonRevealSx } from "./skeletonRevealSx";
import { SkeletonSurface } from "./SkeletonSurface";

const FULL_ROW = "1 / -1";
const TILES = [
  { order: 1, span: FULL_ROW, lines: 2 },
  { order: 2, span: undefined, lines: 3 },
  { order: 3, span: undefined, lines: 3 },
];

export function PageSkeleton() {
  return (
    <Stack gap="lg">
      <Box sx={skeletonRevealSx()}>
        <Skeleton width="min(18rem, 60%)" height="2.25rem" />
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: tokens.spacing.md,
        }}
      >
        {TILES.map((tile) => (
          <SkeletonSurface
            key={tile.order}
            radius={tokens.radius.lg}
            order={tile.order}
            gridColumn={tile.span}
          >
            <Stack gap="md">
              <Skeleton width="min(12rem, 50%)" height="1.5rem" />
              <Skeleton variant="lines" lines={tile.lines} />
            </Stack>
          </SkeletonSurface>
        ))}
      </Box>
    </Stack>
  );
}
