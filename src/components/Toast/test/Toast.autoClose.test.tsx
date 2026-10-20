import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Toast } from "../Toast";

function renderToast(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("Toast - fermeture automatique", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("se ferme apres trois secondes par defaut", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    renderToast(<Toast open message="Enregistre" onClose={onClose} />);
    act(() => {
      vi.advanceTimersByTime(2999);
    });
    expect(onClose).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("respecte la duree d'affichage demandee", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    renderToast(<Toast open message="Enregistre" onClose={onClose} duration={500} />);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("ne se ferme pas tant qu'il n'est pas ouvert", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    renderToast(<Toast open={false} message="Enregistre" onClose={onClose} />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(onClose).not.toHaveBeenCalled();
  });
});

function fondDuToast(element: HTMLElement): string {
  const feuilles = [...document.querySelectorAll("style")]
    .map((style) => style.textContent ?? "")
    .join("");

  for (const classe of element.className.split(" ").filter(Boolean)) {
    const regle = new RegExp(`\\.${classe}\\{[^}]*?background(?:-color)?:([^;}]+)`).exec(feuilles);
    if (regle) return regle[1].trim();
  }
  return "";
}

describe("Toast - severites", () => {
  it("distingue chaque severite par sa couleur de fond", () => {
    renderToast(
      <>
        <Toast open message="Succes" onClose={() => undefined} severity="success" />
        <Toast open message="Echec" onClose={() => undefined} severity="error" />
        <Toast open message="Information" onClose={() => undefined} severity="info" />
      </>,
    );
    const couleurs = screen.getAllByRole("status").map(fondDuToast);
    expect(couleurs.every((couleur) => couleur !== "")).toBe(true);
    expect(new Set(couleurs).size).toBe(3);
  });

  it("adopte la severite de succes par defaut", () => {
    renderToast(
      <>
        <Toast open message="Par defaut" onClose={() => undefined} />
        <Toast open message="Succes explicite" onClose={() => undefined} severity="success" />
      </>,
    );
    const [defaut, explicite] = screen
      .getAllByRole("status")
      .map((toast) => getComputedStyle(toast).backgroundColor);
    expect(defaut).toBe(explicite);
  });
});
