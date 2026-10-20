import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { SegmentedControl } from "../SegmentedControl";
import type { CanopSegmentedControlOption } from "../SegmentedControl";

const options: CanopSegmentedControlOption[] = [
  { value: "grid", label: "Grille" },
  { value: "list", label: "Liste" },
];

function renderControl(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("SegmentedControl", () => {
  it("rend un radiogroup étiqueté avec une option par valeur", () => {
    renderControl(
      <SegmentedControl
        options={options}
        value="grid"
        onChange={() => undefined}
        ariaLabel="Affichage"
      />,
    );
    expect(screen.getByRole("radiogroup", { name: "Affichage" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("coche l'option correspondant à la valeur active", () => {
    renderControl(
      <SegmentedControl
        options={options}
        value="list"
        onChange={() => undefined}
        ariaLabel="Affichage"
      />,
    );
    expect(screen.getByRole("radio", { name: "Liste" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Grille" })).toHaveAttribute("aria-checked", "false");
  });

  it("place uniquement l'option active dans l'ordre de tabulation", () => {
    renderControl(
      <SegmentedControl
        options={options}
        value="grid"
        onChange={() => undefined}
        ariaLabel="Affichage"
      />,
    );
    expect(screen.getByRole("radio", { name: "Grille" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("radio", { name: "Liste" })).toHaveAttribute("tabindex", "-1");
  });

  it("émet onChange au clic sur une option non sélectionnée", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderControl(
      <SegmentedControl options={options} value="grid" onChange={onChange} ariaLabel="Affichage" />,
    );
    await user.click(screen.getByRole("radio", { name: "Liste" }));
    expect(onChange).toHaveBeenCalledWith("list");
  });

  it("n'émet pas onChange au clic sur l'option déjà sélectionnée", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderControl(
      <SegmentedControl options={options} value="grid" onChange={onChange} ariaLabel="Affichage" />,
    );
    await user.click(screen.getByRole("radio", { name: "Grille" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("désactive une option marquée disabled", () => {
    renderControl(
      <SegmentedControl
        options={[...options, { value: "board", label: "Tableau", disabled: true }]}
        value="grid"
        onChange={() => undefined}
        ariaLabel="Affichage"
      />,
    );
    expect(screen.getByRole("radio", { name: "Tableau" })).toBeDisabled();
  });

  it("navigue vers l'option suivante avec la flèche droite", () => {
    const onChange = vi.fn();
    renderControl(
      <SegmentedControl options={options} value="grid" onChange={onChange} ariaLabel="Affichage" />,
    );
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("list");
  });

  it("navigue vers la dernière option avec End et la première avec Home", () => {
    const onChange = vi.fn();
    renderControl(
      <SegmentedControl options={options} value="grid" onChange={onChange} ariaLabel="Affichage" />,
    );
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith("list");
  });

  it("saute les options désactivées lors de la navigation clavier", () => {
    const onChange = vi.fn();
    renderControl(
      <SegmentedControl
        options={[
          { value: "grid", label: "Grille" },
          { value: "list", label: "Liste", disabled: true },
          { value: "board", label: "Tableau" },
        ]}
        value="grid"
        onChange={onChange}
        ariaLabel="Affichage"
      />,
    );
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("board");
  });
});
