import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { ShareResult, type CanopShareTone } from "../ShareResult";

const GRILLE: CanopShareTone[][] = [
  ["miss", "near"],
  ["near", "near"],
  ["hit", "hit"],
];

const TEXTE = "DéparteMental 2026-09-07 — 3/6";

function poser(ui: React.ReactNode, locale: "fr" | "en" = "fr") {
  return render(
    <CanopThemeProvider>
      <CanopI18nProvider locale={locale}>{ui}</CanopI18nProvider>
    </CanopThemeProvider>,
  );
}

function poserPressePapier(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
}

afterEach(() => {
  Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
  vi.restoreAllMocks();
});

describe("ShareResult", () => {
  it("annonce la grille et son nombre d'essais", () => {
    poser(<ShareResult rows={GRILLE} text={TEXTE} />);
    expect(screen.getByRole("img", { name: "Grille de résultat, 3 essais" })).toBeInTheDocument();
  });

  it("copie exactement le texte fourni par le jeu", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    poserPressePapier(writeText);
    poser(<ShareResult rows={GRILLE} text={TEXTE} />);

    await userEvent.click(screen.getByRole("button", { name: "Partager le résultat" }));

    expect(writeText).toHaveBeenCalledWith(TEXTE);
  });

  it("confirme la copie", async () => {
    poserPressePapier(() => Promise.resolve());
    poser(<ShareResult rows={GRILLE} text={TEXTE} />);

    await userEvent.click(screen.getByRole("button", { name: "Partager le résultat" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Copié !" })).toBeInTheDocument(),
    );
  });

  it("dit franchement quand la copie a échoué, et comment s'en sortir", async () => {
    poserPressePapier(() => Promise.reject(new Error("refusé")));
    poser(<ShareResult rows={GRILLE} text={TEXTE} />);

    await userEvent.click(screen.getByRole("button", { name: "Partager le résultat" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Copie impossible" })).toBeInTheDocument(),
    );
    expect(screen.getByText(/Sélectionnez le texte/)).toBeInTheDocument();
  });

  it("garde l'explication même quand le libellé du bouton est imposé", async () => {
    poserPressePapier(() => Promise.reject(new Error("refusé")));
    poser(<ShareResult rows={GRILLE} text={TEXTE} failedLabel="Raté" />);

    await userEvent.click(screen.getByRole("button", { name: "Partager le résultat" }));

    await waitFor(() => expect(screen.getByRole("button", { name: "Raté" })).toBeInTheDocument());
    expect(screen.getByText(/Sélectionnez le texte/)).toBeInTheDocument();
  });

  it("accepte une grille vide sans casser", () => {
    poser(<ShareResult rows={[]} text="" />);
    expect(screen.getByRole("img", { name: "Grille de résultat, 0 essais" })).toBeInTheDocument();
  });

  it("suit la langue courante", () => {
    poser(<ShareResult rows={GRILLE} text={TEXTE} />, "en");
    expect(screen.getByRole("button", { name: "Share result" })).toBeInTheDocument();
  });
});
