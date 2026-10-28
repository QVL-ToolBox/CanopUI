import { Suspense, lazy, use, type ComponentType, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { PageScaffold } from "../PageScaffold";
import type { CanopNavbarItem } from "../../Navbar";

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
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

const items: CanopNavbarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "apps" },
  { label: "Utilisateurs", href: "/users", icon: "user" },
];

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function lazyPage() {
  const module = deferred<{ default: ComponentType }>();
  const Page = lazy(() => module.promise);
  const load = () =>
    act(async () => {
      module.resolve({ default: () => <p>Page chargée</p> });
      await module.promise;
    });
  return { Page, load };
}

function SuspendedData({ data }: { data: Promise<string> }) {
  return <p>{use(data)}</p>;
}

async function renderScaffold(ui: ReactNode) {
  await act(async () => {
    render(
      <CanopI18nProvider locale="fr">
        <CanopThemeProvider>
          <Suspense fallback={<p>Repli extérieur</p>}>{ui}</Suspense>
        </CanopThemeProvider>
      </CanopI18nProvider>,
    );
  });
}

const pageSkeleton = () => document.querySelector('[data-skeleton="page"]');

describe("PageScaffold — frontière Suspense", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it("given un composant lazy non chargé, when la page est rendue, then un squelette de page s'affiche à la place des children", async () => {
    const { Page } = lazyPage();

    await renderScaffold(
      <PageScaffold items={items}>
        <Page />
      </PageScaffold>,
    );

    expect(pageSkeleton()).toBeInTheDocument();
    expect(pageSkeleton()).toHaveAttribute("role", "progressbar");
    expect(screen.queryByText("Repli extérieur")).not.toBeInTheDocument();
  });

  it("given un composant lazy non chargé, when la page est rendue, then le squelette est un progressbar accessible nommé", async () => {
    const { Page } = lazyPage();

    await renderScaffold(
      <PageScaffold items={items}>
        <Page />
      </PageScaffold>,
    );

    expect(screen.getByRole("progressbar", { name: "Chargement" })).toBe(pageSkeleton());
  });

  it("given un composant lazy en cours de chargement, when la page est rendue, then la navigation reste affichée", async () => {
    const { Page } = lazyPage();

    await renderScaffold(
      <PageScaffold navbarTitle="CustHome" items={items}>
        <Page />
      </PageScaffold>,
    );

    expect(screen.getByRole("heading", { name: "CustHome" })).toBeInTheDocument();
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
  });

  it("given un composant lazy, when son module se résout, then le contenu remplace le squelette", async () => {
    const { Page, load } = lazyPage();
    await renderScaffold(
      <PageScaffold items={items}>
        <Page />
      </PageScaffold>,
    );

    await load();

    expect(await screen.findByText("Page chargée")).toBeInTheDocument();
    expect(pageSkeleton()).not.toBeInTheDocument();
  });

  it("given une promesse suspendue dans les children, when la page est rendue, then le squelette de page s'affiche", async () => {
    const data = deferred<string>();

    await renderScaffold(
      <PageScaffold items={items}>
        <SuspendedData data={data.promise} />
      </PageScaffold>,
    );

    expect(pageSkeleton()).toBeInTheDocument();
  });

  it("given une promesse suspendue, when elle se résout, then les données remplacent le squelette", async () => {
    const data = deferred<string>();
    await renderScaffold(
      <PageScaffold items={items}>
        <SuspendedData data={data.promise} />
      </PageScaffold>,
    );

    await act(async () => {
      data.resolve("Données reçues");
      await data.promise;
    });

    expect(await screen.findByText("Données reçues")).toBeInTheDocument();
    expect(pageSkeleton()).not.toBeInTheDocument();
  });

  it("given skeleton={false}, when un composant lazy suspend, then la suspension remonte à la frontière extérieure", async () => {
    const { Page } = lazyPage();

    await renderScaffold(
      <PageScaffold items={items} skeleton={false}>
        <Page />
      </PageScaffold>,
    );

    expect(screen.getByText("Repli extérieur")).toBeInTheDocument();
    expect(pageSkeleton()).not.toBeInTheDocument();
  });

  it("given skeleton={false}, when la promesse suspendue se résout, then le contenu s'affiche", async () => {
    const data = deferred<string>();
    await renderScaffold(
      <PageScaffold items={items} skeleton={false}>
        <SuspendedData data={data.promise} />
      </PageScaffold>,
    );

    await act(async () => {
      data.resolve("Données reçues");
      await data.promise;
    });

    expect(await screen.findByText("Données reçues")).toBeInTheDocument();
  });

  it("given des children qui ne suspendent pas, when la page est rendue, then le contenu s'affiche sans squelette", async () => {
    await renderScaffold(
      <PageScaffold items={items}>
        <p>contenu de page</p>
      </PageScaffold>,
    );

    expect(screen.getByText("contenu de page")).toBeInTheDocument();
    expect(pageSkeleton()).not.toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
