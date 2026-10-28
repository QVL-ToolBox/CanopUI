import { afterEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { ShapeBackground } from "..";
import {
  avancerFrames,
  installerEnvironnementLave,
  quitterEnvironnementLave,
  rendreAvecTheme,
  simulerMouvementReduit,
} from "./lavaTestKit";

function fondAnime() {
  return (
    <ShapeBackground animated>
      <p>Contenu de page</p>
    </ShapeBackground>
  );
}

describe("ShapeBackground — nettoyage", () => {
  afterEach(() => {
    quitterEnvironnementLave();
  });

  it("annule la frame d'animation en attente au démontage", () => {
    const { frames, visibilite } = installerEnvironnementLave();
    const { unmount } = rendreAvecTheme(fondAnime());
    visibilite.afficher();
    avancerFrames(frames, 3);
    expect(frames.enAttente()).toBeGreaterThan(0);
    unmount();
    expect(frames.enAttente()).toBe(0);
    expect(frames.annulees).toBeGreaterThan(0);
  });

  it("ne relance aucune frame après le démontage", () => {
    const { frames, visibilite } = installerEnvironnementLave();
    const { unmount } = rendreAvecTheme(fondAnime());
    visibilite.afficher();
    unmount();
    const demandeesAuDemontage = frames.demandees;
    avancerFrames(frames, 3);
    expect(frames.demandees).toBe(demandeesAuDemontage);
  });

  it("déconnecte chaque ResizeObserver créé au démontage", () => {
    const { redimensionnement } = installerEnvironnementLave();
    const { unmount } = rendreAvecTheme(fondAnime());
    expect(redimensionnement.instances).toBeGreaterThan(0);
    unmount();
    expect(redimensionnement.deconnexions).toBe(redimensionnement.instances);
  });

  it("déconnecte aussi le ResizeObserver d'un fond fixe au démontage", () => {
    const { redimensionnement } = installerEnvironnementLave();
    const { unmount } = rendreAvecTheme(<ShapeBackground>Contenu</ShapeBackground>);
    unmount();
    expect(redimensionnement.deconnexions).toBe(redimensionnement.instances);
  });

  it("se monte, s'anime et se démonte sans ResizeObserver, IntersectionObserver ni canvas", () => {
    simulerMouvementReduit(false);
    vi.stubGlobal("ResizeObserver", undefined);
    vi.stubGlobal("IntersectionObserver", undefined);
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    expect(() => {
      const { unmount } = rendreAvecTheme(fondAnime());
      expect(screen.getByText("Contenu de page")).toBeInTheDocument();
      unmount();
    }).not.toThrow();
  });

  it("se rend en jsdom brut sans plantage", () => {
    Reflect.deleteProperty(window, "matchMedia");
    expect(() => {
      const { unmount } = rendreAvecTheme(fondAnime());
      expect(screen.getByText("Contenu de page")).toBeInTheDocument();
      unmount();
    }).not.toThrow();
  });
});
