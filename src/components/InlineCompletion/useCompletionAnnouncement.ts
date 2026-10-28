import { useEffect, useState } from "react";
import { useTranslation } from "../../i18n";

const ANNOUNCEMENT_SETTLE_MS = 700;
const COARSE_POINTER_QUERY = "(pointer: coarse)";

function isCoarsePointer(): boolean {
  return typeof window.matchMedia === "function" && window.matchMedia(COARSE_POINTER_QUERY).matches;
}

function announcementKey(): string {
  return isCoarsePointer()
    ? "canop.inlineCompletion.availableTouch"
    : "canop.inlineCompletion.available";
}

export function useCompletionAnnouncement(suggestion: string | undefined): string {
  const { t } = useTranslation();
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const next = suggestion === undefined ? "" : t(announcementKey(), { suggestion });
    if (next === announcement) return;
    const timer = window.setTimeout(() => setAnnouncement(next), ANNOUNCEMENT_SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, [announcement, suggestion, t]);

  return announcement;
}
