import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import Box from "@mui/material/Box";
import {
  Breadcrumb,
  Button,
  Card,
  CanopI18nProvider,
  CanopThemeProvider,
  Checkbox,
  DataTable,
  IconActionButton,
  InlineInput,
  Input,
  Link,
  Navbar,
  Pressable,
  SegmentedControl,
  ThemeToggle,
  Toast,
  Toggle,
} from "../../index";
import { renduDansLEtat } from "../../test/stateCascade";

type Mode = "light" | "dark";

interface CasComposant {
  nom: string;
  rendu: ReactElement;
  cible: () => HTMLElement;
  racine?: (cible: HTMLElement) => Element;
}

interface LigneTableau {
  id: string;
  nom: string;
}

const colonnesTriables = [
  {
    key: "nom" as const,
    header: "Nom",
    sortable: true,
    sortValue: (ligne: LigneTableau) => ligne.nom,
  },
];

const avecHover: CasComposant[] = [
  {
    nom: "Button",
    rendu: <Button>Valider</Button>,
    cible: () => screen.getByRole("button", { name: "Valider" }),
  },
  {
    nom: "IconActionButton",
    rendu: <IconActionButton icon="download" ariaLabel="Télécharger" />,
    cible: () => screen.getByRole("button", { name: "Télécharger" }),
  },
  {
    nom: "Card interactive",
    rendu: (
      <Card variant="interactive" onClick={() => undefined}>
        Carte
      </Card>
    ),
    cible: () => screen.getByRole("button", { name: "Carte" }),
  },
  {
    nom: "Breadcrumb",
    rendu: (
      <Breadcrumb
        items={[
          { id: "accueil", label: "Accueil", onClick: () => undefined },
          { id: "page", label: "Page" },
        ]}
      />
    ),
    cible: () => screen.getByRole("button", { name: "Accueil" }),
  },
  {
    nom: "SegmentedControl",
    rendu: (
      <SegmentedControl
        options={[
          { value: "grille", label: "Grille" },
          { value: "liste", label: "Liste" },
        ]}
        value="grille"
        onChange={() => undefined}
        ariaLabel="Affichage"
      />
    ),
    cible: () => screen.getByRole("radio", { name: "Liste" }),
  },
  {
    nom: "NavbarLink",
    rendu: <Navbar items={[{ label: "Tableau", href: "/tableau", icon: "apps" }]}>Contenu</Navbar>,
    cible: () => screen.getByRole("link", { name: "Tableau" }),
  },
  {
    nom: "ToastActionButton",
    rendu: (
      <Toast
        open
        message="Enregistré"
        onClose={() => undefined}
        action={{ label: "Annuler", onClick: () => undefined }}
      />
    ),
    cible: () => screen.getByRole("button", { name: "Annuler" }),
  },
  {
    nom: "DataTable",
    rendu: (
      <DataTable
        columns={colonnesTriables}
        rows={[{ id: "1", nom: "Alice" }]}
        getRowKey={(ligne) => ligne.id}
      />
    ),
    cible: () => screen.getByRole("button", { name: /Nom/ }),
  },
  {
    nom: "Link",
    rendu: <Link href="https://example.com">Exemple</Link>,
    cible: () => screen.getByRole("link", { name: "Exemple" }),
  },
  {
    nom: "Checkbox",
    rendu: <Checkbox checked={false} onChange={() => undefined} label="Accepter" />,
    cible: () => screen.getByRole("checkbox", { name: "Accepter" }),
    racine: (cible) => cible.closest("label") ?? cible,
  },
];

const sansHover: CasComposant[] = [
  {
    nom: "ThemeToggle",
    rendu: <ThemeToggle />,
    cible: () => screen.getByRole("switch", { name: "Thème" }),
  },
  {
    nom: "Toggle",
    rendu: <Toggle checked={false} onChange={() => undefined} ariaLabel="Activer" />,
    cible: () => screen.getByRole("switch", { name: "Activer" }),
  },
  {
    nom: "Pressable",
    rendu: <Pressable onClick={() => undefined} ariaLabel="Choisir" />,
    cible: () => screen.getByRole("button", { name: "Choisir" }),
  },
];

