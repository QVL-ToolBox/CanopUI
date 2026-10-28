import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import * as canopUi from "../../../index";
import { SlidingIndicator } from "../SlidingIndicator";

const DEFAULT_SHADOW = "var(--canop-drop-shadow-e1) var(--canop-drop-shadow-e1)";

function renderIndicator(ui: React.ReactElement) {
  const { container } = render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
  const pill = container.querySelector("span[aria-hidden]") as HTMLElement;
  return { pill, wrapper: pill.parentElement as HTMLElement };
}

describe("SlidingIndicator", () => {
  it("rend une pastille décorative masquée aux lecteurs d'écran", () => {
    const { pill } = renderIndicator(<SlidingIndicator />);
    expect(pill).toBeInTheDocument();
    expect(pill).toHaveAttribute("aria-hidden", "true");
  });

  it("porte l'ombre sur une enveloppe sans découpe", () => {
    const { wrapper } = renderIndicator(<SlidingIndicator />);
    expect(wrapper.style.filter).not.toBe("");
    expect(wrapper.style.clipPath).toBe("");
  });

  it("porte le fond et la découpe squircle sur la pastille sans filtre", () => {
    const { pill } = renderIndicator(<SlidingIndicator />);
    expect(pill).toHaveStyle({ backgroundColor: "var(--canop-palette-background-paper)" });
    expect(pill.style.clipPath.startsWith("polygon(")).toBe(true);
    expect(pill.style.clipPath).toContain("var(--canop-radius-md)");
    expect(pill.style.filter).toBe("");
  });

  it("applique par défaut l'ombre serrée doublée", () => {
    const { wrapper } = renderIndicator(<SlidingIndicator />);
    expect(wrapper.style.filter).toBe(DEFAULT_SHADOW);
  });

  it("remplace l'ombre par défaut par la prop shadow", () => {
    const { wrapper, pill } = renderIndicator(
      <SlidingIndicator shadow="drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))" />,
    );
    expect(wrapper.style.filter).toBe("drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))");
    expect(wrapper.style.filter).not.toContain("--canop-drop-shadow-e1");
    expect(wrapper.style.clipPath).toBe("");
    expect(pill.style.filter).toBe("");
  });

  it("garde filtre et découpe séparés avec un rayon et un fond personnalisés", () => {
    const { wrapper, pill } = renderIndicator(
      <SlidingIndicator
        background="var(--canop-palette-surface-sunken)"
        radius="var(--canop-radius-pill)"
      />,
    );
    expect(pill).toHaveStyle({ backgroundColor: "var(--canop-palette-surface-sunken)" });
    expect(pill.style.clipPath).toContain("var(--canop-radius-pill)");
    expect(pill.style.filter).toBe("");
    expect(wrapper.style.clipPath).toBe("");
    expect(wrapper.style.filter).toBe(DEFAULT_SHADOW);
  });

  it("laisse passer les interactions à travers l'enveloppe", () => {
    const { wrapper } = renderIndicator(<SlidingIndicator />);
    expect(wrapper.style.pointerEvents).toBe("none");
  });

  it("n'est pas exposé dans l'API publique", () => {
    expect(canopUi).not.toHaveProperty("SlidingIndicator");
  });
});
