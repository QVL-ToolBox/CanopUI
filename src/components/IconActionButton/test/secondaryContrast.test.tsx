import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { IconActionButton } from "../IconActionButton";

const BLANC = "var(--canop-palette-common-white)";

function poser(mode: "light" | "dark", variant: "secondary" | "default") {
  return render(
    <CanopThemeProvider mode={mode}>
      <IconActionButton icon="zoomIn" variant={variant} ariaLabel="Zoomer" />
    </CanopThemeProvider>,
  );
}

describe("IconActionButton — la variante secondary", () => {
  it("porte un glyphe blanc en thème clair", () => {
    poser("light", "secondary");
    expect(screen.getByRole("button", { name: "Zoomer" })).toHaveStyle({ color: BLANC });
  });

  it("retourne le rapport en thème sombre", () => {
    poser("dark", "secondary");
    expect(screen.getByRole("button", { name: "Zoomer" })).toHaveStyle({
      color: "var(--canop-palette-secondary-contrasttext)",
    });
  });

  it("laisse la variante default en blanc en thème clair", () => {
    poser("light", "default");
    expect(screen.getByRole("button", { name: "Zoomer" })).toHaveStyle({ color: BLANC });
  });
});
