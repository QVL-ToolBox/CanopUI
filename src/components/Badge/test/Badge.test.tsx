import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Badge } from "../Badge";

function renderBadge(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("Badge", () => {
  it("affiche le compteur en pastille autonome", () => {
    renderBadge(<Badge count={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("reste invisible pour un compteur nul sans showZero", () => {
    const { container } = renderBadge(<Badge count={0} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("affiche zéro quand showZero est activé", () => {
    renderBadge(<Badge count={0} showZero />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("plafonne le compteur au format max+", () => {
    renderBadge(<Badge count={150} max={99} />);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("expose un statut accessible via ariaLabel", () => {
    renderBadge(<Badge count={3} ariaLabel="3 notifications" />);
    expect(screen.getByRole("status", { name: "3 notifications" })).toBeInTheDocument();
  });

  it("rend une pastille point sans compteur en variante dot", () => {
    renderBadge(<Badge variant="dot" ariaLabel="Nouveau" />);
    expect(screen.getByRole("status", { name: "Nouveau" })).toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("conserve les enfants lorsqu'ils sont fournis", () => {
    renderBadge(
      <Badge count={2}>
        <button type="button">Boîte de réception</button>
      </Badge>,
    );
    expect(screen.getByRole("button", { name: "Boîte de réception" })).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
