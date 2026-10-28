import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { animate, type AnimationOptions } from "framer-motion";
import { CanopThemeProvider } from "../../../theme";
import { motionDurationSeconds, motionEasing } from "../../../motion";
import { Navbar, type CanopNavbarItem } from "../../Navbar";
import { SegmentedControl, type CanopSegmentedControlOption } from "../../SegmentedControl";
import {
  VIEWPORTS,
  moinsDeMouvement,
  pastilleActive,
  rendreTonal,
  simulerViewport,
} from "../../../test/navbarToneKit";

const RESSORT_NAVBAR: AnimationOptions = { type: "spring", stiffness: 520, damping: 42, mass: 0.9 };
const GLISSEMENT_SEGMENTED: AnimationOptions = {
  duration: motionDurationSeconds.base,
  ease: motionEasing.organic,
};
const IMAGES_OBSERVEES = 40;

const liens: CanopNavbarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "apps" },
  { label: "Utilisateurs", href: "/users", icon: "user" },
  { label: "Reglages", href: "/settings", icon: "apps" },
];

const ORDONNEE_DES_LIENS: Record<string, number> = {
  "/dashboard": 0,
  "/users": 200,
  "/settings": 400,
};

const segments: CanopSegmentedControlOption[] = [
  { value: "grid", label: "Grille" },
  { value: "list", label: "Liste" },
];

const BOITES_DES_SEGMENTS: Record<string, { left: number; width: number }> = {
  Grille: { left: 0, width: 80 },
  Liste: { left: 100, width: 160 },
};

interface Transformee {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
}

function lireTranslation(transform: string, axe: "X" | "Y"): number {
  const simple = transform.match(new RegExp(`translate${axe}\\((-?[\\d.e-]+)px\\)`));
  if (simple) return Number(simple[1]);
  const triple = transform.match(/translate3d\((-?[\d.e-]+)px,\s*(-?[\d.e-]+)px/);
  if (!triple) return 0;
  return Number(axe === "X" ? triple[1] : triple[2]);
}

function lireEchelle(transform: string, axe: "X" | "Y"): number {
  const simple = transform.match(new RegExp(`scale${axe}\\((-?[\\d.e-]+)\\)`));
  if (simple) return Number(simple[1]);
  const uniforme = transform.match(/scale\((-?[\d.e-]+)\)/);
  return uniforme ? Number(uniforme[1]) : 1;
}

function lireTransformee(transform: string): Transformee {
  return {
    x: lireTranslation(transform, "X"),
    y: lireTranslation(transform, "Y"),
    scaleX: lireEchelle(transform, "X"),
    scaleY: lireEchelle(transform, "Y"),
  };
}

function transformDuSousArbre(racine: Element): string {
  const elements = [racine, ...Array.from(racine.querySelectorAll<HTMLElement>("*"))];
  return elements
    .map((element) => (element as HTMLElement).style?.transform ?? "")
    .filter((transform) => transform !== "" && transform !== "none")
    .join(" ");
}

function decalageVisible(element: Element): number {
  const pastille = element.closest("a > span[aria-hidden='true']");
  return pastille ? lireTranslation(transformDuSousArbre(pastille), "Y") : 0;
}

function boite(left: number, top: number, width: number, height: number): DOMRect {
  return {
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON: () => ({}),
  } as DOMRect;
}

function positionnerLesLiens() {
  return vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
    this: Element,
  ) {
    const href = this.closest("a")?.getAttribute("href") ?? "";
    const top = (ORDONNEE_DES_LIENS[href] ?? 0) + decalageVisible(this);
    return boite(0, top, 100, 40);
  });
}

function positionnerLesSegments() {
  return vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
    this: Element,
  ) {
    const radio = this.closest("[role='radio']");
    const nom = radio?.textContent ?? "";
    const segment = BOITES_DES_SEGMENTS[nom] ?? { left: 0, width: 80 };
    return boite(segment.left, 0, segment.width, 32);
  });
}

function attendreUneImage() {
  return act(() => new Promise((fin) => setTimeout(fin, 16)));
}

async function relever<T>(lire: () => T, images = IMAGES_OBSERVEES): Promise<T[]> {
  const releves: T[] = [];
  for (let image = 0; image < images; image += 1) {
    releves.push(lire());
    await attendreUneImage();
  }
  return releves;
}

function animationDeReference(depart: number, transition: AnimationOptions): () => number {
  const temoin = document.createElement("div");
  document.body.appendChild(temoin);
  animate(temoin, { y: [depart, 0] }, transition);
  return () => lireTranslation(temoin.style.transform, "Y");
}

function barre(activeHref: string) {
  return (
    <Navbar items={liens} activeHref={activeHref} userName="Jeanne" onLogout={vi.fn()}>
      Contenu
    </Navbar>
  );
}

