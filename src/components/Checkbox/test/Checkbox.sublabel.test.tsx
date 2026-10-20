import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { Checkbox } from "../Checkbox";

function renderCheckbox(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("Checkbox sublabel", () => {
  it("rend le label et le sublabel", () => {
    renderCheckbox(
      <Checkbox
        checked={false}
        onChange={() => {}}
        label="J'ai lu et j'accepte les"
        sublabel="Conditions Générales d'Utilisation"
      />,
    );
    expect(screen.getByText("J'ai lu et j'accepte les")).toBeInTheDocument();
    expect(screen.getByText(/Conditions Générales d'Utilisation/)).toBeInTheDocument();
  });

  it("associe le label a l'input via htmlFor", () => {
    renderCheckbox(
      <Checkbox
        checked={false}
        onChange={() => {}}
        label="J'ai lu et j'accepte les"
        sublabel="Conditions Générales d'Utilisation"
      />,
    );
    const input = screen.getByRole("checkbox");
    const label = screen.getByText("J'ai lu et j'accepte les").closest("label");
    expect(label).not.toBeNull();
    expect(label).toHaveAttribute("for", input.getAttribute("id"));
  });

  it("coche la case au clic sur le label", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderCheckbox(
      <Checkbox
        checked={false}
        onChange={onChange}
        label="J'ai lu et j'accepte les"
        sublabel="Conditions Générales d'Utilisation"
      />,
    );
    await user.click(screen.getByText("J'ai lu et j'accepte les"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("ne coche pas la case au clic sur le sublabel", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderCheckbox(
      <Checkbox
        checked={false}
        onChange={onChange}
        label="J'ai lu et j'accepte les"
        sublabel="Conditions Générales d'Utilisation"
      />,
    );
    await user.click(screen.getByText(/Conditions Générales d'Utilisation/));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("affiche l'asterisque requis pres du sublabel", () => {
    renderCheckbox(
      <Checkbox
        checked={false}
        onChange={() => {}}
        required
        label="J'ai lu et j'accepte les"
        sublabel="Conditions Générales d'Utilisation"
      />,
    );
    expect(screen.getByRole("checkbox")).toBeRequired();
    expect(screen.getByText("*", { exact: false })).toBeInTheDocument();
  });
});
