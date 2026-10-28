import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { DatePicker } from "../DatePicker";
import type { CanopDatePickerProps } from "../DatePicker";

function renderPicker(props: Partial<CanopDatePickerProps> = {}) {
  const onChange = vi.fn();
  render(
    <CanopThemeProvider>
      <DatePicker label="Date" value={new Date(2026, 5, 15)} onChange={onChange} {...props} />
    </CanopThemeProvider>,
  );
  return onChange;
}

describe("DatePicker", () => {
  it("affiche la valeur au format jour/mois/année dans un champ en lecture seule", () => {
    renderPicker();
    const champ = screen.getByLabelText("Date");
    expect(champ).toHaveValue("15/06/2026");
    expect(champ).toHaveAttribute("readonly");
  });

  it("est fermé au départ puis ouvre le calendrier au clic sur le bouton", async () => {
    const user = userEvent.setup();
    renderPicker();
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Choisir une date" }));
    expect(await screen.findByRole("grid")).toBeInTheDocument();
    expect(screen.getByText("Juin 2026")).toBeInTheDocument();
  });

  it("transmet le jour choisi et referme le calendrier", async () => {
    const user = userEvent.setup();
    const onChange = renderPicker();
    await user.click(screen.getByRole("button", { name: "Choisir une date" }));
    await user.click(await screen.findByRole("button", { name: "jeudi 18 juin 2026" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    const choisi = onChange.mock.calls[0][0] as Date;
    expect([choisi.getFullYear(), choisi.getMonth(), choisi.getDate()]).toEqual([2026, 5, 18]);
    await waitFor(() => expect(screen.queryByRole("grid")).not.toBeInTheDocument());
  });

  it("propage min au calendrier", async () => {
    const user = userEvent.setup();
    renderPicker({ min: new Date(2026, 5, 10) });
    await user.click(screen.getByRole("button", { name: "Choisir une date" }));
    expect(await screen.findByRole("button", { name: "mardi 9 juin 2026" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("efface la valeur quand il est clearable", async () => {
    const user = userEvent.setup();
    const onChange = renderPicker({ clearable: true });
    await user.click(screen.getByRole("button", { name: "Effacer la date" }));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("ne propose pas d'effacement sans clearable", () => {
    renderPicker();
    expect(screen.queryByRole("button", { name: "Effacer la date" })).not.toBeInTheDocument();
  });

  it("ne propose pas d'effacement quand la valeur est vide", () => {
    renderPicker({ clearable: true, value: null });
    expect(screen.getByLabelText("Date")).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Effacer la date" })).not.toBeInTheDocument();
  });

  it("affiche l'erreur fournie", () => {
    renderPicker({ error: "Choisis une date." });
    expect(screen.getByText("Choisis une date.")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toHaveAttribute("aria-invalid", "true");
  });

  it("ne s'ouvre pas quand il est désactivé", () => {
    renderPicker({ disabled: true });
    expect(screen.getByRole("button", { name: "Choisir une date" })).toBeDisabled();
  });
});
