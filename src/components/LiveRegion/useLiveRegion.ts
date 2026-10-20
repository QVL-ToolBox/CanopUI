import { useEffect, useState } from "react";

export const LIVE_REGION_ANNOUNCE_DELAY_MS = 100;

export function useLiveRegion(message: string, announcementId?: number | string): string {
  const [spoken, setSpoken] = useState("");

  useEffect(() => {
    setSpoken("");
    if (!message) return;
    const timer = window.setTimeout(() => setSpoken(message), LIVE_REGION_ANNOUNCE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [message, announcementId]);

  return spoken;
}
