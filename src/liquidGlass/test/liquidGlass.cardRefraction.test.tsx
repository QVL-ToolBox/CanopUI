import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CanopThemeProvider, type CanopCardProps } from "../../index";
import { racineDeCarte } from "../../test/cardTestKit";
import { blocsBrutsDe } from "../../test/cssRules";
import { revenirAJsdom, simulerChromium } from "../../test/liquidGlassTestKit";

type StyleEnLigne = Record<"backdropFilter" | "WebkitBackdropFilter", string | undefined>;

const FLOU_LIQUIDE = "blur(0.25rem) saturate(1.8)";
const DECLARATION_DE_FLOU = /(-webkit-)?backdrop-filter:([^;}]*)/g;

afterEach(revenirAJsdom);

function monter(ui: ReactNode) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

function poserCarte(props: Partial<CanopCardProps> = {}) {
  const rendu = monter(
    <Card variant="frosted" title="Bonjour" {...props}>
      Trois revues vous attendent.
    </Card>,
  );
  return { ...rendu, racine: racineDeCarte(rendu.container) };
}

const filtresDe = (racine: Element) => Array.from(racine.querySelectorAll("filter"));

const classesEmotion = (element: Element) =>
  Array.from(element.classList).filter((classe) => classe.startsWith("css-"));

function flousEnLigne(racine: HTMLElement) {
  const style = racine.style as unknown as StyleEnLigne;
  return { standard: style.backdropFilter ?? "", webkit: style.WebkitBackdropFilter ?? "" };
}

function flousDuSx(racine: Element) {
  return blocsBrutsDe(racine).flatMap((bloc) =>
    Array.from(bloc.matchAll(DECLARATION_DE_FLOU), ([, prefixe, valeur]) => ({
      prefixe: prefixe ?? "",
      valeur: valeur.trim(),
    })),
  );
}

describe("AC-R1 - la mesure de la carte passe par requestAnimationFrame", () => {
  it("demande une frame et ne rend le filtre SVG qu'a la frame suivante", () => {
    const { frames } = simulerChromium();
    const { racine } = poserCarte();
    expect(frames.demandees).toBeGreaterThan(0);
    expect(filtresDe(racine)).toHaveLength(0);
    frames.avancer();
    const [filtre] = filtresDe(racine);
    expect(filtre?.querySelector("feDisplacementMap")).not.toBeNull();
  });

  it("annule la frame en attente et deconnecte le ResizeObserver au demontage", () => {
    const environnement = simulerChromium();
    const { unmount } = poserCarte();
    expect(environnement.frames.enAttente()).toBeGreaterThan(0);
    unmount();
    expect(vi.mocked(cancelAnimationFrame)).toHaveBeenCalled();
    expect(environnement.frames.annulees).toBeGreaterThan(0);
    expect(environnement.frames.enAttente()).toBe(0);
    expect(environnement.instances).toBeGreaterThan(0);
    expect(environnement.deconnexions).toBeGreaterThanOrEqual(environnement.instances);
  });

  it("deconnecte le ResizeObserver au demontage une fois la frame passee", () => {
    const environnement = simulerChromium();
    const { unmount } = poserCarte();
    environnement.frames.avancer();
    unmount();
    expect(environnement.instances).toBeGreaterThan(0);
    expect(environnement.deconnexions).toBeGreaterThanOrEqual(environnement.instances);
  });

  it("annule chaque frame en attente quand plusieurs cartes sont demontees", () => {
    const environnement = simulerChromium();
    const { unmount } = monter(
      <>
        <Card variant="frosted">Premiere</Card>
        <Card variant="frosted">Deuxieme</Card>
      </>,
    );
    expect(environnement.frames.enAttente()).toBeGreaterThan(0);
    unmount();
    expect(environnement.frames.enAttente()).toBe(0);
    expect(environnement.deconnexions).toBeGreaterThanOrEqual(environnement.instances);
  });

  it("mesure de facon synchrone sans ResizeObserver", () => {
    const { frames } = simulerChromium();
    vi.stubGlobal("ResizeObserver", undefined);
    const { racine } = poserCarte();
    expect(screen.getByText("Trois revues vous attendent.")).toBeInTheDocument();
    const [filtre] = filtresDe(racine);
    expect(filtre?.querySelector("feDisplacementMap")).not.toBeNull();
    expect(frames.enAttente()).toBe(0);
  });

  it("se demonte sans plantage sans ResizeObserver", () => {
    simulerChromium();
    vi.stubGlobal("ResizeObserver", undefined);
    const { unmount } = poserCarte();
    expect(unmount).not.toThrow();
  });
});

