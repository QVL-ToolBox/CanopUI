import type { ComponentProps, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useTheme } from "@mui/material/styles";
import {
  CanopI18nProvider,
  CanopThemeProvider,
  HalloweenDecor,
  PageScaffold,
  palette,
  paletteHalloween,
  useCanopTheme,
  type CanopNavbarItem,
} from "../../index";
import { mockMatchMedia } from "../../test/halloweenDecorTestKit";

const IN_SEASON_DAY = new Date(2026, 9, 20, 12);
const OFF_SEASON_DAY = new Date(2026, 5, 10, 12);
const items: CanopNavbarItem[] = [{ label: "Dashboard", href: "/dashboard", icon: "apps" }];
type SeasonProps = Partial<Omit<ComponentProps<typeof CanopThemeProvider>, "children">>;
const spiderSelector = 'svg:has([data-part="legs"])';
const webSelector = 'svg:has([data-part="strand"])';

function decorLayers(): HTMLElement[] {
  return Array.from(
    document.body.querySelectorAll<HTMLElement>('[aria-hidden="true"][data-paused]'),
  );
}

function scenes(): HTMLElement[] {
  return decorLayers().filter((layer) => layer.querySelector(webSelector));
}

function upperLayers(): HTMLElement[] {
  return decorLayers().filter((layer) => layer.querySelector(spiderSelector));
}

function precedes(first: Node, second: Node): boolean {
  return Boolean(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);
}

function SeasonProbe() {
  const { season } = useCanopTheme();
  const theme = useTheme();
  return (
    <>
      <span data-testid="season">{String(season)}</span>
      <span data-testid="primary">{theme.palette.primary.main}</span>
    </>
  );
}

function Scaffold({ label = "Contenu" }: { label?: string }) {
  return (
    <PageScaffold items={items}>
      <p>{label}</p>
    </PageScaffold>
  );
}

function withI18n(ui: ReactNode) {
  return <CanopI18nProvider locale="fr">{ui}</CanopI18nProvider>;
}

function renderProvider(ui: ReactNode, props: SeasonProps = {}) {
  return render(
    withI18n(
      <CanopThemeProvider defaultMode="light" {...props}>
        {ui}
      </CanopThemeProvider>,
    ),
  );
}

function seasonAt(day: Date): string {
  vi.setSystemTime(day);
  renderProvider(<SeasonProbe />);
  return screen.getByTestId("season").textContent ?? "";
}

beforeEach(() => {
  window.localStorage.clear();
  mockMatchMedia(false);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AC1 — saison automatique sans prop season", () => {
  it("applique la saison halloween et sa palette quand la date du montage est en saison", () => {
    vi.setSystemTime(IN_SEASON_DAY);

    renderProvider(<SeasonProbe />);

    expect(screen.getByTestId("season")).toHaveTextContent("halloween");
    expect(screen.getByTestId("primary")).toHaveTextContent(paletteHalloween.primary.main);
  });

  it("n'applique aucune saison et garde la palette CanopUI quand la date est hors saison", () => {
    vi.setSystemTime(OFF_SEASON_DAY);

    renderProvider(<SeasonProbe />);

    expect(screen.getByTestId("season")).toHaveTextContent("null");
    expect(screen.getByTestId("primary")).toHaveTextContent(palette.primary.main);
  });

  it.each([
    ["le 14/10 a 23:59:59", new Date(2026, 9, 14, 23, 59, 59), "null"],
    ["le 15/10 a 00:00", new Date(2026, 9, 15, 0, 0, 0), "halloween"],
    ["le 01/11 a 23:59:59", new Date(2026, 10, 1, 23, 59, 59), "halloween"],
    ["le 02/11 a 00:00", new Date(2026, 10, 2, 0, 0, 0), "null"],
  ])("resout la saison %s en %s", (_label, day, expected) => {
    expect(seasonAt(day)).toBe(expected);
  });

  it("suit le calendrier quelle que soit l'annee", () => {
    expect(seasonAt(new Date(2031, 9, 31, 12))).toBe("halloween");
  });

  it("garde l'absence de saison apres le passage au 15/10 sans remontage", () => {
    vi.setSystemTime(new Date(2026, 9, 14, 23, 59, 59));
    const { rerender } = renderProvider(<SeasonProbe />);

    vi.setSystemTime(new Date(2026, 9, 15, 0, 0, 1));
    rerender(
      withI18n(
        <CanopThemeProvider defaultMode="light">
          <SeasonProbe />
        </CanopThemeProvider>,
      ),
    );

    expect(screen.getByTestId("season")).toHaveTextContent("null");
    expect(decorLayers()).toHaveLength(0);
  });

  it("garde la saison apres le passage au 02/11 sans remontage", () => {
    vi.setSystemTime(new Date(2026, 10, 1, 23, 59, 59));
    const { rerender } = renderProvider(<SeasonProbe />);

    vi.setSystemTime(new Date(2026, 10, 2, 0, 0, 1));
    rerender(
      withI18n(
        <CanopThemeProvider defaultMode="light">
          <SeasonProbe />
        </CanopThemeProvider>,
      ),
    );

    expect(screen.getByTestId("season")).toHaveTextContent("halloween");
  });
});

