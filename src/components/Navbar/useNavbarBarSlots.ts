import { useLayoutEffect, useState } from "react";
import { mobileBarSlots } from "./navbarOverflow";
import { NAVBAR_TILE_SIZE_REM } from "./navbarTile";

function measureBarSlots(bar: HTMLElement): number | null {
  const barStyle = getComputedStyle(bar);
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const contentWidth =
    bar.clientWidth - parseFloat(barStyle.paddingLeft) - parseFloat(barStyle.paddingRight);
  if (!(contentWidth > 0) || !(rootFontSize > 0)) return null;
  return mobileBarSlots({
    contentWidth,
    tileWidth: NAVBAR_TILE_SIZE_REM * rootFontSize,
    gap: parseFloat(barStyle.columnGap) || 0,
  });
}

export function useNavbarBarSlots(bar: HTMLElement | null): number | null {
  const [slots, setSlots] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!bar) return;
    const update = () => setSlots(measureBarSlots(bar));
    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    observer.observe(bar);
    return () => observer.disconnect();
  }, [bar]);

  return slots;
}
