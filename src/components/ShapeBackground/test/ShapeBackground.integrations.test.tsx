import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { PageScaffold } from "../../PageScaffold";
import { Layout } from "../../Layout";
import { EmptyState } from "../../EmptyState";
import type { CanopNavbarItem } from "../../Navbar";
import {
  avancerFrames,
  coucheDecorative,
  installerEnvironnementLave,
  lueurs,
  quitterEnvironnementLave,
  rendreAvecTheme,
  type EnvironnementLave,
} from "./lavaTestKit";

const ITEMS: CanopNavbarItem[] = [{ label: "Dashboard", href: "/dashboard", icon: "apps" }];

let environnement: EnvironnementLave;

function boucleActive(): boolean {
  environnement.visibilite.afficher();
  avancerFrames(environnement.frames, 5);
  return environnement.frames.enAttente() > 0;
}

function expectFondDeLave() {
  const fond = coucheDecorative();
  expect(fond).toHaveAttribute("aria-hidden", "true");
  expect(fond.querySelector("canvas")).not.toBeNull();
  expect(lueurs().length).toBeGreaterThan(0);
}

describe("Fond trame lave — intégrations", () => {
  beforeEach(() => {
    environnement = installerEnvironnementLave();
  });

  afterEach(() => {
    quitterEnvironnementLave();
  });

  it("rend le fond animé dans PageScaffold avec background shapes", async () => {
    rendreAvecTheme(
      <PageScaffold items={ITEMS} background="shapes">
        <p>Contenu</p>
      </PageScaffold>,
    );
    await waitFor(() => expect(document.querySelector("main canvas")).not.toBeNull());
    expectFondDeLave();
    expect(document.querySelector("video")).toBeNull();
    expect(boucleActive()).toBe(true);
    expect(screen.getByText("Contenu")).toBeInTheDocument();
  });

  it("rend le fond dans Layout", () => {
    rendreAvecTheme(<Layout>Contenu</Layout>);
    expectFondDeLave();
    expect(coucheDecorative().closest("main")).not.toBeNull();
  });

  it.each(["light", "dark"] as const)(
    "colore le titre de marque de Layout avec la couleur de texte du thème en mode %s",
    (mode) => {
      rendreAvecTheme(<Layout>Contenu</Layout>, mode);
      const couleur = getComputedStyle(screen.getByRole("heading", { level: 1 })).color;
      expect(couleur).toContain("--canop-palette-text-primary");
      expect(couleur).not.toContain("contrastText");
      expect(couleur).not.toContain("contrast-text");
    },
  );

  it.each([undefined, "ambient", "plain"] as const)(
    "ne rend aucune trame lave dans EmptyState en surface %s",
    (surface) => {
      rendreAvecTheme(<EmptyState title="Aucun fichier" surface={surface} />);
      expect(document.querySelector("canvas")).toBeNull();
      expect(screen.getByRole("heading", { name: "Aucun fichier" })).toBeInTheDocument();
    },
  );
});
