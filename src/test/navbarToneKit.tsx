import type { ReactElement, ReactNode } from "react";
import { render, within } from "@testing-library/react";
import { vi } from "vitest";
import { CanopThemeProvider, type CanopThemeMode } from "../theme";
import { CanopI18nProvider } from "../i18n";
import { palette, paletteDark } from "../tokens/palette";
import { mixSrgb } from "./contrastRatio";

export const VARIABLES_NAVBAR = [
  "bg-top",
  "bg-bottom",
  "text",
  "text-hover",
  "text-muted",
  "hover-fill",
  "edge",
  "separator",
  "active-bg",
  "active-text",
  "halo",
  "foot-glow",
] as const;

export interface CouleurResolue {
  hex: string;
  alpha: number;
}

const BLANC = "#ffffff";
const NOIR = "#000000";

export function rendreTonal(ui: ReactElement, mode: CanopThemeMode = "light") {
  return render(ui, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <CanopI18nProvider locale="fr">
        <CanopThemeProvider mode={mode}>{children}</CanopThemeProvider>
      </CanopI18nProvider>
    ),
  });
}

export function simulerViewport(correspond: (requete: string) => boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: correspond(query),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

export const VIEWPORTS = {
  etendu: () => false,
  rail: (requete: string) => requete.includes("min-width"),
  mobile: () => true,
} as const;

export const moinsDeMouvement = (requete: string) => requete.includes("prefers-reduced-motion");

export function texteDesStyles(): string {
  return Array.from(document.querySelectorAll("style"))
    .map((balise) => balise.textContent ?? "")
    .join("\n");
}

export function variablesNavbarPoseesSurRoot(): Record<string, string> {
  const blocs = texteDesStyles().match(/:root\{[^}]*\}/g) ?? [];
  const variables: Record<string, string> = {};
  for (const bloc of blocs) {
    for (const [, nom, valeur] of bloc.matchAll(/--canop-navbar-([a-z-]+):([^;}]+)/g)) {
      variables[nom] = valeur.trim();
    }
  }
  return variables;
}

interface RegleIndexee {
  texte: string;
  classes: Set<string>;
}

function indexerLesRegles(): RegleIndexee[] {
  return (texteDesStyles().match(/[^{}]*\{[^{}]*\}/g) ?? []).map((texte) => ({
    texte,
    classes: new Set(texte.split("{")[0].match(/(?<=\.)css-[\w-]+/g) ?? []),
  }));
}

function reglesDesClasses(element: Element, regles: RegleIndexee[]): string[] {
  return Array.from(element.classList)
    .filter((classe) => classe.startsWith("css-"))
    .flatMap((classe) =>
      regles.filter((regle) => regle.classes.has(classe)).map((regle) => regle.texte),
    );
}

export function reglesBrutesVisant(element: Element): string[] {
  return reglesDesClasses(element, indexerLesRegles());
}

export function reglesBrutesDesElements(elements: Element[]): string[] {
  const regles = indexerLesRegles();
  return elements.flatMap((element) => reglesDesClasses(element, regles));
}

export function reglesBrutesDuSousArbre(racine: Element): string[] {
  return reglesBrutesDesElements([racine, ...Array.from(racine.querySelectorAll("*"))]);
}

export function classesEmotionDuSousArbre(racine: Element): string[] {
  return [racine, ...Array.from(racine.querySelectorAll("*"))].flatMap((element) =>
    Array.from(element.classList).filter((classe) => classe.startsWith("css-")),
  );
}

export function pastilleActive(lien: Element): HTMLElement | null {
  return lien.querySelector<HTMLElement>(":scope > span[aria-hidden='true']");
}

export function navigationPrincipale(): HTMLElement {
  return within(document.body).getByRole("navigation", { name: "Navigation principale" });
}

function couleurDePalette(nom: string, mode: CanopThemeMode): string {
  if (nom === "common-white") return BLANC;
  if (nom === "common-black") return NOIR;
  const [groupe, nuance] = nom.split("-");
  const source = (mode === "light" ? palette : paletteDark) as unknown as Record<
    string,
    Record<string, string>
  >;
  return source[groupe][nuance];
}

export function resoudreCouleur(valeur: string, mode: CanopThemeMode): CouleurResolue {
  const reference = valeur.match(/^var\(--canop-palette-([a-z]+-[a-z]+)\)$/);
  if (reference) return { hex: couleurDePalette(reference[1], mode), alpha: 1 };
  const melange = valeur.match(/^color-mix\(in srgb, (var\([^)]+\)) ([\d.]+)%, (.+)\)$/);
  if (!melange) throw new Error(`couleur non resolue : ${valeur}`);
  const premiere = resoudreCouleur(melange[1], mode);
  const part = Number(melange[2]) / 100;
  if (melange[3] === "transparent") return { hex: premiere.hex, alpha: part };
  return { hex: mixSrgb(premiere.hex, part, resoudreCouleur(melange[3], mode).hex), alpha: 1 };
}

export function composerSur(couleur: CouleurResolue, fond: string): string {
  return mixSrgb(couleur.hex, couleur.alpha, fond);
}
