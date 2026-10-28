import "@testing-library/jest-dom/vitest";
import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { canopBaseMessages, CanopI18nProvider, canopTheme } from "@canop/ui";
import { ActivePathContext } from "../router/ActivePathContext";
import { VitrineThemeRoot } from "../season/VitrineThemeRoot";

const ROOT_FONT_SIZE_PX = 16;
const WIDTH_CONDITION = /\((min|max)-width:\s*([\d.]+)(px|rem|em)\)/g;

export type VitrineLocale = "fr" | "en";

function pathFromHash(): string {
  return `/${window.location.hash.replace(/^#\/?/, "")}`;
}

export function renderInVitrine(node: ReactNode, locale: VitrineLocale = "fr") {
  return render(
    <VitrineThemeRoot>
      <CanopI18nProvider locale={locale} messages={canopBaseMessages}>
        <ActivePathContext.Provider value={pathFromHash()}>{node}</ActivePathContext.Provider>
      </CanopI18nProvider>
    </VitrineThemeRoot>,
  );
}

export function mdBreakpointRem(): number {
  return canopTheme.breakpoints.values.md;
}

function toRem(value: string, unit: string): number {
  return unit === "px" ? Number(value) / ROOT_FONT_SIZE_PX : Number(value);
}

export function mediaMatchesWidth(query: string, widthRem: number): boolean {
  const conditions = [...query.matchAll(WIDTH_CONDITION)];
  if (conditions.length === 0) return false;
  return conditions.every(([, bound, value, unit]) =>
    bound === "min" ? widthRem >= toRem(value, unit) : widthRem <= toRem(value, unit),
  );
}

export function simulateViewportWidth(widthRem: number) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: mediaMatchesWidth(query, widthRem),
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

export function forgetViewportWidth() {
  Reflect.deleteProperty(window, "matchMedia");
}

export function stubScrollIntoView() {
  HTMLElement.prototype.scrollIntoView = () => undefined;
}

function safelyMatches(element: Element, selector: string): boolean {
  try {
    return element.matches(selector);
  } catch {
    return false;
  }
}

function declaredValues(rules: CSSRuleList, element: Element, property: string, widthRem: number) {
  const values: string[] = [];
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSMediaRule) {
      if (mediaMatchesWidth(rule.media.mediaText, widthRem)) {
        values.push(...declaredValues(rule.cssRules, element, property, widthRem));
      }
    } else if (rule instanceof CSSStyleRule && safelyMatches(element, rule.selectorText)) {
      const value = rule.style.getPropertyValue(property);
      if (value) values.push(value);
    }
  }
  return values;
}

export function cssValueAtWidth(element: Element, property: string, widthRem: number): string {
  const values = Array.from(document.styleSheets).flatMap((sheet) =>
    declaredValues(sheet.cssRules, element, property, widthRem),
  );
  return values.at(-1) ?? "";
}

export function countGridTracks(template: string): number {
  let depth = 0;
  let tracks = 0;
  let inTrack = false;
  for (const char of template.trim()) {
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (char === " " && depth === 0) {
      inTrack = false;
    } else if (!inTrack) {
      inTrack = true;
      tracks += 1;
    }
  }
  return tracks;
}

export function establishesContainingBlock(element: Element): boolean {
  const style = getComputedStyle(element);
  const transformed = style.transform !== "" && style.transform !== "none";
  const contained = /layout|paint|strict|content/.test(style.contain);
  return transformed || contained;
}

export function installClipboardSpy(): unknown[] {
  const copies: unknown[] = [];
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: (text: unknown) => {
        copies.push(text);
        return Promise.resolve();
      },
    },
  });
  return copies;
}

export function removeClipboardSpy() {
  Reflect.deleteProperty(navigator, "clipboard");
}
