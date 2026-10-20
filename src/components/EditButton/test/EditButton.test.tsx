import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { EditButton } from "../EditButton";

function renderButton(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

const iconOf = (name: string) => screen.getByRole("button", { name }).querySelector("svg");

describe("EditButton", () => {
  it("expose ariaLabel comme nom accessible du bouton", () => {
    renderButton(<EditButton ariaLabel="Editer la fiche" />);
    expect(screen.getByRole("button", { name: "Editer la fiche" })).toBeInTheDocument();
  });

  it("notifie l'edition au clic", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderButton(<EditButton ariaLabel="Editer" onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: "Editer" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("reste utilisable sans handler de clic", async () => {
    const user = userEvent.setup();
    renderButton(<EditButton ariaLabel="Editer" />);
    await user.click(screen.getByRole("button", { name: "Editer" }));
    expect(screen.getByRole("button", { name: "Editer" })).toBeEnabled();
  });

  it("neutralise le bouton quand il est desactive", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onClick = vi.fn();
    renderButton(<EditButton ariaLabel="Editer" disabled onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Editer" });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("mesure deux virgule cinq rem de cote par defaut", () => {
    renderButton(<EditButton ariaLabel="Editer" />);
    expect(screen.getByRole("button", { name: "Editer" })).toHaveStyle({
      width: "2.5rem",
      height: "2.5rem",
    });
  });

  it("adopte la taille demandee", () => {
    renderButton(<EditButton ariaLabel="Editer" size="3.25rem" />);
    expect(screen.getByRole("button", { name: "Editer" })).toHaveStyle({
      width: "3.25rem",
      height: "3.25rem",
    });
  });

  it("dimensionne l'icone en md par defaut", () => {
    renderButton(<EditButton ariaLabel="Editer" />);
    expect(iconOf("Editer")).toHaveAttribute("width", "1.5rem");
  });

  it("transmet iconSize a l'icone", () => {
    renderButton(<EditButton ariaLabel="Editer" iconSize="sm" />);
    expect(iconOf("Editer")).toHaveAttribute("width", "1.25rem");
  });
});
