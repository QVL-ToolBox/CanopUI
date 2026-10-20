import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { paletteDark } from "../../../tokens";
import { declarationsEmotionDe } from "../../../test/cssRules";
import { IconActionButton, type CanopIconActionButtonProps } from "../IconActionButton";

const BLANC = "var(--canop-palette-common-white)";
const CONTRASTE_PRIMAIRE = "var(--canop-palette-primary-contrasttext)";

function renderButton(mode: "light" | "dark", props: Partial<CanopIconActionButtonProps> = {}) {
  render(
    <CanopThemeProvider mode={mode}>
      <IconActionButton icon="pencil" ariaLabel="Éditer" {...props} />
    </CanopThemeProvider>,
  );
  return screen.getByRole("button", { name: "Éditer" });
}

const valeursEn = (element: Element, propriete: string, etat: string) =>
  declarationsEmotionDe(element, propriete)
    .filter((entree) => entree.selecteur.includes(etat))
    .map((entree) => entree.valeur.toLowerCase());

function luminance(hex: string): number {
  const canaux = [1, 3, 5].map((debut) => parseInt(hex.slice(debut, debut + 2), 16) / 255);
  const [r, g, b] = canaux.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [haut, bas] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (haut + 0.05) / (bas + 0.05);
}

const spinnerColorOf = (button: HTMLElement) =>
  getComputedStyle(button.querySelector('[role="progressbar"]') as HTMLElement).color.toLowerCase();

describe("IconActionButton — variante default en thème sombre", () => {
  it("given dark mode, when rendered with default variant, then the icon uses primary.contrastText", () => {
    const button = renderButton("dark");

    expect(button).toHaveStyle({ color: CONTRASTE_PRIMAIRE });
    expect(button).not.toHaveStyle({ color: BLANC });
  });

  it("given dark mode and loading, when rendered, then the spinner inherits the dark contrast colour", () => {
    const button = renderButton("dark", { loading: true });

    expect(button).toHaveStyle({ color: CONTRASTE_PRIMAIRE });
    expect(spinnerColorOf(button)).toBe(CONTRASTE_PRIMAIRE);
  });

  it("given dark mode, when hovered, then the background is primary.dark and the icon stays dark", () => {
    const button = renderButton("dark");
    expect(valeursEn(button, "background-color", ":hover")).toContain(
      "var(--canop-palette-primary-dark)",
    );
    expect(valeursEn(button, "color", ":hover").join()).not.toContain("common-white");
    expect(button).toHaveStyle({ color: CONTRASTE_PRIMAIRE });
  });

  it("given dark mode and disabled, when rendered, then action.disabled sits on disabledBackground", () => {
    const button = renderButton("dark", { disabled: true });
    expect(button).toBeDisabled();
    expect(valeursEn(button, "color", "Mui-disabled")).toContain(
      "var(--canop-palette-action-disabled)",
    );
    expect(valeursEn(button, "background-color", "")).toContain(
      "var(--canop-palette-action-disabledbackground)",
    );
  });

  it("given light mode, when rendered with default variant, then the icon is white", () => {
    expect(renderButton("light")).toHaveStyle({ color: BLANC });
  });

  it("given light mode and loading, when rendered, then the spinner is white", () => {
    const button = renderButton("light", { loading: true });

    expect(button).toHaveStyle({ color: BLANC });
    expect(spinnerColorOf(button)).toBe(BLANC);
  });

  it.each(["light", "dark"] as const)(
    "given %s mode, when rendered with danger variant, then the icon stays white",
    (mode) => {
      expect(renderButton(mode, { variant: "danger" })).toHaveStyle({ color: BLANC });
    },
  );

  it.each([
    ["light", BLANC],
    ["dark", "var(--canop-palette-secondary-contrasttext)"],
  ] as const)(
    "given %s mode, when rendered with secondary variant, then the icon colour is unchanged",
    (mode, couleur) => {
      expect(renderButton(mode, { variant: "secondary" })).toHaveStyle({ color: couleur });
    },
  );
});

describe("Tokens sombres — contraste de primary.contrastText", () => {
  it("given the dark palette, then primary.contrastText reaches 3:1 on primary.main", () => {
    expect(
      contrast(paletteDark.primary.contrastText, paletteDark.primary.main),
    ).toBeGreaterThanOrEqual(3);
  });

  it("given the dark palette, then primary.contrastText reaches 3:1 on primary.dark", () => {
    expect(
      contrast(paletteDark.primary.contrastText, paletteDark.primary.dark),
    ).toBeGreaterThanOrEqual(3);
  });
});
