import { afterEach, describe, expect, it, vi } from "vitest";
import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar, type CanopNavbarItem } from "../Navbar";
import {
  VIEWPORTS,
  moinsDeMouvement,
  navigationPrincipale,
  pastilleActive,
  reglesBrutesDuSousArbre,
  reglesBrutesVisant,
  rendreTonal,
  simulerViewport,
} from "../../../test/navbarToneKit";

const items: CanopNavbarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "apps" },
  { label: "Utilisateurs", href: "/users", icon: "user" },
  {
    label: "Studio",
    href: "/studio",
    icon: "apps",
    children: [{ label: "CanopUI", href: "/studio/canopui", icon: "folder" }],
  },
];

const FORMATS = Object.entries(VIEWPORTS) as [
  keyof typeof VIEWPORTS,
  (requete: string) => boolean,
][];
const DEGRADE_DE_BARRE =
  "linear-gradient(180deg, var(--canop-navbar-bg-top) 0%, var(--canop-navbar-bg-bottom) 100%)";

function barre(activeHref = "/users") {
  return (
    <Navbar items={items} activeHref={activeHref} userName="Jeanne" onLogout={vi.fn()}>
      Contenu
    </Navbar>
  );
}

function lien(nom: string) {
  return within(navigationPrincipale()).getByRole("link", { name: nom });
}

function reglesJointes(element: Element) {
  return reglesBrutesVisant(element).join("\n");
}

function blocsDeSurvol(element: Element) {
  return reglesBrutesVisant(element).filter((regle) => regle.split("{")[0].includes(":hover"));
}

function dessinDeLIcone(element: Element) {
  return Array.from(element.querySelectorAll("svg path"))
    .map((trace) => trace.getAttribute("d"))
    .join("|");
}

function positionnerLesLiensAMillePixelsDEcart() {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
    const y = this.closest("a")?.getAttribute("href") === "/users" ? 200 : 0;
    return {
      x: y,
      y,
      top: y,
      left: y,
      width: 100,
      height: 40,
      right: y + 100,
      bottom: y + 40,
      toJSON: () => ({}),
    };
  });
}

function attendreUneImage() {
  return act(() => new Promise((fin) => setTimeout(fin, 16)));
}

async function transformsDeLaPastilleApresBascule() {
  positionnerLesLiensAMillePixelsDEcart();
  const vue = rendreTonal(barre("/dashboard"));
  await attendreUneImage();
  vue.rerender(barre("/users"));
  const actif = document.querySelector("a[href='/users'][aria-current='page']") as Element;
  const forme = pastilleActive(actif)?.firstElementChild as HTMLElement;
  const releves: string[] = [];
  for (let image = 0; image < 60; image += 1) {
    releves.push(forme.style.transform);
    await attendreUneImage();
  }
  return releves;
}

