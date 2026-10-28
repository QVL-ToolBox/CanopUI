import { describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { TimePicker } from "../TimePicker";

interface ControlledPickerProps {
  initial: string;
  onChange: (value: string) => void;
}

function ControlledPicker({ initial, onChange }: ControlledPickerProps) {
  const [value, setValue] = useState(initial);
  return (
    <TimePicker
      label="Heure"
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange(next);
      }}
    />
  );
}

function renderPicker(initial = "") {
  const onChange = vi.fn();
  render(
    <CanopThemeProvider>
      <ControlledPicker initial={initial} onChange={onChange} />
    </CanopThemeProvider>,
  );
  return onChange;
}

describe("TimePicker", () => {
  it("affiche la valeur dans un champ HH:MM", () => {
    renderPicker("09:30");
    expect(screen.getByLabelText("Heure")).toHaveValue("09:30");
    expect(screen.getByLabelText("Heure")).toHaveAttribute("placeholder", "HH:MM");
  });

  it.each([
    ["9h30", "09:30"],
    ["0930", "09:30"],
    ["7:05", "07:05"],
  ])("normalise la saisie « %s » en %s", async (saisie, attendu) => {
    const user = userEvent.setup();
    const onChange = renderPicker();
    await user.type(screen.getByLabelText("Heure"), saisie);
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith(attendu);
    expect(screen.getByLabelText("Heure")).toHaveValue(attendu);
  });

  it("ouvre le cadran au clic sur le bouton", async () => {
    const user = userEvent.setup();
    renderPicker("09:30");
    await user.click(screen.getByRole("button", { name: "Choisir une heure" }));
    expect(await screen.findByRole("slider")).toBeInTheDocument();
  });
});
