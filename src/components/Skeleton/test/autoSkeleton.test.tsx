import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { Card } from "../../Card";
import { PageContent } from "../../PageContent";
import { Spinner } from "../../Spinner";
import { Stack } from "../../Stack";
import { ContentSkeleton, SkeletonScope } from "..";
import { reglesEmises } from "../../../test/cssRules";

const LABEL = "Chargement des membres";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const originalMatchMedia = window.matchMedia;

function simulateReducedMotion(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: reduced && query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

function renderInTheme(ui: ReactNode) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function portalLoader(spinner: ReactNode) {
  return (
    <Stack alignItems="center" padding="lg">
      {spinner}
    </Stack>
  );
}

const loader = () => screen.getByRole("progressbar", { name: LABEL });
const shapeOfLoader = () => loader().getAttribute("data-skeleton");

function isPlainSpinner(element: HTMLElement) {
  return (
    !element.hasAttribute("data-skeleton") && element.className.includes("MuiCircularProgress")
  );
}

function animationsOf(root: HTMLElement, condition: string) {
  return [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))].flatMap((element) =>
    reglesEmises(element)
      .filter((regle) => regle.conditions.join(" and ") === condition)
      .map((regle) => ({ element, animation: regle.style.getPropertyValue("animation") }))
      .filter((entree) => entree.animation !== ""),
  );
}

const pulsingBars = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>("[data-pulse]"));

describe("Squelette automatique — forme selon le conteneur", () => {
  beforeEach(() => simulateReducedMotion(false));
  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: originalMatchMedia,
    });
  });

  it("given un Spinner par défaut dans une PageContent, when il est rendu, then un squelette de liste remplace le Spinner", () => {
    renderInTheme(<PageContent>{portalLoader(<Spinner ariaLabel={LABEL} />)}</PageContent>);

    expect(shapeOfLoader()).toBe("list");
  });

  it("given un Spinner medium explicite dans une PageContent, when il est rendu, then un squelette de liste remplace le Spinner", () => {
    renderInTheme(
      <PageContent>{portalLoader(<Spinner size="medium" ariaLabel={LABEL} />)}</PageContent>,
    );

    expect(shapeOfLoader()).toBe("list");
  });

  it("given un Spinner large dans une PageContent, when il est rendu, then un squelette de page remplace le Spinner", () => {
    renderInTheme(
      <PageContent>{portalLoader(<Spinner size="large" ariaLabel={LABEL} />)}</PageContent>,
    );

    expect(shapeOfLoader()).toBe("page");
  });

  it("given un Spinner dans une Card, when il est rendu, then un squelette de corps de carte remplace le Spinner", () => {
    renderInTheme(<Card>{portalLoader(<Spinner ariaLabel={LABEL} />)}</Card>);

    expect(shapeOfLoader()).toBe("card");
  });

  it("given un Spinner dans une Card elle-même dans une PageContent, when il est rendu, then le squelette prend la forme de la carte", () => {
    renderInTheme(
      <PageContent>
        <Card>{portalLoader(<Spinner ariaLabel={LABEL} />)}</Card>
      </PageContent>,
    );

    expect(shapeOfLoader()).toBe("card");
  });

  it("given un squelette automatique, when il est rendu, then le Spinner circulaire n'est plus affiché", () => {
    const { container } = renderInTheme(
      <PageContent>{portalLoader(<Spinner ariaLabel={LABEL} />)}</PageContent>,
    );

    expect(container.querySelector(".MuiCircularProgress-root")).not.toBeInTheDocument();
  });
});