describe("AC2 — decor affiche sans code cote portail", () => {
  beforeEach(() => {
    vi.setSystemTime(IN_SEASON_DAY);
  });

  it("rend une seule fois le calque superieur en Portal dans body", () => {
    const { container } = renderProvider(<Scaffold />);

    expect(upperLayers()).toHaveLength(1);
    expect(document.body).toContainElement(upperLayers()[0]);
    expect(container).not.toContainElement(upperLayers()[0]);
  });

  it("rend une seule scene avec un PageScaffold", () => {
    renderProvider(<Scaffold />);

    expect(scenes()).toHaveLength(1);
  });

  it("place la scene du PageScaffold apres son fond et avant son contenu", () => {
    const { container } = renderProvider(<Scaffold />);
    const [scene] = scenes();
    const backdrop = container.querySelector("video");

    expect(container).toContainElement(scene);
    expect(backdrop).not.toBeNull();
    expect(precedes(backdrop as Node, scene)).toBe(true);
    expect(precedes(scene, screen.getByText("Contenu"))).toBe(true);
  });

  it("rend une seule scene avec deux PageScaffold montes ensemble", () => {
    renderProvider(
      <>
        <Scaffold label="Premier" />
        <Scaffold label="Second" />
      </>,
    );

    expect(scenes()).toHaveLength(1);
    expect(upperLayers()).toHaveLength(1);
  });

  it("rend la scene en repli sans PageScaffold", () => {
    renderProvider(<p>Connexion</p>);

    expect(scenes()).toHaveLength(1);
    expect(upperLayers()).toHaveLength(1);
  });

  it("retire la scene de repli quand un PageScaffold est monte ensuite", () => {
    const { rerender, container } = renderProvider(<p>Connexion</p>);

    rerender(
      withI18n(
        <CanopThemeProvider defaultMode="light">
          <Scaffold />
        </CanopThemeProvider>,
      ),
    );

    expect(scenes()).toHaveLength(1);
    expect(precedes(container.querySelector("video") as Node, scenes()[0])).toBe(true);
    expect(precedes(scenes()[0], screen.getByText("Contenu"))).toBe(true);
  });

  it("remet la scene de repli quand le PageScaffold est demonte", () => {
    const { rerender } = renderProvider(<Scaffold />);

    rerender(
      withI18n(
        <CanopThemeProvider defaultMode="light">
          <p>Connexion</p>
        </CanopThemeProvider>,
      ),
    );

    expect(scenes()).toHaveLength(1);
  });

  it("ne rend qu'une scene et un calque superieur avec des providers imbriques", () => {
    renderProvider(
      <CanopThemeProvider>
        <CanopThemeProvider season="halloween">
          <p>Imbrique</p>
        </CanopThemeProvider>
      </CanopThemeProvider>,
    );

    expect(scenes()).toHaveLength(1);
    expect(upperLayers()).toHaveLength(1);
  });

  it("ne rend qu'une scene et un calque superieur avec un PageScaffold sous des providers imbriques", () => {
    renderProvider(
      <CanopThemeProvider>
        <Scaffold />
      </CanopThemeProvider>,
    );

    expect(scenes()).toHaveLength(1);
    expect(upperLayers()).toHaveLength(1);
  });

  it("ne rend que les enfants d'un HalloweenDecor viewport manuel sous un decor gere", () => {
    renderProvider(
      <HalloweenDecor scope="viewport">
        <p>Enfant du decor</p>
      </HalloweenDecor>,
    );

    expect(screen.getByText("Enfant du decor")).toBeInTheDocument();
    expect(scenes()).toHaveLength(1);
    expect(upperLayers()).toHaveLength(1);
  });

  it("ne rend que les enfants d'un HalloweenDecor viewport manuel dans un PageScaffold", () => {
    renderProvider(
      <PageScaffold items={items}>
        <HalloweenDecor scope="viewport">
          <p>Enfant du decor</p>
        </HalloweenDecor>
      </PageScaffold>,
    );

    expect(screen.getByText("Enfant du decor")).toBeInTheDocument();
    expect(scenes()).toHaveLength(1);
    expect(upperLayers()).toHaveLength(1);
  });
});

