import Box from "@mui/material/Box";
import { Stack } from "../Stack";
import { Skeleton } from "./Skeleton";
import { skeletonRevealSx } from "./skeletonRevealSx";
import { useSkeletonScope } from "./useSkeletonScope";

export function CardBodySkeleton() {
  const { titled } = useSkeletonScope();
  return (
    <Box sx={skeletonRevealSx()}>
      <Stack gap="md">
        {titled ? null : <Skeleton width="min(14rem, 55%)" height="1.75rem" />}
        <Skeleton variant="lines" lines={3} />
      </Stack>
    </Box>
  );
}
