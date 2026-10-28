import { afterEach, describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRefractionSupport } from "../../index";
import {
  declarerNavigateur,
  revenirAJsdom,
  simulerSupportCss,
} from "../../test/liquidGlassTestKit";

const APPLE = "Apple Computer, Inc.";
const GOOGLE = "Google Inc.";

const NAVIGATEURS_CHROME_DESKTOP = [
  [
    "Chrome Windows",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    GOOGLE,
  ],
  [
    "Chrome macOS",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    GOOGLE,
  ],
] as const;

const NAVIGATEURS_SANS_REFRACTION = [
  [
    "Safari macOS",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
    APPLE,
  ],
  [
    "Firefox",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0",
    "",
  ],
  [
    "Chrome iOS (CriOS)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/130.0.6723.90 Mobile/15E148 Safari/604.1",
    APPLE,
  ],
  [
    "Edge iOS (EdgiOS)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 EdgiOS/130.0.2849.80 Mobile/15E148 Safari/605.1.15",
    APPLE,
  ],
] as const;

afterEach(revenirAJsdom);

const supportCourant = () => renderHook(() => useRefractionSupport()).result.current;

describe("AC-R5 - useRefractionSupport sans userAgentData", () => {
  it("se place dans un navigateur sans userAgentData", () => {
    expect("userAgentData" in navigator).toBe(false);
  });

  it.each(NAVIGATEURS_CHROME_DESKTOP)("repond refraction pour %s", (_nom, userAgent, vendor) => {
    simulerSupportCss();
    declarerNavigateur(userAgent, vendor);
    expect(supportCourant()).toBe("refraction");
  });

  it.each(NAVIGATEURS_SANS_REFRACTION)("repond fallback pour %s", (_nom, userAgent, vendor) => {
    simulerSupportCss();
    declarerNavigateur(userAgent, vendor);
    expect(supportCourant()).toBe("fallback");
  });
});
