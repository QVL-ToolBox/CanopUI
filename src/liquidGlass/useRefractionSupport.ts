import { useMemo } from "react";

/** `refraction` : Chromium avec filtre SVG dans `backdrop-filter` ; sinon `fallback`. */
export type CanopRefractionSupport = "refraction" | "fallback";

interface BrandedUserAgent {
  brands: ReadonlyArray<{ brand: string }>;
}

const CHROMIUM_BRAND = "Chromium";
const CHROMIUM_USER_AGENT = /\b(Chrome|Chromium)\/\d+/;
const WEBKIT_SHELL_ON_IOS = /\b(CriOS|EdgiOS|FxiOS)\b/;
const BACKDROP_WITH_SVG_FILTER = "url(#canop-probe) blur(0.0625rem)";

function isBrandedUserAgent(value: unknown): value is BrandedUserAgent {
  return (
    typeof value === "object" && value !== null && "brands" in value && Array.isArray(value.brands)
  );
}

function isChromium(): boolean {
  if (typeof navigator === "undefined") return false;
  const userAgentData: unknown = "userAgentData" in navigator ? navigator.userAgentData : undefined;
  if (isBrandedUserAgent(userAgentData)) {
    return userAgentData.brands.some((entry) => entry.brand === CHROMIUM_BRAND);
  }
  const userAgent = navigator.userAgent;
  return CHROMIUM_USER_AGENT.test(userAgent) && !WEBKIT_SHELL_ON_IOS.test(userAgent);
}

function parsesSvgBackdropFilter(): boolean {
  return (
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    CSS.supports("backdrop-filter", BACKDROP_WITH_SVG_FILTER)
  );
}

function detectRefractionSupport(): CanopRefractionSupport {
  return isChromium() && parsesSvgBackdropFilter() ? "refraction" : "fallback";
}

/** Détecte une fois la prise en charge de la réfraction ; `fallback` si `enabled` est faux. */
export function useRefractionSupport(enabled = true): CanopRefractionSupport {
  return useMemo(() => (enabled ? detectRefractionSupport() : "fallback"), [enabled]);
}
