import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { NavbarMobileItem } from "../NavbarMobileItem";
import { NavbarRailItem } from "../NavbarRailItem";
import { type CanopNavbarItem } from "../navigation";

function mockMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
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

const leaf: CanopNavbarItem = { label: "Utilisateurs", href: "/users", icon: "user" };

const parent: CanopNavbarItem = {
  label: "Studio",
  href: "/studio",
  icon: "apps",
  children: [{ label: "CanopUI", href: "/studio/canopui", icon: "folder" }],
};

function renderTile(ui: React.ReactElement): HTMLElement {
  const { container } = render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
  return container.firstElementChild as HTMLElement;
}

function normalize(html: string): string {
  return html.replace(/ data-projection-id="\d+"/g, "");
}

function emulateKeyboardFocusVisible() {
  const matches = Element.prototype.matches;
  vi.spyOn(Element.prototype, "matches").mockImplementation(function (
    this: Element,
    selector: string,
  ) {
    if (selector === ":focus-visible") return this === document.activeElement;
    return matches.call(this, selector);
  });
}

function tooltipPlacement(tooltip: HTMLElement): string {
  return (
    tooltip.closest("[data-popper-placement]")?.getAttribute("data-popper-placement") ??
    tooltip.getAttribute("data-popper-placement") ??
    ""
  );
}

function expectSameTile(rail: HTMLElement, mobile: HTMLElement) {
  expect(rail.tagName).toBe(mobile.tagName);
  expect(rail.className).toBe(mobile.className);
  expect(rail.getAttribute("aria-label")).toBe(mobile.getAttribute("aria-label"));
  expect(rail.getAttribute("aria-current")).toBe(mobile.getAttribute("aria-current"));
  expect(rail.getAttribute("aria-expanded")).toBe(mobile.getAttribute("aria-expanded"));
  expect(normalize(rail.innerHTML)).toBe(normalize(mobile.innerHTML));
}

describe("parite de rendu rail / mobile", () => {
  beforeEach(() => {
    mockMatchMedia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rend la meme tuile pour un item sans enfant", () => {
    const rail = renderTile(<NavbarRailItem item={leaf} />);
    const mobile = renderTile(<NavbarMobileItem item={leaf} />);
    expectSameTile(rail, mobile);
  });

  it("rend la meme tuile active, indicateur compris", () => {
    const rail = renderTile(<NavbarRailItem item={leaf} activeHref="/users" />);
    const mobile = renderTile(<NavbarMobileItem item={leaf} activeHref="/users" />);
    expectSameTile(rail, mobile);
  });

  it("rend le meme declencheur pour un item a sous-items", () => {
    const rail = renderTile(<NavbarRailItem item={parent} activeHref="/studio/canopui" />);
    const mobile = renderTile(<NavbarMobileItem item={parent} activeHref="/studio/canopui" />);
    expectSameTile(rail, mobile);
  });

  it("la variante rail ouvre une infobulle a droite au survol", async () => {
    const user = userEvent.setup();
    const rail = renderTile(<NavbarRailItem item={leaf} />);
    await user.hover(rail);
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Utilisateurs");
    expect(tooltipPlacement(tooltip)).toMatch(/^right/);
  });

  it("la variante mobile ouvre une infobulle au-dessus au survol", async () => {
    const user = userEvent.setup();
    const mobile = renderTile(<NavbarMobileItem item={leaf} />);
    await user.hover(mobile);
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Utilisateurs");
    expect(tooltipPlacement(tooltip)).toMatch(/^top/);
  });

  it.each([
    ["rail", <NavbarRailItem key="rail" item={leaf} />],
    ["mobile", <NavbarMobileItem key="mobile" item={leaf} />],
  ])("la variante %s ouvre son infobulle au focus clavier", async (_, tile) => {
    const user = userEvent.setup();
    renderTile(tile);
    emulateKeyboardFocusVisible();
    await user.tab();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Utilisateurs");
  });
});