function lien(href: string): Element {
  const element = document.querySelector(`a[href='${href}'][aria-current='page']`);
  if (!element) throw new Error(`lien actif ${href} introuvable`);
  return element;
}

function pastilleDuLien(href: string): HTMLElement {
  const pastille = pastilleActive(lien(href));
  if (!pastille) throw new Error(`pastille du lien ${href} introuvable`);
  return pastille;
}

function segmented(value: string) {
  return (
    <CanopThemeProvider>
      <SegmentedControl
        options={segments}
        value={value}
        onChange={() => undefined}
        ariaLabel="Affichage"
      />
    </CanopThemeProvider>
  );
}

function pastilleDuSegment(nom: string): HTMLElement {
  const radio = screen.getByRole("radio", { name: nom });
  const pastille = radio.querySelector<HTMLElement>("span[aria-hidden]");
  if (!pastille) throw new Error(`pastille du segment ${nom} introuvable`);
  return pastille.parentElement as HTMLElement;
}

function elementsMesures(espion: ReturnType<typeof positionnerLesLiens>): Element[] {
  return espion.mock.contexts as Element[];
}

function sourcesDuComposant(dossier: string): string[] {
  return readdirSync(dossier)
    .filter((fichier) => /\.tsx?$/.test(fichier))
    .map((fichier) => readFileSync(join(dossier, fichier), "utf8"));
}

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

describe("AC3 — pastille sans projection de layout", () => {
  it.each(["src/components/Navbar", "src/components/SegmentedControl"])(
    "n'utilise ni layoutId ni LayoutGroup dans %s",
    (dossier) => {
      sourcesDuComposant(dossier).forEach((source) => {
        expect(source).not.toMatch(/\blayoutId\b/);
        expect(source).not.toMatch(/\bLayoutGroup\b/);
      });
    },
  );
});

describe("AC3 — Navbar : premier rendu", () => {
  it.each(["etendu", "rail"] as const)(
    "ne mesure ni n'anime la pastille au premier rendu en format %s",
    async (format) => {
      simulerViewport(VIEWPORTS[format]);
      const espion = positionnerLesLiens();

      rendreTonal(barre("/users"));
      const releves = await relever(() => transformDuSousArbre(pastilleDuLien("/users")), 10);

      const nav = document.querySelector("nav") as Element;
      expect(elementsMesures(espion).filter((element) => nav.contains(element))).toEqual([]);
      expect(releves.every((transform) => transform === "")).toBe(true);
    },
  );
});

describe("AC3 — Navbar : glissement depuis l'ancien item", () => {
  it.each(["etendu", "rail"] as const)(
    "fait glisser la pastille de l'ancien lien vers zero en format %s",
    async (format) => {
      simulerViewport(VIEWPORTS[format]);
      positionnerLesLiens();
      const vue = rendreTonal(barre("/dashboard"));
      await attendreUneImage();

      vue.rerender(barre("/users"));
      const releves = (await relever(() => transformDuSousArbre(pastilleDuLien("/users")))).map(
        lireTransformee,
      );

      const enGlissement = releves.filter((transformee) => transformee.y !== 0);
      expect(enGlissement.length).toBeGreaterThan(0);
      expect(enGlissement[0].y).toBeLessThan(-150);
      expect(enGlissement[0].y).toBeGreaterThanOrEqual(-200);
      expect(Math.abs(releves[releves.length - 1].y)).toBeLessThan(1);
    },
  );

  it("suit le ressort de reference stiffness 520, damping 42, mass 0.9", async () => {
    simulerViewport(VIEWPORTS.etendu);
    positionnerLesLiens();
    const vue = rendreTonal(barre("/dashboard"));
    await attendreUneImage();

    vue.rerender(barre("/users"));
    const reference = animationDeReference(-200, RESSORT_NAVBAR);
    const ecarts: number[] = [];
    for (let image = 0; image < IMAGES_OBSERVEES; image += 1) {
      await attendreUneImage();
      const reel = lireTranslation(transformDuSousArbre(pastilleDuLien("/users")), "Y");
      ecarts.push(Math.abs(reel - reference()));
    }

    expect(Math.max(...ecarts)).toBeLessThan(2);
  });

  it("repart de la position visible lors d'un clic en plein glissement", async () => {
    simulerViewport(VIEWPORTS.etendu);
    positionnerLesLiens();
    const vue = rendreTonal(barre("/dashboard"));
    await attendreUneImage();
    vue.rerender(barre("/users"));
    await attendreUneImage();
    await attendreUneImage();
    const visibleAvantDeuxiemeClic =
      ORDONNEE_DES_LIENS["/users"] +
      lireTranslation(transformDuSousArbre(pastilleDuLien("/users")), "Y");

    vue.rerender(barre("/settings"));
    const releves = await relever(() =>
      lireTranslation(transformDuSousArbre(pastilleDuLien("/settings")), "Y"),
    );

    const depart = releves.find((decalage) => decalage !== 0) as number;
    const depuisLaPositionVisible = visibleAvantDeuxiemeClic - ORDONNEE_DES_LIENS["/settings"];
    const depuisLAncienItem = ORDONNEE_DES_LIENS["/users"] - ORDONNEE_DES_LIENS["/settings"];
    expect(visibleAvantDeuxiemeClic).toBeLessThan(ORDONNEE_DES_LIENS["/users"]);
    expect(depart).toBeLessThan(depuisLAncienItem - 20);
    expect(depart).toBeGreaterThanOrEqual(depuisLaPositionVisible - 1);
  });
});

