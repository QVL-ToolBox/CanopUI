import { createRef, type ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  CanopI18nProvider,
  CanopThemeProvider,
  Card,
  FROSTED_CARD_LIQUID_GLASS,
  Heading,
  Link,
  Lives,
  Stack,
  Text,
  Toolbar,
  liquidGlassBackdropFilter,
} from "../index";
import { FROSTED_CARD_LIQUID_GLASS as FROSTED_CARD_FROM_MODULE } from "../liquidGlass";
import { racineDeCarte } from "./cardTestKit";
import { declarationsDe, valeurAuPalier, valeurFixe, valeursEmises } from "./cssRules";

const SM_REM = 37.5;
const MD_REM = 64;

function poser(ui: ReactElement) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function valeurSousSm(element: Element, propriete: string): string {
  return valeurAuPalier(element, propriete, 0) || valeurFixe(element, propriete);
}

function valeurAuDela(element: Element, propriete: string, rem: number): string {
  return valeurAuPalier(element, propriete, rem);
}

describe("AC2 Toolbar sous sm", () => {
  function poserToolbar() {
    poser(
      <Toolbar
        ariaLabel="Liste"
        search={{ value: "", onChange: () => undefined, placeholder: "Rechercher" }}
        actions={[{ id: "ajouter", label: "Ajouter", onClick: () => undefined }]}
      />,
    );
    const barre = screen.getByRole("toolbar", { name: "Liste" });
    const recherche = screen
      .getByRole("textbox", { name: "Rechercher" })
      .closest(".MuiFormControl-root") as HTMLElement;
    return { barre, recherche };
  }

  it("passe la barre à la ligne sous sm et la garde sur une ligne au-delà", () => {
    const { barre } = poserToolbar();
    expect(valeurSousSm(barre, "flex-wrap")).toBe("wrap");
    expect(valeurAuDela(barre, "flex-wrap", SM_REM)).toBe("nowrap");
  });

  it("donne toute la largeur à la recherche sous sm pour pousser les actions dessous", () => {
    const { recherche } = poserToolbar();
    expect(valeurSousSm(recherche, "flex")).toMatch(/100%$/);
  });

  it("borne la barre à la largeur de son conteneur", () => {
    const { barre } = poserToolbar();
    expect(valeurFixe(barre, "min-width")).toBe("0px");
  });
});

describe("AC3 troncature", () => {
  it("tronque un Text noWrap sur une ligne avec ellipse", () => {
    poser(<Text noWrap>Une phrase beaucoup trop longue</Text>);
    expect(screen.getByText("Une phrase beaucoup trop longue")).toHaveStyle({
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    });
  });

  it("limite un Text à n lignes avec line-clamp", () => {
    poser(<Text lines={2}>Un paragraphe sur deux lignes</Text>);
    const texte = screen.getByText("Un paragraphe sur deux lignes");
    expect(texte).toHaveStyle({ overflow: "hidden" });
    expect(declarationsDe(texte, "-webkit-line-clamp").map((d) => d.valeur)).toContain("2");
  });

  it("fait primer lines sur noWrap", () => {
    poser(
      <Text noWrap lines={3}>
        Lignes prioritaires
      </Text>,
    );
    const texte = screen.getByText("Lignes prioritaires");
    expect(declarationsDe(texte, "-webkit-line-clamp").map((d) => d.valeur)).toContain("3");
    expect(texte).not.toHaveStyle({ whiteSpace: "nowrap" });
  });

  it("ne tronque pas un Text par défaut", () => {
    poser(<Text>Texte libre</Text>);
    const texte = screen.getByText("Texte libre");
    expect(texte).not.toHaveStyle({ textOverflow: "ellipsis" });
    expect(declarationsDe(texte, "-webkit-line-clamp")).toEqual([]);
  });

  it("tronque un Link noWrap avec une ellipse dans la largeur disponible", () => {
    poser(
      <Link href="/doc" noWrap>
        Un lien beaucoup trop long
      </Link>,
    );
    expect(screen.getByRole("link", { name: "Un lien beaucoup trop long" })).toHaveStyle({
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%",
    });
  });
});

