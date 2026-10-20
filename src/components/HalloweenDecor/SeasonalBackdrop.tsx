import { HalloweenSeasonBackdrop } from "./HalloweenSeasonBackdrop";
import { useSeasonalBackdropHost } from "./useSeasonalBackdropHost";

export function SeasonalBackdrop() {
  const hostsBackdrop = useSeasonalBackdropHost();
  return hostsBackdrop ? <HalloweenSeasonBackdrop behindPageContent={false} /> : null;
}