const champsDeSaisie: CasComposant[] = [
  {
    nom: "InlineInput",
    rendu: (
      <InlineInput
        value="rapport"
        onChange={() => undefined}
        onCommit={() => undefined}
        onCancel={() => undefined}
        ariaLabel="Nom du fichier"
      />
    ),
    cible: () => screen.getByRole("textbox", { name: "Nom du fichier" }),
  },
  {
    nom: "OutlinedInput et FormLabel",
    rendu: <Input label="Ville" value="Lyon" onChange={() => undefined} />,
    cible: () => screen.getByRole("textbox", { name: "Ville" }),
    racine: (cible) => cible.closest(".MuiFormControl-root") ?? cible,
  },
];

const MODES: Mode[] = ["light", "dark"];

function croiserAvecModes(cas: CasComposant[]): [string, Mode, CasComposant][] {
  return cas.flatMap((unCas) =>
    MODES.map((mode) => [unCas.nom, mode, unCas] as [string, Mode, CasComposant]),
  );
}

function poser(cas: CasComposant, mode: Mode) {
  render(
    <CanopI18nProvider locale="fr" messages={{ fr: {}, en: {} }}>
      <CanopThemeProvider mode={mode}>{cas.rendu}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
  const cible = cas.cible();
  return { cible, racine: cas.racine?.(cible) ?? cible };
}

describe("AC1 - aucun style propre au focus souris ou programmatique", () => {
  it.each(croiserAvecModes([...avecHover, ...sansHover, ...champsDeSaisie]))(
    "etant donne %s en mode %s, quand il recoit le focus sans clavier, alors son rendu reste celui du repos",
    (_nom, mode, cas) => {
      const { cible, racine } = poser(cas, mode);

      const auRepos = renduDansLEtat(cible, racine, "repos");
      const auFocusSouris = renduDansLEtat(cible, racine, "focusSouris");

      expect(auFocusSouris).toEqual(auRepos);
    },
  );
});

describe("AC2 - le focus clavier reprend exactement le survol", () => {
  it.each(croiserAvecModes(avecHover))(
    "etant donne %s en mode %s, quand il recoit le focus clavier, alors il prend les valeurs de son survol",
    (_nom, mode, cas) => {
      const { cible, racine } = poser(cas, mode);

      const auSurvol = renduDansLEtat(cible, racine, "survol");
      const auFocusClavier = renduDansLEtat(cible, racine, "focusClavier");

      expect(auFocusClavier).toEqual(auSurvol);
    },
  );

  it.each(croiserAvecModes(avecHover))(
    "etant donne %s en mode %s, quand il est survole, alors son rendu change bien par rapport au repos",
    (_nom, mode, cas) => {
      const { cible, racine } = poser(cas, mode);

      expect(renduDansLEtat(cible, racine, "survol")).not.toEqual(
        renduDansLEtat(cible, racine, "repos"),
      );
    },
  );

  it.each(croiserAvecModes(sansHover))(
    "etant donne %s sans survol en mode %s, quand il recoit le focus clavier, alors il ne recoit rien",
    (_nom, mode, cas) => {
      const { cible, racine } = poser(cas, mode);

      expect(renduDansLEtat(cible, racine, "focusClavier")).toEqual(
        renduDansLEtat(cible, racine, "repos"),
      );
    },
  );
});

describe("Controle de la mesure - elle detecte un style de focus fautif", () => {
  function poserBoiteFautive() {
    render(
      <CanopThemeProvider>
        <Box
          component="button"
          sx={{
            "&:focus": { outline: "0.125rem solid rgb(255, 0, 0)" },
            "&:hover": { backgroundColor: "rgb(0, 0, 255)" },
          }}
        >
          Fautif
        </Box>
      </CanopThemeProvider>,
    );
    return screen.getByRole("button", { name: "Fautif" });
  }

  it("signale un anneau pose au focus souris", () => {
    const cible = poserBoiteFautive();

    expect(renduDansLEtat(cible, cible, "focusSouris")).not.toEqual(
      renduDansLEtat(cible, cible, "repos"),
    );
  });

  it("signale un focus clavier qui ne reprend pas le survol", () => {
    const cible = poserBoiteFautive();

    expect(renduDansLEtat(cible, cible, "focusClavier")).not.toEqual(
      renduDansLEtat(cible, cible, "survol"),
    );
  });
});