describe("Squelette automatique — cas où le Spinner reste un Spinner", () => {
  beforeEach(() => simulateReducedMotion(false));
  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: originalMatchMedia,
    });
  });

  it("given un Spinner small dans une PageContent, when il est rendu, then il reste un Spinner", () => {
    renderInTheme(
      <PageContent>{portalLoader(<Spinner size="small" ariaLabel={LABEL} />)}</PageContent>,
    );

    expect(isPlainSpinner(loader())).toBe(true);
  });

  it("given un Spinner small dans une Card, when il est rendu, then il reste un Spinner", () => {
    renderInTheme(<Card>{portalLoader(<Spinner size="small" ariaLabel={LABEL} />)}</Card>);

    expect(isPlainSpinner(loader())).toBe(true);
  });

  it("given un Spinner color inherit dans une PageContent, when il est rendu, then il reste un Spinner", () => {
    renderInTheme(
      <PageContent>{portalLoader(<Spinner color="inherit" ariaLabel={LABEL} />)}</PageContent>,
    );

    expect(isPlainSpinner(loader())).toBe(true);
  });

  it("given un Spinner color inherit dans une Card, when il est rendu, then il reste un Spinner", () => {
    renderInTheme(<Card>{portalLoader(<Spinner color="inherit" ariaLabel={LABEL} />)}</Card>);

    expect(isPlainSpinner(loader())).toBe(true);
  });

  it("given un Spinner fullPage dans une PageContent, when il est rendu, then il reste un Spinner", () => {
    renderInTheme(
      <PageContent>
        <Spinner fullPage ariaLabel={LABEL} />
      </PageContent>,
    );

    expect(isPlainSpinner(loader())).toBe(true);
  });

  it("given un Spinner hors de toute PageContent, Card ou SkeletonScope, when il est rendu, then il reste un Spinner", () => {
    renderInTheme(portalLoader(<Spinner ariaLabel={LABEL} />));

    expect(isPlainSpinner(loader())).toBe(true);
  });

  it("given un Spinner large hors de tout conteneur, when il est rendu, then il reste un Spinner", () => {
    renderInTheme(portalLoader(<Spinner size="large" ariaLabel={LABEL} />));

    expect(isPlainSpinner(loader())).toBe(true);
  });

  it("given un Spinner skeleton={false} dans une PageContent, when il est rendu, then il reste un Spinner", () => {
    renderInTheme(
      <PageContent>{portalLoader(<Spinner skeleton={false} ariaLabel={LABEL} />)}</PageContent>,
    );

    expect(isPlainSpinner(loader())).toBe(true);
  });

  it("given un Spinner skeleton={false} dans une Card, when il est rendu, then il reste un Spinner", () => {
    renderInTheme(<Card>{portalLoader(<Spinner skeleton={false} ariaLabel={LABEL} />)}</Card>);

    expect(isPlainSpinner(loader())).toBe(true);
  });
});

describe("Squelette automatique — désactivation par la PageContent", () => {
  it("given une PageContent skeleton={false}, when un Spinner y est rendu, then il reste un Spinner", () => {
    renderInTheme(
      <PageContent skeleton={false}>{portalLoader(<Spinner ariaLabel={LABEL} />)}</PageContent>,
    );

    expect(isPlainSpinner(loader())).toBe(true);
  });

  it("given une PageContent skeleton={false}, when un Spinner large y est rendu, then il reste un Spinner", () => {
    renderInTheme(
      <PageContent skeleton={false}>
        {portalLoader(<Spinner size="large" ariaLabel={LABEL} />)}
      </PageContent>,
    );

    expect(isPlainSpinner(loader())).toBe(true);
  });

  it("given une PageContent skeleton={false}, when un Spinner est rendu dans une Card enfant, then il reste un Spinner", () => {
    renderInTheme(
      <PageContent skeleton={false}>
        <Card>{portalLoader(<Spinner ariaLabel={LABEL} />)}</Card>
      </PageContent>,
    );

    expect(isPlainSpinner(loader())).toBe(true);
  });

  it("given une PageContent skeleton={false}, when un Spinner est rendu dans une Card imbriquée profondément, then il reste un Spinner", () => {
    renderInTheme(
      <PageContent skeleton={false}>
        <Stack>
          <Card>
            <Card>{portalLoader(<Spinner ariaLabel={LABEL} />)}</Card>
          </Card>
        </Stack>
      </PageContent>,
    );

    expect(isPlainSpinner(loader())).toBe(true);
  });

  it("given deux PageContent dont une seule désactivée, when chacune rend un Spinner, then seule la PageContent active montre un squelette", () => {
    renderInTheme(
      <>
        <PageContent skeleton={false}>
          <Spinner ariaLabel="Désactivé" />
        </PageContent>
        <PageContent>
          <Spinner ariaLabel="Actif" />
        </PageContent>
      </>,
    );

    expect(isPlainSpinner(screen.getByRole("progressbar", { name: "Désactivé" }))).toBe(true);
    expect(screen.getByRole("progressbar", { name: "Actif" })).toHaveAttribute(
      "data-skeleton",
      "list",
    );
  });
});

