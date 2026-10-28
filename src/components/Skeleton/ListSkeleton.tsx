import Box from "@mui/material/Box";
import { Stack } from "../Stack";
import { Skeleton } from "./Skeleton";
import { SkeletonSurface } from "./SkeletonSurface";

const ROW_COUNT = 3;
const ROW_RADIUS = "1.5rem";
const AVATAR_SIZE = "2.5rem";
const ROWS = Array.from({ length: ROW_COUNT }, (_, index) => index);

export function ListSkeleton() {
  return (
    <Stack gap="sm">
      {ROWS.map((order) => (
        <SkeletonSurface key={order} radius={ROW_RADIUS} order={order} padding="sm">
          <Stack direction="row" gap="sm" alignItems="center">
            <Box sx={{ flexShrink: 0 }}>
              <Skeleton width={AVATAR_SIZE} height={AVATAR_SIZE} />
            </Box>
            <Stack fill gap="xs">
              <Skeleton variant="lines" lines={2} />
            </Stack>
          </Stack>
        </SkeletonSurface>
      ))}
    </Stack>
  );
}