describe("AC3 — Navbar : mouvement reduit", () => {
  it.each(["etendu", "rail"] as const)(
    "fait sauter la pastille directement sous mouvement reduit en format %s",
    async (format) => {
      simulerViewport((requete) => VIEWPORTS[format](requete) || moinsDeMouvement(requete));
      positionnerLesLiens();
      const vue = rendreTonal(barre("/dashboard"));
      await attendreUneImage();

      vue.rerender(barre("/users"));
      const releves = await relever(() => transformDuSousArbre(pastilleDuLien("/users")));

      expect(releves.every((transform) => transform === "")).toBe(true);
      expect(pastilleActive(lien("/users"))).not.toBeNull();
    },
  );
});

describe("AC3 — SegmentedControl", () => {
  it("ne mesure ni n'anime la pastille au premier rendu", async () => {
    simulerViewport(() => false);
    const espion = positionnerLesSegments();

    render(segmented("list"));
    const releves = await relever(() => transformDuSousArbre(pastilleDuSegment("Liste")), 10);

    const groupe = screen.getByRole("radiogroup");
    expect(elementsMesures(espion).filter((element) => groupe.contains(element))).toEqual([]);
    expect(releves.every((transform) => transform === "")).toBe(true);
  });

  it("fait glisser la pastille depuis l'ancien segment avec x et scaleX vers le repos", async () => {
    simulerViewport(() => false);
    positionnerLesSegments();
    const vue = render(segmented("grid"));
    await attendreUneImage();

    vue.rerender(segmented("list"));
    const releves = (await relever(() => transformDuSousArbre(pastilleDuSegment("Liste")))).map(
      lireTransformee,
    );

    const enGlissement = releves.filter((transformee) => transformee.x !== 0);
    expect(enGlissement.length).toBeGreaterThan(0);
    expect(enGlissement[0].x).toBeLessThan(0);
    expect(enGlissement[0].scaleX).toBeLessThan(1);
    const repos = releves[releves.length - 1];
    expect(Math.abs(repos.x)).toBeLessThan(0.5);
    expect(Math.abs(repos.scaleX - 1)).toBeLessThan(0.01);
    expect(Math.abs(repos.scaleY - 1)).toBeLessThan(0.01);
  });

  it("garde la duree et la courbe de reference du glissement", async () => {
    simulerViewport(() => false);
    positionnerLesSegments();
    const vue = render(segmented("grid"));
    await attendreUneImage();

    vue.rerender(segmented("list"));
    const reference = animationDeReference(1, GLISSEMENT_SEGMENTED);
    const progressions: { reel: number; attendu: number }[] = [];
    for (let image = 0; image < IMAGES_OBSERVEES; image += 1) {
      await attendreUneImage();
      progressions.push({
        reel: lireTranslation(transformDuSousArbre(pastilleDuSegment("Liste")), "X"),
        attendu: reference(),
      });
    }

    const enVol = progressions.filter(({ attendu }) => attendu > 0.001);
    expect(enVol.length).toBeGreaterThan(0);
    const departs = enVol.map(({ reel, attendu }) => reel / attendu);
    departs.forEach((depart) => {
      expect(depart).toBeLessThan(0);
      expect(Math.abs(depart - departs[0])).toBeLessThan(Math.abs(departs[0]) * 0.02);
    });
    progressions
      .filter(({ attendu }) => attendu <= 0.001)
      .forEach(({ reel }) => expect(Math.abs(reel)).toBeLessThan(0.5));
  });

  it("fait sauter la pastille directement sous mouvement reduit", async () => {
    simulerViewport(moinsDeMouvement);
    positionnerLesSegments();
    const vue = render(segmented("grid"));
    await attendreUneImage();

    vue.rerender(segmented("list"));
    const releves = await relever(() => transformDuSousArbre(pastilleDuSegment("Liste")));

    expect(releves.every((transform) => transform === "")).toBe(true);
  });
});
