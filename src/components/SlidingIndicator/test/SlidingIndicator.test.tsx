import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { SlidingIndicator } from "../SlidingIndicator";

function renderIndicator(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("SlidingIndicator", () => {
  it("rend un élément décoratif masqué aux lecteurs d'écran", () => {
    const { container } = renderIndicator(<SlidingIndicator />);
    const indicator = container.querySelector("span[aria-hidden]");
    expect(indicator).toBeInTheDocument();
  });

  it("applique le fond par défaut", () => {
    const { container } = renderIndicator(<SlidingIndicator />);
    const indicator = container.querySelector("span[aria-hidden]") as HTMLElement;
    expect(indicator).toHaveStyle({
      backgroundColor: "var(--canop-palette-background-paper)",
    });
  });

  it("découpe l'indicateur en squircle sur le rayon par défaut", () => {
    const { container } = renderIndicator(<SlidingIndicator />);
    const indicator = container.querySelector("span[aria-hidden]") as HTMLElement;
    const clipPath = indicator.style.clipPath;
    expect(clipPath.startsWith("polygon(")).toBe(true);
    expect(clipPath).toContain("var(--canop-radius-md)");
  });

  it("applique le fond et le rayon personnalisés", () => {
    const { container } = renderIndicator(
      <SlidingIndicator
        background="var(--canop-palette-surface-sunken)"
        radius="var(--canop-radius-pill)"
      />,
    );
    const indicator = container.querySelector("span[aria-hidden]") as HTMLElement;
    expect(indicator).toHaveStyle({
      backgroundColor: "var(--canop-palette-surface-sunken)",
    });
    expect(indicator.style.clipPath).toContain("var(--canop-radius-pill)");
  });
});
