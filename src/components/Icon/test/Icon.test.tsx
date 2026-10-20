import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Icon } from "../Icon";

describe("Icon", () => {
  it("expose un rôle img et un libellé accessible quand title est fourni", () => {
    render(<Icon name="moon" title="Mode sombre" />);
    expect(screen.getByRole("img", { name: "Mode sombre" })).toBeInTheDocument();
  });

  it("est masqué de l'arbre d'accessibilité sans title", () => {
    const { container } = render(<Icon name="sun" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("résout la couleur via la variable de palette du thème", () => {
    const { container } = render(<Icon name="sun" variant="solid" color="error" />);
    expect(container.querySelector("svg")).toHaveStyle({
      color: "var(--canop-palette-error-main)",
    });
  });
});
