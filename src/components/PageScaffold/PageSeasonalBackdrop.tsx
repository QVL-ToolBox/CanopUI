import { useSeasonalBackdropHost } from "../HalloweenDecor/useSeasonalBackdropHost";
import { LazyHalloweenSeasonBackdrop } from "../_shared/LazyHalloweenSeasonBackdrop";

export function PageSeasonalBackdrop() {
  const hostsBackdrop = useSeasonalBackdropHost();
  return hostsBackdrop ? <LazyHalloweenSeasonBackdrop behindPageContent={false} /> : null;
}
