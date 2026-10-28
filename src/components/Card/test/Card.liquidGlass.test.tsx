import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Button,
  Card,
  CanopI18nProvider,
  CanopThemeProvider,
  PageContent,
  Spinner,
  type CanopCardProps,
} from "../../../index";
import { racineDeCarte } from "../../../test/cardTestKit";
import { reglesEmises, valeursEmises } from "../../../test/cssRules";
import {
  installerResizeObserver,
  revenirAJsdom,
  simulerChromium,
} from "../../../test/liquidGlassTestKit";

type StyleEnLigne = Record<"backdropFilter" | "WebkitBackdropFilter", string | undefined>;

const FLOU_LIQUIDE = "blur(0.25rem) saturate(1.8)";
const CONTOUR_SQUIRCLE = "var(--canop-squircle-clip)";
const VARIANTES_NON_GIVREES = ["surface", "interactive", "floating", "stat"] as const;
const ENFANTS_DE_CARTE = /^(MuiCardHeader-root|MuiCardContent-root|MuiCardActions-root)$/;

afterEach(revenirAJsdom);

function monter(ui: ReactNode) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function poserCarte(props: Partial<CanopCardProps> = {}) {
  const { container } = monter(
    <Card variant="frosted" title="Bonjour" {...props}>
      Trois revues vous attendent.
    </Card>,
  );
  return racineDeCarte(container);
}

function poserCarteRefractee(props: Partial<CanopCardProps> = {}) {
  const { frames } = simulerChromium();
  const racine = poserCarte(props);
  frames.avancer();
  return racine;
}

const filtresDe = (racine: Element) => Array.from(racine.querySelectorAll("filter"));

const flouDeLHote = (racine: Element) => valeursEmises(racine, "backdrop-filter").at(-1) ?? "";

const flouEnLigne = (racine: HTMLElement) =>
  (racine.style as unknown as StyleEnLigne).backdropFilter ?? "";

const calquesDecoratifs = (racine: Element) =>
  Array.from(racine.children).filter(
    (enfant) => !Array.from(enfant.classList).some((classe) => ENFANTS_DE_CARTE.test(classe)),
  );

function clipsDePseudo(element: Element, pseudo: "::before" | "::after"): string[] {
  return reglesEmises(element)
    .filter((regle) => regle.conditions.length === 0 && regle.selecteur.endsWith(pseudo))
    .map((regle) => regle.style.getPropertyValue("clip-path"))
    .filter((valeur) => valeur.startsWith("polygon("));
}

const sansEpaisseur = (chemin: string) => chemin.replace(/\d*\.?\d+rem/g, "EPAISSEUR");

function proprieteSurElementEtPseudos(element: Element, propriete: string): string[] {
  return reglesEmises(element)
    .filter((regle) => regle.conditions.length === 0)
    .map((regle) => regle.style.getPropertyValue(propriete))
    .filter((valeur) => valeur !== "");
}

