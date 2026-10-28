import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  CanopI18nProvider,
  CanopThemeProvider,
  Layout,
  PageScaffold,
  avoidPageTopRight,
  reservePageTopRight,
  resetPageInsets,
  type CanopBackgroundTone,
  type CanopNavbarItem,
} from "../index";
import { PageHeader } from "../components/PageScaffold/PageHeader";
import { reglesEmises } from "./cssRules";

const TOP_RIGHT = "--canop-page-top-right-inset";
const BOTTOM = "--canop-page-bottom-inset";

const items: CanopNavbarItem[] = [{ label: "Accueil", href: "/", icon: "apps" }];

function simulerViewport(mobile: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: mobile && !query.includes("prefers-reduced-motion"),
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

function poser(ui: ReactElement) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider defaultMode="light">{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function teintesDuFond(racine: HTMLElement): string {
  return [racine, ...Array.from(racine.querySelectorAll("*"))]
    .flatMap((element) => reglesEmises(element))
    .map((regle) =>
      [regle.style.backgroundColor, regle.style.backgroundImage, regle.style.background].join(" "),
    )
    .join(" ");
}

beforeEach(() => {
  simulerViewport(false);
});

describe("AC7 fond lave en accent", () => {
  const surfaces: [string, (tone?: CanopBackgroundTone) => ReactElement][] = [
    [
      "PageScaffold",
      (tone) => (
        <PageScaffold items={items} background="shapes" backgroundTone={tone}>
          <p>Contenu</p>
        </PageScaffold>
      ),
    ],
    ["Layout", (tone) => <Layout backgroundTone={tone}>Contenu</Layout>],
  ];

  async function poserFondCharge(ui: ReactElement) {
    const vue = poser(ui);
    await waitFor(() => expect(vue.container.querySelector("main canvas")).not.toBeNull());
    return vue;
  }

  it.each(surfaces)("teinte le fond de %s en primary par défaut", async (_, surface) => {
    const { container } = await poserFondCharge(surface());
    const teintes = teintesDuFond(container);
    expect(teintes).toContain("--canop-palette-primary-main");
    expect(teintes).not.toContain("--canop-palette-accent-main");
  });

  it.each(surfaces)("teinte le fond et les lueurs de %s en accent", async (_, surface) => {
    const { container } = await poserFondCharge(surface("accent"));
    const teintes = teintesDuFond(container);
    expect(teintes).toMatch(/color-mix\([^)]*--canop-palette-accent-main[^)]*\)/);
    expect(teintes).toMatch(/radial-gradient\([^]*--canop-palette-accent-main/);
    expect(teintes).not.toContain("--canop-palette-primary-main");
  });
});

describe("AC9 réserves de page", () => {
  it("déclare la réserve du coin haut droit", () => {
    expect(reservePageTopRight("3rem")).toEqual(expect.objectContaining({ [TOP_RIGHT]: "3rem" }));
  });

  it("élargit la gouttière à la réserve du coin seulement si elle est plus grande", () => {
    const gouttiere = avoidPageTopRight("1.5rem");
    expect(gouttiere).toMatch(/^max\(/);
    expect(gouttiere).toContain("1.5rem");
    expect(gouttiere).toContain(`var(${TOP_RIGHT}`);
  });

  it("remet les deux réserves à zéro", () => {
    const remise = resetPageInsets() as Record<string, unknown>;
    expect(String(remise[TOP_RIGHT])).toMatch(/^0(px|rem)?$/);
    expect(String(remise[BOTTOM])).toMatch(/^0(px|rem)?$/);
  });
});

describe("AC10 niveaux de titre et élément principal", () => {
  it("rend la marque du Layout au niveau demandé", () => {
    poser(
      <Layout brand="Studio" brandLevel={2}>
        Contenu
      </Layout>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Studio" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });

  it("rend la marque du Layout en texte avec brandLevel text", () => {
    poser(
      <Layout brand="Studio" brandLevel="text">
        Contenu
      </Layout>,
    );
    expect(screen.getByText("Studio")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Studio" })).not.toBeInTheDocument();
  });

  it("rend le Layout dans un div avec mainElement div", () => {
    poser(<Layout mainElement="div">Contenu</Layout>);
    expect(screen.queryByRole("main")).not.toBeInTheDocument();
    expect(screen.getByText("Contenu")).toBeInTheDocument();
  });

  it("garde un main par défaut pour le Layout", () => {
    poser(<Layout>Contenu</Layout>);
    expect(screen.getByRole("main")).toHaveTextContent("Contenu");
  });

  it("rend le titre du PageScaffold au niveau demandé", () => {
    poser(
      <PageScaffold items={items} background="shapes" title="Tableau" titleLevel={2}>
        <p>Contenu</p>
      </PageScaffold>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Tableau" })).toBeInTheDocument();
  });

  it("rend le titre du PageScaffold en texte avec titleLevel text", () => {
    poser(
      <PageScaffold items={items} background="shapes" title="Tableau" titleLevel="text">
        <p>Contenu</p>
      </PageScaffold>,
    );
    expect(screen.getByText("Tableau")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Tableau" })).not.toBeInTheDocument();
  });

  it("garde le titre du PageScaffold en h1 par défaut", () => {
    poser(
      <PageScaffold items={items} background="shapes" title="Tableau">
        <p>Contenu</p>
      </PageScaffold>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Tableau" })).toBeInTheDocument();
  });

  it.each([
    ["main", 1],
    ["div", 0],
  ] as const)("rend le PageScaffold avec mainElement %s", (mainElement, nombreDeMain) => {
    poser(
      <PageScaffold items={items} background="shapes" mainElement={mainElement}>
        <p>Contenu</p>
      </PageScaffold>,
    );
    expect(screen.queryAllByRole("main")).toHaveLength(nombreDeMain);
  });

  it.each([1, 2, 3, 4] as const)("rend le titre du PageHeader en h%s", (niveau) => {
    poser(<PageHeader title="Section" titleLevel={niveau} />);
    expect(screen.getByRole("heading", { level: niveau, name: "Section" })).toBeInTheDocument();
  });

  it("rend le titre du PageHeader en texte avec titleLevel text", () => {
    poser(<PageHeader title="Section" titleLevel="text" />);
    expect(screen.getByText("Section")).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });
});

describe("AC11 pied du menu des réglages", () => {
  it("transmet settingsFooter du PageScaffold jusqu'au pied du menu", async () => {
    simulerViewport(true);
    const user = userEvent.setup();
    poser(
      <PageScaffold
        items={items}
        background="shapes"
        onLogout={() => undefined}
        mobileFooterPlacement="settings"
        settingsFooter={<span>Pied des réglages</span>}
      >
        <p>Contenu</p>
      </PageScaffold>,
    );
    await user.click(screen.getByLabelText("Ouvrir le menu"));
    const menu = await screen.findByRole("presentation");
    expect(within(menu).getByText("Pied des réglages")).toBeInTheDocument();
  });
});
