import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { Navbar, type CanopNavbarItem, type CanopNavbarTitleLevel } from "../Navbar";

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

const items: CanopNavbarItem[] = [{ label: "Dashboard", href: "/dashboard", icon: "apps" }];

const styleKeys = [
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "color",
  "marginTop",
  "marginBottom",
  "textTransform",
  "display",
] as const;

function renderNavbar(titleLevel?: CanopNavbarTitleLevel) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>
        <Navbar items={items} title="Mon portail" titleLevel={titleLevel}>
          Contenu
        </Navbar>
      </CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function titleVisual(titleLevel?: CanopNavbarTitleLevel) {
  const { unmount } = renderNavbar(titleLevel);
  const style = getComputedStyle(screen.getByText("Mon portail"));
  const visual = Object.fromEntries(styleKeys.map((key) => [key, style[key]]));
  unmount();
  return visual;
}

describe("Navbar - titleLevel (desktop)", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it("given no titleLevel, when rendered, then the title is an h1", () => {
    renderNavbar();
    expect(screen.getByRole("heading", { level: 1, name: "Mon portail" }).tagName).toBe("H1");
  });

  it.each([1, 2, 3, 4] as const)(
    "given titleLevel=%s, when rendered, then the title is the matching h",
    (level) => {
      renderNavbar(level);
      expect(screen.getByRole("heading", { level, name: "Mon portail" }).tagName).toBe(`H${level}`);
    },
  );

  it("given titleLevel=text, when rendered, then the title is a paragraph without heading role", () => {
    renderNavbar("text");
    expect(screen.getByText("Mon portail").tagName).toBe("P");
    expect(screen.queryByRole("heading")).toBeNull();
  });

  it("given levels 1, 2, text and default, when rendered, then the title looks exactly the same", () => {
    const reference = titleVisual(1);
    expect(reference.fontSize).not.toBe("");
    expect(titleVisual(2)).toEqual(reference);
    expect(titleVisual("text")).toEqual(reference);
    expect(titleVisual()).toEqual(reference);
  });
});