describe("AC2 - refraction sous un navigateur qui la supporte", () => {
  it("rend un filtre SVG feDisplacementMap dans la carte a la frame suivante", () => {
    const racine = poserCarteRefractee();
    const [filtre] = filtresDe(racine);
    expect(filtre).toBeDefined();
    expect(filtre.querySelector("feDisplacementMap")).not.toBeNull();
    expect(racine.contains(filtre)).toBe(true);
  });

  it("pose url(#id) devant le flou dans le backdrop-filter en ligne", () => {
    const racine = poserCarteRefractee();
    const [filtre] = filtresDe(racine);
    expect(flouEnLigne(racine)).toBe(`url(#${filtre.id}) ${FLOU_LIQUIDE}`);
    expect(flouDeLHote(racine)).toBe(FLOU_LIQUIDE);
  });

  it("donne un id unique a chaque carte et chacune pointe sur son propre filtre", () => {
    const { frames } = simulerChromium();
    const { container } = monter(
      <>
        <Card variant="frosted">Premiere</Card>
        <Card variant="frosted">Deuxieme</Card>
        <Card variant="frosted">Troisieme</Card>
      </>,
    );
    frames.avancer();
    const cartes = Array.from(container.querySelectorAll<HTMLElement>(".MuiCard-root"));
    const ids = cartes.map((carte) => filtresDe(carte).map((filtre) => filtre.id));
    ids.forEach((idsDeLaCarte) => expect(idsDeLaCarte).toHaveLength(1));
    expect(new Set(ids.flat()).size).toBe(cartes.length);
    cartes.forEach((carte, index) => {
      expect(flouEnLigne(carte)).toBe(`url(#${ids[index][0]}) ${FLOU_LIQUIDE}`);
    });
  });

  it("ne refracte pas en jsdom par defaut : ni url() ni SVG", () => {
    const racine = poserCarte();
    expect(flouDeLHote(racine)).toBe(FLOU_LIQUIDE);
    expect(flouEnLigne(racine)).toBe("");
    expect(racine.querySelector("svg")).toBeNull();
  });

  it("ne refracte pas sous un navigateur non Chromium", () => {
    const { frames } = simulerChromium();
    Object.defineProperty(navigator, "userAgentData", { configurable: true, value: undefined });
    const racine = poserCarte();
    frames.avancer();
    expect(flouDeLHote(racine)).toBe(FLOU_LIQUIDE);
    expect(flouEnLigne(racine)).toBe("");
    expect(filtresDe(racine)).toHaveLength(0);
  });

  it("ne plante pas sans ResizeObserver", () => {
    simulerChromium();
    vi.stubGlobal("ResizeObserver", undefined);
    const racine = poserCarte();
    expect(screen.getByText("Trois revues vous attendent.")).toBeInTheDocument();
    expect(flouEnLigne(racine)).not.toMatch(/url\(#\)/);
  });
});

describe("AC3 - liseré et ombre interne suivent le squircle", () => {
  it("decoupe le calque decoratif au contour squircle de la carte", () => {
    const [calque] = calquesDecoratifs(poserCarte());
    expect(valeursEmises(calque, "clip-path")).toContain(CONTOUR_SQUIRCLE);
  });

  it("trace le liseré avec le meme chemin que l'anneau flash", () => {
    const racine = poserCarte({ flash: "success" });
    const [anneau] = clipsDePseudo(racine, "::after");
    const [calque] = calquesDecoratifs(racine);
    const liseres = [...clipsDePseudo(calque, "::before"), ...clipsDePseudo(calque, "::after")];
    expect(anneau).toBeDefined();
    expect(liseres.length).toBeGreaterThan(0);
    liseres.forEach((lisere) => expect(sansEpaisseur(lisere)).toBe(sansEpaisseur(anneau)));
  });

  it.each(["2xl", "md"] as const)("trace le liseré sur le rayon explicite radius=%s", (rayon) => {
    const [calque] = calquesDecoratifs(poserCarte({ radius: rayon }));
    const liseres = [...clipsDePseudo(calque, "::before"), ...clipsDePseudo(calque, "::after")];
    liseres.forEach((lisere) => {
      expect(lisere).toContain(`var(--canop-radius-${rayon})`);
      expect(lisere).not.toContain("var(--canop-radius-xl)");
    });
  });

  it("decoupe l'ombre interne au squircle sans arrondi circulaire", () => {
    const [calque] = calquesDecoratifs(poserCarte());
    const ombres = Array.from(calque.querySelectorAll("div"));
    expect(ombres.length).toBeGreaterThan(0);
    ombres.forEach((ombre) => {
      expect(clipsDePseudo(ombre, "::before").join(" ")).toMatch(/polygon\(/);
      expect(proprieteSurElementEtPseudos(ombre, "border-radius")).toEqual([]);
    });
  });
});

describe("AC4 - avec elevation, jamais de refraction", () => {
  it.each(["sm", "md", "lg"] as const)(
    "ne pose ni url() ni SVG sous Chromium avec elevation=%s",
    (elevation) => {
      const racine = poserCarteRefractee({ elevation });
      expect(flouDeLHote(racine)).toBe(FLOU_LIQUIDE);
      expect(flouEnLigne(racine)).toBe("");
      expect(filtresDe(racine)).toHaveLength(0);
    },
  );

  it("garde le liseré et l'ombre interne avec une elevation", () => {
    const racine = poserCarte({ elevation: "md" });
    const [calque] = calquesDecoratifs(racine);
    expect(calque).toBeDefined();
    expect(clipsDePseudo(calque, "::after").length).toBeGreaterThan(0);
    expect(calque.querySelectorAll("div").length).toBeGreaterThan(0);
  });
});

describe("AC5 - les calques decoratifs n'interceptent rien", () => {
  it("masque tous les calques decoratifs aux technologies d'assistance", () => {
    const calques = calquesDecoratifs(poserCarteRefractee());
    expect(calques.length).toBeGreaterThan(0);
    calques.forEach((calque) => {
      expect(calque).toHaveAttribute("aria-hidden", "true");
      calque.querySelectorAll("svg").forEach((svg) => {
        expect(svg.closest('[aria-hidden="true"]')).not.toBeNull();
      });
    });
  });

  it("laisse passer le pointeur sur chaque calque et ses pseudo-elements", () => {
    const calques = calquesDecoratifs(poserCarteRefractee());
    calques.forEach((calque) => {
      [calque, ...Array.from(calque.querySelectorAll("div"))].forEach((element) => {
        expect(getComputedStyle(element).pointerEvents).toBe("none");
      });
    });
  });

  it("laisse passer le pointeur sur le pseudo-element de teinte de l'hote", () => {
    const racine = poserCarte();
    const pointeurs = reglesEmises(racine)
      .filter((regle) => /::(before|after)$/.test(regle.selecteur))
      .map((regle) => regle.style.getPropertyValue("pointer-events"))
      .filter((valeur) => valeur !== "");
    expect(pointeurs.length).toBeGreaterThan(0);
    pointeurs.forEach((valeur) => expect(valeur).toBe("none"));
  });

  it("declenche le clic en cliquant sur la carte frosted elle-meme", async () => {
    simulerChromium();
    const user = userEvent.setup();
    const onClick = vi.fn();
    const racine = poserCarte({ onClick });
    await user.click(racine);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("declenche le clic en cliquant sur le contenu de la carte", async () => {
    simulerChromium();
    const user = userEvent.setup();
    const onClick = vi.fn();
    poserCarte({ onClick });
    await user.click(screen.getByText("Trois revues vous attendent."));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it.each([
    ["Entree", "{Enter}"],
    ["Espace", " "],
  ])(
    "laisse le clavier atteindre l'action avec %s sans declencher la carte",
    async (_nom, saisie) => {
      simulerChromium();
      const user = userEvent.setup();
      const onCarte = vi.fn();
      const onAction = vi.fn();
      poserCarte({ onClick: onCarte, actions: <Button onClick={onAction}>Valider</Button> });
      await user.tab();
      expect(screen.getByRole("button", { name: "Valider" })).toHaveFocus();
      await user.keyboard(saisie);
      expect(onAction).toHaveBeenCalledOnce();
      expect(onCarte).not.toHaveBeenCalled();
    },
  );

  it("relaie le clic des actions sans declencher la carte", async () => {
    simulerChromium();
    const user = userEvent.setup();
    const onCarte = vi.fn();
    const onAction = vi.fn();
    poserCarte({ onClick: onCarte, actions: <Button onClick={onAction}>Valider</Button> });
    await user.click(screen.getByRole("button", { name: "Valider" }));
    expect(onAction).toHaveBeenCalledOnce();
    expect(onCarte).not.toHaveBeenCalled();
  });

  it.each([
    ["success", "var(--canop-palette-success-main)"],
    ["error", "var(--canop-palette-error-main)"],
  ] as const)("colore l'anneau flash %s sur une carte frosted", (flash, couleur) => {
    const racine = poserCarte({ flash });
    const anneau = reglesEmises(racine)
      .filter((regle) => regle.selecteur.endsWith("::after"))
      .map((regle) => regle.style.getPropertyValue("background-color"))
      .filter((valeur) => valeur !== "");
    expect(anneau).toContain(couleur);
  });

  it("transforme toujours le Spinner d'une carte frosted en squelette de carte", () => {
    simulerChromium();
    monter(
      <PageContent>
        <Card variant="frosted">
          <Spinner ariaLabel="Chargement des revues" />
        </Card>
      </PageContent>,
    );
    expect(screen.getByRole("progressbar", { name: "Chargement des revues" })).toHaveAttribute(
      "data-skeleton",
      "card",
    );
  });

  it("affiche le titre et le contenu de la carte frosted", () => {
    simulerChromium();
    poserCarte({ subtitle: "Aujourd'hui" });
    expect(screen.getByText("Bonjour")).toBeVisible();
    expect(screen.getByText("Aujourd'hui")).toBeVisible();
    expect(screen.getByText("Trois revues vous attendent.")).toBeVisible();
  });
});

describe("AC6 - les cartes non frosted ne rendent rien de plus", () => {
  it.each(VARIANTES_NON_GIVREES)("ne rend aucun calque ni SVG pour la variante %s", (variant) => {
    const racine = poserCarteRefractee({ variant, actions: <Button>Valider</Button> });
    expect(calquesDecoratifs(racine)).toEqual([]);
    expect(racine.querySelector("filter")).toBeNull();
    expect(racine.querySelector('[aria-hidden="true"]:not(.CanopCard-arrow)')).toBeNull();
  });

  it.each(VARIANTES_NON_GIVREES)("ne cree aucun ResizeObserver pour la variante %s", (variant) => {
    const espion = simulerChromium();
    poserCarte({ variant, onClick: variant === "interactive" ? () => {} : undefined });
    expect(espion.instances).toBe(0);
  });

  it("ne cree aucun ResizeObserver pour une carte par defaut hors Chromium", () => {
    const espion = installerResizeObserver();
    monter(<Card>Contenu</Card>);
    expect(espion.instances).toBe(0);
  });
});
