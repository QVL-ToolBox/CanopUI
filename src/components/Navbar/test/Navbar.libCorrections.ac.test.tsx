import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider, type CanopLocale } from "../../../i18n";
import { Navbar, type CanopNavbarItem } from "../Navbar";
import { reglesDe, valeurFixe } from "../../../test/cssRules";
import { pastilleActive } from "../../../test/navbarToneKit";

type Viewport = "desktop" | "tablet" | "mobile";

const TAILLE_RACINE = 16;
const MARGES_DE_LA_BARRE_FLOTTANTE = 2 * TAILLE_RACINE;

const restaurations: (() => void)[] = [];

afterEach(() => {
  restaurations.splice(0).forEach((restaurer) => restaurer());
  vi.restoreAllMocks();
});

function simulerViewport(viewport: Viewport, sansSurvol = false) {
  const correspond = (query: string) => {
    if (query.includes("hover: none")) return sansSurvol;
    if (query.includes("prefers-reduced-motion")) return false;
    if (viewport === "mobile") return true;
    if (viewport === "tablet") return query.includes("min-width");
    return false;
  };
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

function enPixels(valeur: string): string {
  return valeur.replace(/(-?[\d.]+)rem/g, (_, rem: string) => `${Number(rem) * TAILLE_RACINE}px`);
}

function ecartDeclare(element: Element): string | undefined {
  const ecart = reglesDe(element, "gap").at(-1)?.valeur;
  return ecart ? enPixels(ecart.split(" ").at(-1) ?? ecart) : undefined;
}

function simulerStylesCalcules() {
  const original = window.getComputedStyle.bind(window);
  vi.spyOn(window, "getComputedStyle").mockImplementation((element, pseudo) => {
    const style = original(element, pseudo);
    const estRacine = element === document.documentElement;
    return new Proxy(style, {
      get(cible, nom) {
        if (nom === "fontSize" && estRacine) return `${TAILLE_RACINE}px`;
        if (nom === "columnGap" && cible.columnGap === "normal")
          return ecartDeclare(element) ?? "normal";
        if (nom === "getPropertyValue")
          return (propriete: string) =>
            propriete === "font-size" && estRacine
              ? `${TAILLE_RACINE}px`
              : enPixels(cible.getPropertyValue(propriete));
        const valeur = Reflect.get(cible, nom, cible) as unknown;
        if (typeof valeur === "function") return valeur.bind(cible);
        return typeof valeur === "string" ? enPixels(valeur) : valeur;
      },
    });
  });
}

function simulerLargeurDeBarre(pixels: number) {
  const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth");
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get: () => pixels,
  });
  restaurations.push(() => {
    if (original) Object.defineProperty(HTMLElement.prototype, "clientWidth", original);
  });
}

function simulerEcranMobile(largeurEcran: number, sansSurvol = false) {
  simulerViewport("mobile", sansSurvol);
  simulerLargeurDeBarre(largeurEcran - MARGES_DE_LA_BARRE_FLOTTANTE);
  simulerStylesCalcules();
}