describe("Squelette automatique — accessibilité", () => {
  it.each([
    ["liste", <PageContent key="list">{portalLoader(<Spinner ariaLabel={LABEL} />)}</PageContent>],
    [
      "page",
      <PageContent key="page">
        {portalLoader(<Spinner size="large" ariaLabel={LABEL} />)}
      </PageContent>,
    ],
    ["carte", <Card key="card">{portalLoader(<Spinner ariaLabel={LABEL} />)}</Card>],
  ])(
    "given un squelette de %s, when on cherche le progressbar par son nom, then il est trouvé avec l'aria-label du Spinner",
    (_shape, ui) => {
      renderInTheme(ui);

      expect(screen.getByRole("progressbar", { name: LABEL })).toBeInTheDocument();
      expect(screen.getAllByRole("progressbar")).toHaveLength(1);
    },
  );

  it("given un Spinner sans aria-label dans une PageContent, when il devient squelette, then il garde le libellé par défaut du Spinner", () => {
    renderInTheme(<PageContent>{portalLoader(<Spinner />)}</PageContent>);

    expect(screen.getByRole("progressbar", { name: "Chargement" })).toHaveAttribute(
      "data-skeleton",
    );
  });

  it("given un Spinner sans aria-label en anglais, when il devient squelette, then le libellé par défaut est traduit comme celui du Spinner", () => {
    render(
      <CanopI18nProvider locale="en">
        <CanopThemeProvider>
          <Card>
            <Spinner skeleton={false} />
            <Spinner />
          </Card>
        </CanopThemeProvider>
      </CanopI18nProvider>,
    );

    const [spinner, skeleton] = screen.getAllByRole("progressbar");
    expect(skeleton).toHaveAccessibleName(spinner.getAttribute("aria-label") ?? "");
  });

  it("given un squelette, when on le rend, then ses barres sont masquées aux technologies d'assistance", () => {
    renderInTheme(<PageContent>{portalLoader(<Spinner ariaLabel={LABEL} />)}</PageContent>);

    const decorations = loader().querySelectorAll("[data-variant]");
    expect(decorations.length).toBeGreaterThan(0);
    decorations.forEach((decoration) => expect(decoration).toHaveAttribute("aria-hidden", "true"));
  });
});

describe("Squelette automatique — anti-clignotement et mouvement réduit", () => {
  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: originalMatchMedia,
    });
  });

  it.each(["list", "page", "card"] as const)(
    "given un squelette %s, when il est rendu, then son apparition est différée de 180 ms en partant invisible",
    (shape) => {
      simulateReducedMotion(false);
      renderInTheme(<ContentSkeleton shape={shape} ariaLabel={LABEL} />);

      const premiereApparition = animationsOf(loader(), "").find(({ animation }) =>
        /\b180ms\b/.test(animation),
      );
      expect(premiereApparition).toBeDefined();
      const delais = animationsOf(loader(), "")
        .filter(({ animation }) => animation.includes("reveal"))
        .map(({ animation }) => Number(/(\d+)ms forwards/.exec(animation)?.[1]));
      expect(Math.min(...delais)).toBe(180);
    },
  );

  it("given un squelette automatique dans une PageContent, when il est rendu, then son apparition est différée de 180 ms", () => {
    simulateReducedMotion(false);
    renderInTheme(<PageContent>{portalLoader(<Spinner ariaLabel={LABEL} />)}</PageContent>);

    expect(animationsOf(loader(), "").some(({ animation }) => /\b180ms\b/.test(animation))).toBe(
      true,
    );
  });

  it("given le mouvement non réduit, when un squelette est rendu, then ses barres pulsent", () => {
    simulateReducedMotion(false);
    renderInTheme(<ContentSkeleton shape="list" ariaLabel={LABEL} />);

    const barres = pulsingBars(loader());
    expect(barres.length).toBeGreaterThan(0);
    barres.forEach((barre) => expect(barre).toHaveAttribute("data-pulse", "on"));
  });

  it.each(["list", "page", "card"] as const)(
    "given prefers-reduced-motion, when un squelette %s est rendu, then aucune barre ne pulse",
    (shape) => {
      simulateReducedMotion(true);
      renderInTheme(<ContentSkeleton shape={shape} ariaLabel={LABEL} />);

      const barres = pulsingBars(loader());
      expect(barres.length).toBeGreaterThan(0);
      barres.forEach((barre) => expect(barre).toHaveAttribute("data-pulse", "off"));
      expect(
        animationsOf(loader(), "").filter(({ animation }) => animation.includes("pulse")),
      ).toEqual([]);
    },
  );

  it("given la media query prefers-reduced-motion, when un squelette est rendu, then aucune animation n'est conservée sauf une apparition instantanée", () => {
    simulateReducedMotion(false);
    renderInTheme(<ContentSkeleton shape="list" ariaLabel={LABEL} />);

    const sousMouvementReduit = animationsOf(loader(), REDUCED_MOTION);
    expect(sousMouvementReduit.length).toBeGreaterThan(0);
    sousMouvementReduit.forEach(({ animation }) =>
      expect(animation === "none" || /^\S+ 1ms /.test(animation)).toBe(true),
    );
    pulsingBars(loader()).forEach((barre) =>
      expect(
        sousMouvementReduit.some(
          ({ element, animation }) => element === barre && animation === "none",
        ),
      ).toBe(true),
    );
  });
});