describe("AC-R2 - classe Emotion partagee et url() en style inline", () => {
  it("donne la meme classe Emotion a toutes les cartes frosted sous Chromium", () => {
    const { frames } = simulerChromium();
    const { container } = monter(
      <>
        <Card variant="frosted">Premiere</Card>
        <Card variant="frosted">Deuxieme</Card>
        <Card variant="frosted">Troisieme</Card>
      </>,
    );
    frames.avancer();
    const cartes = Array.from(container.querySelectorAll(".MuiCard-root"));
    const ids = cartes.flatMap((carte) => filtresDe(carte).map((filtre) => filtre.id));
    expect(new Set(ids).size).toBe(cartes.length);
    const classes = cartes.map((carte) => classesEmotion(carte).join(" "));
    expect(classes[0]).not.toBe("");
    expect(new Set(classes).size).toBe(1);
  });

  it("donne la meme classe Emotion a une carte refractee et a une carte de repli", () => {
    const { racine: carteDeRepli } = poserCarte();
    const classeDeRepli = classesEmotion(carteDeRepli).join(" ");
    revenirAJsdom();
    const { frames } = simulerChromium();
    const { racine: carteRefractee } = poserCarte();
    frames.avancer();
    expect(filtresDe(carteRefractee)).toHaveLength(1);
    expect(classesEmotion(carteRefractee).join(" ")).toBe(classeDeRepli);
  });

  it("ne met que le flou et la saturation dans le sx, standard et -webkit-", () => {
    const { frames } = simulerChromium();
    const { racine } = poserCarte();
    frames.avancer();
    const flous = flousDuSx(racine);
    expect(flous.some(({ prefixe }) => prefixe === "")).toBe(true);
    expect(flous.some(({ prefixe }) => prefixe === "-webkit-")).toBe(true);
    flous.forEach(({ valeur }) => expect(valeur).toBe(FLOU_LIQUIDE));
  });

  it("pose url(#id du filtre) devant le flou en style inline, standard et -webkit-", () => {
    const { frames } = simulerChromium();
    const { racine } = poserCarte();
    frames.avancer();
    const [filtre] = filtresDe(racine);
    const attendu = `url(#${filtre.id}) ${FLOU_LIQUIDE}`;
    expect(flousEnLigne(racine)).toEqual({ standard: attendu, webkit: attendu });
  });

  it("ne pose aucun backdrop-filter inline hors Chromium", () => {
    const { racine } = poserCarte();
    expect(flousEnLigne(racine)).toEqual({ standard: "", webkit: "" });
  });

  it("ne pose jamais de reference de filtre vide en style inline avant la mesure", () => {
    simulerChromium();
    const { racine } = poserCarte();
    expect(flousEnLigne(racine).standard).not.toMatch(/url\(#\)/);
  });

  it.each(["sm", "md", "lg"] as const)(
    "ne pose aucun backdrop-filter inline sous Chromium avec elevation=%s",
    (elevation) => {
      const { frames } = simulerChromium();
      const { racine } = poserCarte({ elevation });
      frames.avancer();
      expect(flousEnLigne(racine)).toEqual({ standard: "", webkit: "" });
    },
  );
});
