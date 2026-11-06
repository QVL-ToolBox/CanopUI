import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { AddButton } from "../AddButton";

function renderAddButton(ui: React.ReactElement) {
  const view = render(ui, {
    wrapper: ({ children }) => <CanopThemeProvider>{children}</CanopThemeProvider>,
  });
  return { ...view, button: screen.getByRole("button", { name: "Ajouter" }) };
}

describe("AddButton - fullWidth", () => {
  it("enveloppe le bouton dans un conteneur pleine largeur par défaut", () => {
    const { container, button } = renderAddButton(<AddButton ariaLabel="Ajouter" />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).not.toBe(button);
    expect(wrapper).toContainElement(button);
    expect(wrapper).toHaveStyle({ width: "100%" });
  });

  it("garde le conteneur pleine largeur avec fullWidth explicite", () => {
    const { container, button } = renderAddButton(<AddButton ariaLabel="Ajouter" fullWidth />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).not.toBe(button);
    expect(wrapper).toHaveStyle({ width: "100%" });
  });

  it("rend le bouton seul, sans conteneur, avec fullWidth à false", () => {
    const { container, button } = renderAddButton(
      <AddButton ariaLabel="Ajouter" fullWidth={false} />,
    );
    expect(container.firstElementChild).toBe(button);
    expect(container.children).toHaveLength(1);
  });
});