describe("AC4 Heading", () => {
  it("transmet tabIndex au titre", () => {
    poser(
      <Heading level={2} tabIndex={-1}>
        Section
      </Heading>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Section" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("expose le titre via ref pour y déplacer le focus", () => {
    const ref = createRef<HTMLElement>();
    poser(
      <Heading level={1} ref={ref} tabIndex={-1}>
        Page
      </Heading>,
    );
    ref.current?.focus();
    expect(ref.current).toBe(screen.getByRole("heading", { level: 1, name: "Page" }));
    expect(document.activeElement).toBe(ref.current);
  });
});

describe("AC5 Card interactive avec href", () => {
  it("se rend en lien sans rôle bouton", () => {
    poser(
      <Card variant="interactive" title="Versions" href="#/docs/versions">
        Notes
      </Card>,
    );
    const lien = screen.getByRole("link", { name: /Versions/ });
    expect(lien.tagName).toBe("A");
    expect(lien).toHaveAttribute("href", "#/docs/versions");
    expect(lien).not.toHaveAttribute("role", "button");
    expect(screen.queryByRole("button", { name: /Versions/ })).not.toBeInTheDocument();
  });

  it("appelle toujours onClick quand on suit le lien", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    poser(
      <Card variant="interactive" title="Versions" href="#/docs/versions" onClick={onClick}>
        Notes
      </Card>,
    );
    await user.click(screen.getByRole("link", { name: /Versions/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("reste un bouton sans href", () => {
    poser(
      <Card variant="interactive" title="Approbations" onClick={() => undefined}>
        Trois
      </Card>,
    );
    expect(screen.getByRole("button", { name: /Approbations/ })).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it.each(["surface", "frosted", "floating", "stat"] as const)(
    "ignore href sur la variante %s",
    (variant) => {
      const { container } = poser(
        <Card variant={variant} title="Carte" href="#/ailleurs">
          Contenu
        </Card>,
      );
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
      expect(container.querySelector("[href]")).toBeNull();
    },
  );
});

describe("AC6 Lives et Stack", () => {
  it("fait passer les vies à la ligne", () => {
    const { container } = poser(<Lives value={3} max={10} />);
    const conteneurs = Array.from(container.querySelectorAll("*")).filter(
      (element) => getComputedStyle(element).flexWrap === "wrap",
    );
    expect(conteneurs.length).toBeGreaterThan(0);
  });

  it("change de direction selon le point de rupture", () => {
    poser(
      <Stack direction={{ xs: "column", md: "row" }} ariaLabel="Pile">
        <span>A</span>
        <span>B</span>
      </Stack>,
    );
    const pile = screen.getByLabelText("Pile");
    expect(valeurSousSm(pile, "flex-direction")).toBe("column");
    expect(valeurAuDela(pile, "flex-direction", MD_REM)).toBe("row");
  });

  it("change de retour à la ligne selon le point de rupture", () => {
    poser(
      <Stack direction="row" wrap={{ xs: true, md: false }} ariaLabel="Pile">
        <span>A</span>
        <span>B</span>
      </Stack>,
    );
    const pile = screen.getByLabelText("Pile");
    expect(valeurSousSm(pile, "flex-wrap")).toBe("wrap");
    expect(valeurAuDela(pile, "flex-wrap", MD_REM)).toBe("nowrap");
  });

  it("accepte toujours une direction simple", () => {
    poser(
      <Stack direction="row" ariaLabel="Pile">
        <span>A</span>
      </Stack>,
    );
    expect(screen.getByLabelText("Pile")).toHaveStyle({ flexDirection: "row" });
  });
});

describe("AC12 verre liquide de la Card frosted", () => {
  it("expose la même recette par la racine et par le module liquidGlass", () => {
    expect(FROSTED_CARD_FROM_MODULE).toBe(FROSTED_CARD_LIQUID_GLASS);
  });

  it("fige la recette", () => {
    expect(Object.isFrozen(FROSTED_CARD_LIQUID_GLASS)).toBe(true);
  });

  it("a les mêmes valeurs que la Card frosted", () => {
    const { container } = poser(
      <Card variant="frosted" title="Givre">
        Contenu
      </Card>,
    );
    const racine = racineDeCarte(container);
    expect(valeursEmises(racine, "backdrop-filter").at(-1)).toBe(
      liquidGlassBackdropFilter(FROSTED_CARD_LIQUID_GLASS),
    );
  });
});
