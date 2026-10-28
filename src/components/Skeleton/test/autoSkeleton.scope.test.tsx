import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { Card } from "../../Card";
import { ConfirmDialog } from "../../ConfirmDialog";
import { Menu } from "../../Menu";
import { PageContent } from "../../PageContent";
import { SidePanel } from "../../SidePanel";
import { Spinner } from "../../Spinner";
import { SkeletonScope } from "..";

const LABEL = "Chargement du détail";

function renderInTheme(ui: ReactNode) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

const loader = () => screen.getByRole("progressbar", { name: LABEL });
const isPlainSpinner = (element: HTMLElement) =>
  !element.hasAttribute("data-skeleton") && element.className.includes("MuiCircularProgress");

const overlays: [string, (content: ReactNode) => ReactNode][] = [
  [
    "SidePanel",
    (content) => (
      <SidePanel open onClose={() => {}} title="Détail">
        {content}
      </SidePanel>
    ),
  ],
  [
    "ConfirmDialog",
    (content) => (
      <ConfirmDialog
        open
        title="Confirmer"
        message={content}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    ),
  ],
  [
    "Menu",
    (content) => (
      <Menu open onClose={() => {}} anchorEl={document.body} ariaLabel="Actions">
        {content}
      </Menu>
    ),
  ],
];

describe("Portée des squelettes — coupure explicite", () => {
  it("given un SkeletonScope surface={null} dans une PageContent, when un Spinner y est rendu, then il reste un Spinner", () => {
    renderInTheme(
      <PageContent>
        <SkeletonScope surface={null}>
          <Spinner ariaLabel={LABEL} />
        </SkeletonScope>
      </PageContent>,
    );

    expect(isPlainSpinner(loader())).toBe(true);
  });

  it("given un SkeletonScope surface={null}, when une Card y rouvre une portée, then le Spinner de la Card devient un squelette de carte", () => {
    renderInTheme(
      <PageContent>
        <SkeletonScope surface={null}>
          <Card>
            <Spinner ariaLabel={LABEL} />
          </Card>
        </SkeletonScope>
      </PageContent>,
    );

    expect(loader()).toHaveAttribute("data-skeleton", "card");
  });
});

describe("Portée des squelettes — overlays", () => {
  it.each(overlays)(
    "given un %s ouvert depuis une PageContent, when un Spinner medium y est rendu, then il reste un Spinner",
    (_name, overlay) => {
      renderInTheme(<PageContent>{overlay(<Spinner ariaLabel={LABEL} />)}</PageContent>);

      expect(isPlainSpinner(loader())).toBe(true);
    },
  );

  it.each(overlays)(
    "given un %s ouvert depuis une PageContent, when une Card y contient un Spinner, then il devient un squelette de carte",
    (_name, overlay) => {
      renderInTheme(
        <PageContent>
          {overlay(
            <Card>
              <Spinner ariaLabel={LABEL} />
            </Card>,
          )}
        </PageContent>,
      );

      expect(loader()).toHaveAttribute("data-skeleton", "card");
    },
  );
});

describe("Portée des squelettes — footer de PageContent", () => {
  it("given un Spinner dans le footer d'une PageContent, when il est rendu, then il reste un Spinner", () => {
    renderInTheme(
      <PageContent footer={<Spinner ariaLabel={LABEL} />}>
        <p>Contenu</p>
      </PageContent>,
    );

    expect(isPlainSpinner(loader())).toBe(true);
  });
});

describe("Squelette de corps de carte — en-tête de Card", () => {
  it("given une Card avec titre, when son Spinner devient squelette, then il compte moins de barres que sans titre", () => {
    renderInTheme(
      <>
        <Card>
          <Spinner ariaLabel="Sans titre" />
        </Card>
        <Card title="Membres">
          <Spinner ariaLabel="Avec titre" />
        </Card>
      </>,
    );

    const barres = (name: string) =>
      screen.getByRole("progressbar", { name }).querySelectorAll("[data-pulse]").length;
    expect(screen.getByRole("progressbar", { name: "Avec titre" })).toHaveAttribute(
      "data-skeleton",
      "card",
    );
    expect(barres("Avec titre")).toBeLessThan(barres("Sans titre"));
  });
});