describe("AC3 — forcer, couper, palette sans decor", () => {
  it("coupe palette et decor avec season nulle en pleine saison", () => {
    vi.setSystemTime(IN_SEASON_DAY);

    renderProvider(
      <>
        <SeasonProbe />
        <Scaffold />
      </>,
      { season: null },
    );

    expect(screen.getByTestId("season")).toHaveTextContent("null");
    expect(screen.getByTestId("primary")).toHaveTextContent(palette.primary.main);
    expect(decorLayers()).toHaveLength(0);
  });

  it("force la saison, sa palette et son decor avec season halloween hors saison", () => {
    vi.setSystemTime(OFF_SEASON_DAY);

    renderProvider(
      <>
        <SeasonProbe />
        <Scaffold />
      </>,
      { season: "halloween" },
    );

    expect(screen.getByTestId("season")).toHaveTextContent("halloween");
    expect(screen.getByTestId("primary")).toHaveTextContent(paletteHalloween.primary.main);
    expect(scenes()).toHaveLength(1);
    expect(upperLayers()).toHaveLength(1);
  });

  it.each([
    ["avec un PageScaffold", <Scaffold key="scaffold" />],
    ["sans PageScaffold", <p key="login">Connexion</p>],
  ])("garde la palette sans aucun decor avec seasonalDecor false %s", (_label, ui) => {
    vi.setSystemTime(IN_SEASON_DAY);

    renderProvider(
      <>
        <SeasonProbe />
        {ui}
      </>,
      { seasonalDecor: false },
    );

    expect(screen.getByTestId("season")).toHaveTextContent("halloween");
    expect(screen.getByTestId("primary")).toHaveTextContent(paletteHalloween.primary.main);
    expect(decorLayers()).toHaveLength(0);
  });
});

describe("AC4 — hors saison, rendu identique a la 1.3.0", () => {
  it.each([
    ["avec un PageScaffold", <Scaffold key="scaffold" />],
    ["sans PageScaffold", <p key="login">Connexion</p>],
  ])("ne rend aucun decor hors saison %s", (_label, ui) => {
    vi.setSystemTime(OFF_SEASON_DAY);

    renderProvider(ui);

    expect(decorLayers()).toHaveLength(0);
  });
});

describe("AC5 — useCanopTheme().season renvoie la saison effective", () => {
  it.each<[string, Date, SeasonProps, string]>([
    ["halloween en saison sans prop", IN_SEASON_DAY, {}, "halloween"],
    ["null hors saison sans prop", OFF_SEASON_DAY, {}, "null"],
    ["halloween force hors saison", OFF_SEASON_DAY, { season: "halloween" }, "halloween"],
    ["null coupe en saison", IN_SEASON_DAY, { season: null }, "null"],
    ["halloween en saison sans decor", IN_SEASON_DAY, { seasonalDecor: false }, "halloween"],
  ])("renvoie %s", (_label, day, props, expected) => {
    vi.setSystemTime(day);

    renderProvider(<SeasonProbe />, props);

    expect(screen.getByTestId("season")).toHaveTextContent(expected);
  });
});
