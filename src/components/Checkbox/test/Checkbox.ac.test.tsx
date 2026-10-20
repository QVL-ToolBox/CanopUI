import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { Checkbox } from "../Checkbox";
import { Link } from "../../Link";

function renderCheckbox(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("Checkbox - AC1 label riche et navigation", () => {
  it("n'est pas pré-cochée quand checked vaut false", () => {
    renderCheckbox(
      <Checkbox
        checked={false}
        onChange={() => {}}
        label={
          <>
            J'accepte les <Link href="#cgu">conditions</Link>
          </>
        }
      />,
    );
    expect(screen.getByRole("checkbox", { name: /conditions/ })).not.toBeChecked();
  });

  it("ne prévient pas l'action par défaut du lien contenu dans le label", async () => {
    const user = userEvent.setup();
    let observedDefaultPrevented: boolean | null = null;
    renderCheckbox(
      <Checkbox
        checked={false}
        onChange={() => {}}
        label={
          <>
            J'accepte les{" "}
            <a
              href="#cgu"
              onClick={(event) => {
                observedDefaultPrevented = event.isDefaultPrevented();
              }}
            >
              conditions
            </a>
          </>
        }
      />,
    );
    await user.click(screen.getByRole("link", { name: "conditions" }));
    expect(observedDefaultPrevented).toBe(false);
  });
});

describe("Checkbox - AC4 accessibilité", () => {
  it("propage l'attribut required sur le champ", () => {
    renderCheckbox(<Checkbox checked={false} onChange={() => {}} required label="Accepter" />);
    expect(screen.getByRole("checkbox", { name: "Accepter" })).toBeRequired();
  });

  it("ne marque pas le champ comme required par défaut", () => {
    renderCheckbox(<Checkbox checked={false} onChange={() => {}} label="Accepter" />);
    expect(screen.getByRole("checkbox", { name: "Accepter" })).not.toBeRequired();
  });

  it("n'expose pas aria-invalid en l'absence d'erreur", () => {
    renderCheckbox(<Checkbox checked={false} onChange={() => {}} label="Accepter" />);
    const checkbox = screen.getByRole("checkbox", { name: "Accepter" });
    expect(checkbox).not.toHaveAttribute("aria-invalid", "true");
    expect(checkbox).not.toHaveAttribute("aria-describedby");
  });
});