describe("API publique — ContentSkeleton et SkeletonScope", () => {
  it.each(["card", "list", "page"] as const)(
    "given ContentSkeleton shape=%s, when il est rendu, then il expose un progressbar de cette forme",
    (shape) => {
      renderInTheme(<ContentSkeleton shape={shape} ariaLabel={LABEL} />);

      expect(loader()).toHaveAttribute("data-skeleton", shape);
    },
  );

  it("given ContentSkeleton sans ariaLabel, when il est rendu, then il porte le libellé de chargement par défaut", () => {
    renderInTheme(<ContentSkeleton shape="list" />);

    expect(screen.getByRole("progressbar", { name: "Chargement" })).toBeInTheDocument();
  });

  it("given des formes différentes, when on les rend, then leurs structures diffèrent", () => {
    const { container } = renderInTheme(
      <>
        <ContentSkeleton shape="card" ariaLabel="carte" />
        <ContentSkeleton shape="list" ariaLabel="liste" />
        <ContentSkeleton shape="page" ariaLabel="page" />
      </>,
    );

    const structures = Array.from(container.querySelectorAll("[data-skeleton]")).map(
      (element) => element.querySelectorAll("[data-pulse]").length,
    );
    expect(new Set(structures).size).toBe(3);
  });

  it("given un SkeletonScope de surface page, when un Spinner y est rendu, then il devient un squelette de liste", () => {
    renderInTheme(
      <SkeletonScope surface="page">{portalLoader(<Spinner ariaLabel={LABEL} />)}</SkeletonScope>,
    );

    expect(shapeOfLoader()).toBe("list");
  });

  it("given un SkeletonScope de surface page, when un Spinner large y est rendu, then il devient un squelette de page", () => {
    renderInTheme(
      <SkeletonScope surface="page">
        {portalLoader(<Spinner size="large" ariaLabel={LABEL} />)}
      </SkeletonScope>,
    );

    expect(shapeOfLoader()).toBe("page");
  });

  it("given un SkeletonScope de surface card, when un Spinner y est rendu, then il devient un squelette de carte", () => {
    renderInTheme(
      <SkeletonScope surface="card">{portalLoader(<Spinner ariaLabel={LABEL} />)}</SkeletonScope>,
    );

    expect(shapeOfLoader()).toBe("card");
  });

  it("given un SkeletonScope désactivé dans une PageContent, when un Spinner y est rendu, then il reste un Spinner", () => {
    renderInTheme(
      <PageContent>
        <SkeletonScope enabled={false}>{portalLoader(<Spinner ariaLabel={LABEL} />)}</SkeletonScope>
      </PageContent>,
    );

    expect(isPlainSpinner(loader())).toBe(true);
  });

  it("given un SkeletonScope de surface card dans une PageContent, when un Spinner y est rendu, then la surface la plus proche l'emporte", () => {
    renderInTheme(
      <PageContent>
        <SkeletonScope surface="card">{portalLoader(<Spinner ariaLabel={LABEL} />)}</SkeletonScope>
      </PageContent>,
    );

    expect(shapeOfLoader()).toBe("card");
  });
});

describe("Squelette automatique — composants qui ne chargent pas", () => {
  it("given une PageContent sans chargement, when elle est rendue, then son contenu s'affiche sans aucun indicateur", () => {
    renderInTheme(
      <PageContent>
        <p>Liste des membres</p>
      </PageContent>,
    );

    expect(screen.getByText("Liste des membres")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("given une Card sans chargement, when elle est rendue, then son contenu s'affiche sans aucun indicateur", () => {
    renderInTheme(
      <Card>
        <p>Détail du membre</p>
      </Card>,
    );

    expect(screen.getByText("Détail du membre")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("given un portail qui a fini de charger, when le Spinner est remplacé par le contenu, then le contenu remplace le squelette", () => {
    const page = (loading: boolean) => (
      <CanopI18nProvider locale="fr">
        <CanopThemeProvider>
          <PageContent>
            {loading ? portalLoader(<Spinner ariaLabel={LABEL} />) : <p>Membres chargés</p>}
          </PageContent>
        </CanopThemeProvider>
      </CanopI18nProvider>
    );
    const { rerender } = render(page(true));

    rerender(page(false));

    expect(screen.getByText("Membres chargés")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("given une PageContent sans chargement, when elle est rendue avec et sans skeleton, then le contenu rendu est identique", () => {
    const { container: avec } = renderInTheme(
      <PageContent>
        <p>Identique</p>
      </PageContent>,
    );
    const { container: sans } = renderInTheme(
      <PageContent skeleton={false}>
        <p>Identique</p>
      </PageContent>,
    );

    expect(avec.textContent).toBe(sans.textContent);
    expect(avec.querySelectorAll("*").length).toBe(sans.querySelectorAll("*").length);
  });
});
