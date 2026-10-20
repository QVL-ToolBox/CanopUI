import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { ApproveButton } from "../ApproveButton";

function renderButton(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

const iconOf = (name: string) => screen.getByRole("button", { name }).querySelector("svg");

describe("ApproveButton", () => {
  it("expose ariaLabel comme nom accessible du bouton", () => {
    renderButton(<ApproveButton ariaLabel="Approuver la demande" />);
    expect(screen.getByRole("button", { name: "Approuver la demande" })).toBeInTheDocument();
  });

  it("notifie l'approbation au clic", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderButton(<ApproveButton ariaLabel="Approuver" onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: "Approuver" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("reste utilisable sans handler de clic", async () => {
    const user = userEvent.setup();
    renderButton(<ApproveButton ariaLabel="Approuver" />);
    await user.click(screen.getByRole("button", { name: "Approuver" }));
    expect(screen.getByRole("button", { name: "Approuver" })).toBeEnabled();
  });

  it("neutralise le bouton quand il est desactive", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onClick = vi.fn();
    renderButton(<ApproveButton ariaLabel="Approuver" disabled onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Approuver" });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("mesure deux virgule cinq rem de cote par defaut", () => {
    renderButton(<ApproveButton ariaLabel="Approuver" />);
    expect(screen.getByRole("button", { name: "Approuver" })).toHaveStyle({
      width: "2.5rem",
      height: "2.5rem",
    });
  });

  it("adopte la taille demandee", () => {
    renderButton(<ApproveButton ariaLabel="Approuver" size="4rem" />);
    expect(screen.getByRole("button", { name: "Approuver" })).toHaveStyle({
      width: "4rem",
      height: "4rem",
    });
  });

  it("dimensionne l'icone en md par defaut", () => {
    renderButton(<ApproveButton ariaLabel="Approuver" />);
    expect(iconOf("Approuver")).toHaveAttribute("width", "1.5rem");
  });

  it("transmet iconSize a l'icone", () => {
    renderButton(<ApproveButton ariaLabel="Approuver" iconSize="lg" />);
    expect(iconOf("Approuver")).toHaveAttribute("width", "2rem");
  });
});
