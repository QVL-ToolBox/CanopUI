import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { WeekdayPicker } from "../WeekdayPicker";
import type { CanopWeekday } from "../../Calendar";

function renderPicker(value: CanopWeekday[], disabled = false) {
  const onChange = vi.fn();
  render(
    <CanopThemeProvider>
      <WeekdayPicker value={value} onChange={onChange} label="Jours" disabled={disabled} />
    </CanopThemeProvider>,
  );
  return onChange;
}

describe("WeekdayPicker", () => {
  it("rend les sept jours du lundi au dimanche dans un groupe étiqueté", () => {
    renderPicker([]);
    const groupe = screen.getByRole("group", { name: "Jours" });
    const jours = Array.from(groupe.querySelectorAll("button")).map((bouton) =>
      bouton.getAttribute("aria-label"),
    );
    expect(jours).toEqual([
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
      "Dimanche",
    ]);
  });

  it("presse les jours de la valeur", () => {
    renderPicker([3, 1]);
    expect(screen.getByRole("button", { name: "Lundi" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Mercredi" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Mardi" })).toHaveAttribute("aria-pressed", "false");
  });

  it("ajoute un jour en renvoyant une valeur triée", async () => {
    const user = userEvent.setup();
    const onChange = renderPicker([7, 3]);
    await user.click(screen.getByRole("button", { name: "Lundi" }));
    expect(onChange).toHaveBeenCalledWith([1, 3, 7]);
  });

  it("retire un jour en gardant l'ordre", async () => {
    const user = userEvent.setup();
    const onChange = renderPicker([1, 3, 7]);
    await user.click(screen.getByRole("button", { name: "Mercredi" }));
    expect(onChange).toHaveBeenCalledWith([1, 7]);
  });

  it("peut retirer le dernier jour", async () => {
    const user = userEvent.setup();
    const onChange = renderPicker([5]);
    await user.click(screen.getByRole("button", { name: "Vendredi" }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("n'émet rien quand il est désactivé", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onChange = renderPicker([1], true);
    await user.click(screen.getByRole("button", { name: "Mardi" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
