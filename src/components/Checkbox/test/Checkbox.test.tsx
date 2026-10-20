import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { Checkbox } from "../Checkbox";
import { Link } from "../../Link";

function renderCheckbox(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("Checkbox", () => {
  it("rend une case associée à son label texte", () => {
    renderCheckbox(<Checkbox checked={false} onChange={() => {}} label="Accepter" />);
    expect(screen.getByRole("checkbox", { name: "Accepter" })).toBeInTheDocument();
  });

  it("appelle onChange au clic sur le label", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderCheckbox(<Checkbox checked={false} onChange={onChange} label="Accepter" />);
    await user.click(screen.getByText("Accepter"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("ne déclenche pas onChange quand disabled", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onChange = vi.fn();
    renderCheckbox(<Checkbox checked={false} onChange={onChange} disabled label="Accepter" />);
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("accepte un label React contenant un lien", () => {
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
    expect(screen.getByRole("link", { name: "conditions" })).toBeInTheDocument();
  });

  it("affiche un message d'erreur associé à la case (aria-describedby)", () => {
    renderCheckbox(
      <Checkbox
        checked={false}
        onChange={() => {}}
        required
        error="Vous devez accepter les conditions."
        label="Accepter"
      />,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Accepter" });
    const message = screen.getByText("Vous devez accepter les conditions.");
    expect(message).toBeInTheDocument();
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(checkbox).toHaveAttribute("aria-describedby", message.getAttribute("id"));
  });
});