function poser(ui: ReactElement, locale: CanopLocale = "fr") {
  return render(
    <CanopI18nProvider locale={locale}>
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function emulerFocusVisibleAuClavier() {
  const matches = Element.prototype.matches;
  vi.spyOn(Element.prototype, "matches").mockImplementation(function (
    this: Element,
    selecteur: string,
  ) {
    if (selecteur === ":focus-visible") return this === document.activeElement;
    return matches.call(this, selecteur);
  });
}

async function tabulerJusqua(user: UserEvent, cible: HTMLElement) {
  for (let pas = 0; pas < 20 && document.activeElement !== cible; pas += 1) await user.tab();
}

async function ouvrirPanneau(user: UserEvent, declencheur: HTMLElement): Promise<HTMLElement> {
  await user.click(declencheur);
  const panneau = document.getElementById(declencheur.getAttribute("aria-controls") ?? "");
  expect(panneau).not.toBeNull();
  await within(panneau as HTMLElement).findAllByRole("link");
  return panneau as HTMLElement;
}

function placementDe(legende: HTMLElement): string {
  return (
    legende.closest("[data-popper-placement]")?.getAttribute("data-popper-placement") ??
    legende.getAttribute("data-popper-placement") ??
    ""
  );
}

function barreMobile(): HTMLElement {
  return screen.getAllByRole("navigation").at(-1) as HTMLElement;
}

function tuilesDeLaBarre(): string[] {
  return Array.from(barreMobile().children)
    .map((tuile) => tuile.getAttribute("aria-label") ?? "")
    .filter((libelle) => libelle !== "");
}

function intertitreDe(groupe: HTMLElement): HTMLElement | null {
  return document.getElementById(groupe.getAttribute("aria-labelledby") ?? "");
}

function groupesNommes(racine: HTMLElement): HTMLElement[] {
  return within(racine)
    .queryAllByRole("group")
    .filter((groupe) => groupe.hasAttribute("aria-labelledby"));
}

const libelles = ["Un", "Deux", "Trois", "Quatre", "Cinq", "Six", "Sept"];

function items(nombre: number): CanopNavbarItem[] {
  return libelles
    .slice(0, nombre)
    .map((label) => ({ label, href: `/${label.toLowerCase()}`, icon: "apps" }));
}

const itemsGroupes: CanopNavbarItem[] = [
  { label: "Accueil", href: "/home", icon: "apps" },
  {
    label: "Catalogue",
    href: "/catalog",
    icon: "layout",
    groups: [
      {
        label: "Saisie",
        items: [
          { label: "Button", href: "/catalog/button" },
          { label: "Input", href: "/catalog/input" },
        ],
      },
      { label: "Affichage", items: [{ label: "Card", href: "/catalog/card" }] },
    ],
  },
];

function attendreGroupesSaisieEtAffichage(racine: HTMLElement) {
  const groupes = groupesNommes(racine);
  expect(groupes.map((groupe) => intertitreDe(groupe)?.textContent)).toEqual([
    "Saisie",
    "Affichage",
  ]);
  expect(within(groupes[0]).getByRole("link", { name: "Button" })).toBeInTheDocument();
  expect(within(groupes[0]).getByRole("link", { name: "Input" })).toBeInTheDocument();
  expect(within(groupes[1]).getByRole("link", { name: "Card" })).toBeInTheDocument();
}

function attendreIntertitresNonFocusables(racine: HTMLElement) {
  for (const groupe of groupesNommes(racine)) {
    const intertitre = intertitreDe(groupe);
    expect(intertitre).not.toBeNull();
    expect(intertitre).not.toHaveAttribute("tabindex");
    expect(intertitre?.matches("a, button, input, select, textarea")).toBe(false);
  }
}

describe("AC13 intertitres de navigation", () => {
  it("range les sous-items sous des intertitres dans la barre latérale", () => {
    simulerViewport("desktop");
    poser(
      <Navbar items={itemsGroupes} activeHref="/catalog/card">
        Contenu
      </Navbar>,
    );
    attendreGroupesSaisieEtAffichage(screen.getByRole("navigation"));
    attendreIntertitresNonFocusables(screen.getByRole("navigation"));
  });

  it("range les sous-items sous des intertitres dans le popover du rail", async () => {
    const user = userEvent.setup();
    simulerViewport("tablet");
    poser(<Navbar items={itemsGroupes}>Contenu</Navbar>);
    const panneau = await ouvrirPanneau(user, screen.getByRole("button", { name: "Catalogue" }));
    attendreGroupesSaisieEtAffichage(panneau);
    attendreIntertitresNonFocusables(panneau);
  });

  it("range les sous-items sous des intertitres dans le popover mobile", async () => {
    const user = userEvent.setup();
    simulerEcranMobile(400);
    poser(<Navbar items={itemsGroupes}>Contenu</Navbar>);
    const panneau = await ouvrirPanneau(
      user,
      within(barreMobile()).getByRole("button", { name: "Catalogue" }),
    );
    attendreGroupesSaisieEtAffichage(panneau);
    attendreIntertitresNonFocusables(panneau);
  });

  it("range les sous-items sous des intertitres dans le panneau Plus", async () => {
    const user = userEvent.setup();
    simulerEcranMobile(280);
    poser(<Navbar items={[...items(5), ...itemsGroupes]}>Contenu</Navbar>);
    const panneau = await ouvrirPanneau(
      user,
      within(barreMobile()).getByRole("button", { name: "Plus" }),
    );
    attendreGroupesSaisieEtAffichage(panneau);
    attendreIntertitresNonFocusables(panneau);
  });

  it("ne laisse jamais la tabulation s'arrêter sur un intertitre", async () => {
    const user = userEvent.setup();
    simulerViewport("desktop");
    poser(
      <Navbar items={itemsGroupes} activeHref="/catalog/card">
        Contenu
      </Navbar>,
    );
    const intertitres = groupesNommes(screen.getByRole("navigation")).map(intertitreDe);
    const visites: (Element | null)[] = [];
    for (let pas = 0; pas < 12; pas += 1) {
      await user.tab();
      visites.push(document.activeElement);
    }
    expect(visites.filter((visite) => intertitres.includes(visite as HTMLElement))).toEqual([]);
  });

  it("garde les children sans intertitre", async () => {
    const user = userEvent.setup();
    simulerViewport("tablet");
    poser(
      <Navbar
        items={[
          {
            label: "Studio",
            href: "/studio",
            icon: "apps",
            children: [{ label: "CanopUI", href: "/studio/canopui" }],
          },
        ]}
      >
        Contenu
      </Navbar>,
    );
    const panneau = await ouvrirPanneau(user, screen.getByRole("button", { name: "Studio" }));
    expect(within(panneau).getByRole("link", { name: "CanopUI" })).toBeInTheDocument();
    expect(groupesNommes(panneau)).toEqual([]);
  });
});

describe("AC14 barre mobile adaptative", () => {
  it("affiche 3 tuiles et Plus sur un écran de 280 px", () => {
    simulerEcranMobile(280);
    poser(<Navbar items={items(7)}>Contenu</Navbar>);
    expect(tuilesDeLaBarre()).toEqual(["Un", "Deux", "Trois", "Plus"]);
  });

  it("n'affiche jamais plus de 5 tuiles sur un écran large", () => {
    simulerEcranMobile(1200);
    poser(<Navbar items={items(7)}>Contenu</Navbar>);
    expect(tuilesDeLaBarre()).toEqual(["Un", "Deux", "Trois", "Quatre", "Plus"]);
  });

  it("affiche les 5 items sans Plus quand ils tiennent", () => {
    simulerEcranMobile(1200);
    poser(<Navbar items={items(5)}>Contenu</Navbar>);
    expect(tuilesDeLaBarre()).toEqual(["Un", "Deux", "Trois", "Quatre", "Cinq"]);
  });

  it("garde au moins une tuile sur un écran minuscule", () => {
    simulerEcranMobile(80);
    poser(<Navbar items={items(7)}>Contenu</Navbar>);
    expect(tuilesDeLaBarre().length).toBeGreaterThanOrEqual(1);
  });

  it("range les items en trop sous Plus", async () => {
    const user = userEvent.setup();
    simulerEcranMobile(280);
    poser(<Navbar items={items(7)}>Contenu</Navbar>);
    const panneau = await ouvrirPanneau(
      user,
      within(barreMobile()).getByRole("button", { name: "Plus" }),
    );
    expect(
      within(panneau)
        .getAllByRole("link")
        .map((lien) => lien.textContent),
    ).toEqual(["Quatre", "Cinq", "Six", "Sept"]);
  });

  it("traduit Plus en More", () => {
    simulerEcranMobile(280);
    poser(<Navbar items={items(7)}>Contenu</Navbar>, "en");
    expect(within(barreMobile()).getByRole("button", { name: "More" })).toBeInTheDocument();
  });

  it("pose la pastille sur Plus quand l'item actif y est rangé", () => {
    simulerEcranMobile(280);
    poser(
      <Navbar items={items(7)} activeHref="/six">
        Contenu
      </Navbar>,
    );
    const plus = within(barreMobile()).getByRole("button", { name: "Plus" });
    expect(
      Array.from(barreMobile().children).filter((tuile) => pastilleActive(tuile) !== null),
    ).toEqual([plus]);
  });

  it("laisse la pastille sur la tuile active quand elle est visible", () => {
    simulerEcranMobile(280);
    poser(
      <Navbar items={items(7)} activeHref="/deux">
        Contenu
      </Navbar>,
    );
    const deux = within(barreMobile()).getByRole("link", { name: "Deux" });
    expect(
      Array.from(barreMobile().children).filter((tuile) => pastilleActive(tuile) !== null),
    ).toEqual([deux]);
  });

  it("borne la barre en largeur et empêche les tuiles de rétrécir", () => {
    simulerEcranMobile(280);
    poser(<Navbar items={items(7)}>Contenu</Navbar>);
    expect(valeurFixe(barreMobile(), "max-width")).not.toBe("");
    for (const tuile of Array.from(barreMobile().children)) {
      expect(getComputedStyle(tuile).flexShrink).toBe("0");
    }
  });
});

describe("AC15 légendes de la navigation", () => {
  it("légende la tuile Plus au-dessus au survol", async () => {
    const user = userEvent.setup();
    simulerEcranMobile(280);
    poser(<Navbar items={items(7)}>Contenu</Navbar>);
    await user.hover(within(barreMobile()).getByRole("button", { name: "Plus" }));
    const legende = await screen.findByRole("tooltip");
    expect(legende).toHaveTextContent("Plus");
    expect(placementDe(legende)).toMatch(/^top/);
  });

  it("légende une tuile mobile au-dessus au focus clavier", async () => {
    const user = userEvent.setup();
    simulerEcranMobile(400);
    poser(<Navbar items={items(3)}>Contenu</Navbar>);
    emulerFocusVisibleAuClavier();
    await tabulerJusqua(user, within(barreMobile()).getByRole("link", { name: "Deux" }));
    const legende = await screen.findByRole("tooltip");
    expect(legende).toHaveTextContent("Deux");
    expect(placementDe(legende)).toMatch(/^top/);
  });

  it("légende le bouton des réglages du rail à droite", async () => {
    const user = userEvent.setup();
    simulerViewport("tablet");
    poser(
      <Navbar items={items(2)} userName="Jeanne">
        Contenu
      </Navbar>,
    );
    await user.hover(screen.getByLabelText("Ouvrir le menu"));
    const legende = await screen.findByRole("tooltip");
    expect(legende).toHaveTextContent("Ouvrir le menu");
    expect(placementDe(legende)).toMatch(/^right/);
  });

  it("n'affiche aucune légende sur les tuiles du rail sans survol possible", async () => {
    const user = userEvent.setup();
    simulerViewport("tablet", true);
    poser(<Navbar items={items(3)}>Contenu</Navbar>);
    await user.hover(screen.getByRole("link", { name: "Un" }));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("n'affiche aucune légende sur la barre mobile sans survol possible", async () => {
    const user = userEvent.setup();
    simulerEcranMobile(280, true);
    poser(<Navbar items={items(7)}>Contenu</Navbar>);
    await user.hover(within(barreMobile()).getByRole("link", { name: "Un" }));
    await user.hover(within(barreMobile()).getByRole("button", { name: "Plus" }));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("affiche sidebarWidget dans le panneau des réglages du rail", async () => {
    const user = userEvent.setup();
    simulerViewport("tablet");
    poser(
      <Navbar items={items(2)} userName="Jeanne" sidebarWidget={<p>Widget du rail</p>}>
        Contenu
      </Navbar>,
    );
    await user.click(screen.getByLabelText("Ouvrir le menu"));
    const panneau = await screen.findByRole("dialog", { name: "Ouvrir le menu" });
    expect(within(panneau).getByText("Widget du rail")).toBeInTheDocument();
  });
});

describe("AC10 élément principal de la Navbar", () => {
  it("rend le contenu dans un main par défaut", () => {
    simulerViewport("desktop");
    poser(<Navbar items={items(2)}>Contenu</Navbar>);
    expect(screen.getByRole("main")).toHaveTextContent("Contenu");
  });

  it("rend le contenu dans un div avec mainElement div", () => {
    simulerViewport("desktop");
    poser(
      <Navbar items={items(2)} mainElement="div">
        Contenu
      </Navbar>,
    );
    expect(screen.queryByRole("main")).not.toBeInTheDocument();
    expect(screen.getByText("Contenu")).toBeInTheDocument();
  });
});