function decalageVertical(transform: string): number {
  const translateY = transform.match(/translateY\((-?[\d.e-]+)px\)/);
  if (translateY) return Number(translateY[1]);
  const translate3d = transform.match(/translate3d\([^,]+,\s*(-?[\d.e-]+)px/);
  return translate3d ? Number(translate3d[1]) : 0;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe.each(FORMATS)("Navbar tonale - format %s", (_format, viewport) => {
  it("AC3 - peint la barre avec le degrade des variables --canop-navbar", () => {
    simulerViewport(viewport);
    rendreTonal(barre());
    expect(reglesJointes(navigationPrincipale())).toContain(DEGRADE_DE_BARRE);
  });

  it("AC3 - colore les liens inactifs avec --canop-navbar-text", () => {
    simulerViewport(viewport);
    rendreTonal(barre());
    expect(reglesJointes(lien("Dashboard"))).toContain("color:var(--canop-navbar-text);");
  });

  it("AC6 - le focus clavier reprend exactement le survol", () => {
    simulerViewport(viewport);
    rendreTonal(barre());
    const survols = blocsDeSurvol(lien("Dashboard"));
    expect(survols.join("\n")).toContain("color:var(--canop-navbar-text-hover)");
    expect(survols.join("\n")).toContain("background-color:var(--canop-navbar-hover-fill)");
    for (const bloc of survols) {
      expect(bloc.split("{")[0]).toContain(":focus-visible");
    }
  });

  it("AC2 - l'item actif porte une pastille blanche avec ombre et halo", () => {
    simulerViewport(viewport);
    rendreTonal(barre());
    const actif = lien("Utilisateurs");
    const halo = pastilleActive(actif);
    const forme = halo?.firstElementChild as HTMLElement | null;
    expect(actif).toHaveAttribute("aria-current", "page");
    expect(halo?.style.filter).toContain("var(--canop-navbar-halo)");
    expect(forme?.style.backgroundColor).toBe("var(--canop-navbar-active-bg)");
    expect(forme?.style.filter).toMatch(/drop-shadow/);
  });

  it("AC2 - le texte et l'icone actifs prennent la teinte foncee", () => {
    simulerViewport(viewport);
    rendreTonal(barre());
    expect(reglesJointes(lien("Utilisateurs"))).toContain("color:var(--canop-navbar-active-text);");
    expect(getComputedStyle(lien("Utilisateurs").querySelector("svg") as Element).color).toBe(
      "var(--canop-navbar-active-text)",
    );
  });

  it("AC2 - aucun marqueur ni point ne s'ajoute a la pastille", () => {
    simulerViewport(viewport);
    rendreTonal(barre());
    const actif = lien("Utilisateurs");
    const decors = actif.querySelectorAll(":scope > [aria-hidden='true']");
    expect(decors).toHaveLength(1);
    expect(pastilleActive(actif)?.querySelectorAll("*")).toHaveLength(1);
    expect(pastilleActive(actif)?.firstElementChild?.children).toHaveLength(0);
  });

  it("AC2 - une seule pastille dans la barre, qui suit le lien actif", () => {
    simulerViewport(viewport);
    const vue = rendreTonal(barre("/dashboard"));
    expect(pastilleActive(lien("Dashboard"))).not.toBeNull();
    vue.rerender(barre("/users"));
    expect(pastilleActive(lien("Dashboard"))).toBeNull();
    expect(pastilleActive(lien("Utilisateurs"))).not.toBeNull();
    expect(navigationPrincipale().querySelectorAll("[aria-current='page']")).toHaveLength(1);
  });

  it("AC2 - l'icone active passe en version pleine", () => {
    simulerViewport(viewport);
    const vue = rendreTonal(barre("/dashboard"));
    const contour = dessinDeLIcone(lien("Utilisateurs"));
    vue.rerender(barre("/users"));
    expect(dessinDeLIcone(lien("Utilisateurs"))).not.toBe(contour);
  });

  it("AC6 - garde la navigation nommee et aria-current sur le seul lien actif", () => {
    simulerViewport(viewport);
    rendreTonal(barre("/users/42"));
    expect(lien("Utilisateurs")).toHaveAttribute("aria-current", "page");
    expect(lien("Dashboard")).not.toHaveAttribute("aria-current");
  });

  it("AC6 - sans glissement anime sous prefers-reduced-motion", async () => {
    simulerViewport((requete) => viewport(requete) || moinsDeMouvement(requete));
    const releves = await transformsDeLaPastilleApresBascule();
    expect(releves.every((transform) => !transform.includes("translate"))).toBe(true);
  });
});

describe.each(FORMATS.filter(([format]) => format !== "mobile"))(
  "Navbar tonale - glissement de la pastille en format %s",
  (_format, viewport) => {
    it("AC2 - la pastille glisse depuis l'ancien lien actif", async () => {
      simulerViewport(viewport);
      const decalages = (await transformsDeLaPastilleApresBascule()).map(decalageVertical);
      const enGlissement = decalages.filter((decalage) => decalage !== 0);
      expect(enGlissement.length).toBeGreaterThan(0);
      expect(enGlissement[0]).toBeLessThan(-100);
      expect(Math.abs(decalages[decalages.length - 1])).toBeLessThan(1);
    });
  },
);

describe("Navbar tonale - mode sombre", () => {
  it("AC2 - le halo de la pastille est flou de 0.75rem", () => {
    simulerViewport(VIEWPORTS.etendu);
    rendreTonal(barre(), "dark");
    expect(pastilleActive(lien("Utilisateurs"))?.style.filter).toBe(
      "drop-shadow(0 0 0.75rem var(--canop-navbar-halo))",
    );
  });
});

describe("Navbar tonale - format etendu", () => {
  it("AC2 - conserve la graisse 600 sur l'item actif", () => {
    simulerViewport(VIEWPORTS.etendu);
    rendreTonal(barre());
    expect(lien("Utilisateurs")).toHaveStyle({ fontWeight: 600 });
    expect(lien("Dashboard")).toHaveStyle({ fontWeight: 400 });
  });
});

describe("Navbar tonale - parent d'un sous-item actif", () => {
  it("AC2 - reste sans pastille, en texte survol et en gras", () => {
    simulerViewport(VIEWPORTS.etendu);
    rendreTonal(barre("/studio/canopui"));
    const parent = within(navigationPrincipale()).getAllByText("Studio")[0].closest("a, button");
    expect(parent).not.toBeNull();
    expect(pastilleActive(parent as Element)).toBeNull();
    expect(reglesJointes(parent as Element)).toContain("color:var(--canop-navbar-text-hover);");
    expect(parent).toHaveStyle({ fontWeight: 600 });
  });
});

describe("Navbar tonale - format rail", () => {
  it(
    "AC3 - ouvre les sous-menus dans un popover sombre aux couleurs de la barre",
    { timeout: 60000 },
    async () => {
      simulerViewport(VIEWPORTS.rail);
      const user = userEvent.setup();
      rendreTonal(barre());
      const declencheur = within(navigationPrincipale()).getByRole("button", { name: "Studio" });
      await user.click(declencheur);
      await screen.findByRole("link", { name: "CanopUI" });
      const panneau = document.getElementById(declencheur.getAttribute("aria-controls") as string);
      const popover = panneau?.closest("[role='presentation']") ?? panneau;
      const regles = reglesBrutesDuSousArbre(popover as Element).join("\n");
      expect(regles).toContain(DEGRADE_DE_BARRE);
      expect(regles).toContain("var(--canop-navbar-text)");
    },
  );
});

describe("Navbar tonale - format mobile", () => {
  it("AC3 - le bouton reglages suit les variables de la barre", () => {
    simulerViewport(VIEWPORTS.mobile);
    rendreTonal(barre());
    const reglages = screen.getByRole("button", { name: "Ouvrir le menu" });
    const regles = reglesJointes(reglages);
    expect(regles).toContain(DEGRADE_DE_BARRE);
    expect(regles).toContain("color:var(--canop-navbar-text);");
  });

  it("AC6 - la barre basse et le bouton reglages restent en position fixe", () => {
    simulerViewport(VIEWPORTS.mobile);
    rendreTonal(barre());
    expect(navigationPrincipale()).toHaveStyle({ position: "fixed" });
    expect(screen.getByRole("button", { name: "Ouvrir le menu" })).toHaveStyle({
      position: "fixed",
    });
  });
});
