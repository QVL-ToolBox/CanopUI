import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { Calendar } from "../Calendar";
import type { CanopCalendarProps } from "../Calendar";

function renderCalendar(props: Partial<CanopCalendarProps> = {}) {
  const onChange = vi.fn();
  render(
    <CanopThemeProvider>
      <Calendar value={new Date(2026, 5, 15)} onChange={onChange} animated={false} {...props} />
    </CanopThemeProvider>,
  );
  return onChange;
}

function day(label: string) {
  return screen.getByRole("button", { name: label });
}

function expectSameDay(actual: Date, expected: Date) {
  expect(actual.getFullYear()).toBe(expected.getFullYear());
  expect(actual.getMonth()).toBe(expected.getMonth());
  expect(actual.getDate()).toBe(expected.getDate());
}

describe("Calendar", () => {
  it("affiche le mois de la valeur avec le lundi en premier", () => {
    renderCalendar();
    expect(screen.getByText("Juin 2026")).toBeInTheDocument();
    const enTetes = screen
      .getAllByRole("columnheader")
      .map((cellule) => cellule.getAttribute("aria-label"));
    expect(enTetes).toEqual([
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
      "Dimanche",
    ]);
  });

  it("place le 1er juin 2026, un lundi, dans la première colonne", () => {
    renderCalendar();
    const premiereLigne = screen.getAllByRole("row")[1];
    expect(premiereLigne.querySelector("button")).toHaveAttribute(
      "aria-label",
      "lundi 1 juin 2026",
    );
  });

  it("marque la valeur comme sélectionnée et aujourd'hui comme date courante", () => {
    renderCalendar();
    expect(day("lundi 15 juin 2026").closest("[role='gridcell']")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(day("mercredi 10 juin 2026")).toHaveAttribute("aria-current", "date");
  });

  it("navigue vers le mois suivant puis le mois précédent", async () => {
    const user = userEvent.setup();
    renderCalendar();
    await user.click(screen.getByRole("button", { name: "Mois suivant" }));
    expect(screen.getByText("Juillet 2026")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Mois précédent" }));
    await user.click(screen.getByRole("button", { name: "Mois précédent" }));
    expect(screen.getByText("Mai 2026")).toBeInTheDocument();
  });

  it("passe d'une année à l'autre en décembre", async () => {
    const user = userEvent.setup();
    renderCalendar({ value: new Date(2026, 11, 20) });
    await user.click(screen.getByRole("button", { name: "Mois suivant" }));
    expect(screen.getByText("Janvier 2027")).toBeInTheDocument();
  });

  it("sélectionne le jour cliqué", async () => {
    const user = userEvent.setup();
    const onChange = renderCalendar();
    await user.click(day("jeudi 18 juin 2026"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expectSameDay(onChange.mock.calls[0][0], new Date(2026, 5, 18));
  });

  it("désactive les jours hors de min et max et ignore leur clic", async () => {
    const user = userEvent.setup();
    const onChange = renderCalendar({ min: new Date(2026, 5, 5), max: new Date(2026, 5, 20) });
    expect(day("jeudi 4 juin 2026")).toHaveAttribute("aria-disabled", "true");
    expect(day("dimanche 21 juin 2026")).toHaveAttribute("aria-disabled", "true");
    expect(day("vendredi 5 juin 2026")).not.toHaveAttribute("aria-disabled", "true");
    expect(day("samedi 20 juin 2026")).not.toHaveAttribute("aria-disabled", "true");
    await user.click(day("jeudi 4 juin 2026"));
    await user.click(day("dimanche 21 juin 2026"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("bloque la navigation au-delà des mois de min et max", () => {
    renderCalendar({ min: new Date(2026, 5, 5), max: new Date(2026, 5, 20) });
    expect(screen.getByRole("button", { name: "Mois précédent" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Mois suivant" })).toBeDisabled();
  });

  it("désactive les jours refusés par isDateDisabled", () => {
    renderCalendar({ isDateDisabled: (date) => date.getDay() === 0 });
    expect(day("dimanche 14 juin 2026")).toHaveAttribute("aria-disabled", "true");
    expect(day("lundi 15 juin 2026")).not.toHaveAttribute("aria-disabled", "true");
  });

  it("déplace le focus au clavier et valide avec Entrée", async () => {
    const user = userEvent.setup();
    const onChange = renderCalendar();
    day("lundi 15 juin 2026").focus();
    await user.keyboard("{ArrowRight}");
    expect(day("mardi 16 juin 2026")).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(day("mardi 23 juin 2026")).toHaveFocus();
    await user.keyboard("{ArrowLeft}{ArrowUp}");
    expect(day("lundi 15 juin 2026")).toHaveFocus();
    await user.keyboard("{ArrowRight}{Enter}");
    expect(onChange).toHaveBeenCalledTimes(1);
    expectSameDay(onChange.mock.calls[0][0], new Date(2026, 5, 16));
  });

  it("change de mois quand le focus clavier sort du mois affiché", async () => {
    const user = userEvent.setup();
    renderCalendar({ value: new Date(2026, 5, 30) });
    day("mardi 30 juin 2026").focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("Juillet 2026")).toBeInTheDocument();
    expect(day("mercredi 1 juillet 2026")).toHaveFocus();
  });

  it("ne sort pas de la borne min au clavier", async () => {
    const user = userEvent.setup();
    renderCalendar({ value: new Date(2026, 5, 5), min: new Date(2026, 5, 5) });
    day("vendredi 5 juin 2026").focus();
    await user.keyboard("{ArrowLeft}");
    expect(day("jeudi 4 juin 2026")).not.toHaveFocus();
  });
});
