import { afterEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ButtonBase from "@mui/material/ButtonBase";
import MuiButton from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import Radio from "@mui/material/Radio";
import Switch from "@mui/material/Switch";
import ToggleButton from "@mui/material/ToggleButton";
import { Breadcrumb } from "../../components/Breadcrumb";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { IconActionButton } from "../../components/IconActionButton";
import { Menu } from "../../components/Menu";
import { Pressable } from "../../components/Pressable";
import { SegmentedControl } from "../../components/SegmentedControl";
import { Toast } from "../../components/Toast";
import { Toolbar } from "../../components/Toolbar";
import { derniereValeurEmise } from "../../test/cssRules";
import {
  DECOUPE_PAR_LE_SQUIRCLE,
  ECHELLE_JUSQU_AUX_COINS,
  arrondi,
  arrondiDuRipple,
  decoupeDuRipple,
  decoupeVue,
  echelleDeLOnde,
  estUnSquircle,
  focaliserAuClavier,
  nePorteAucunSquircle,
  ondesDeFocus,
  poserDansLeTheme,
  presser,
  sansEspaces,
  simulerLaModaliteClavier,
} from "../../test/pressEffectKit";

const MODES = ["light", "dark"] as const;
const SQUIRCLE_D_ANCETRE = "polygon(0% 10%, 10% 0%, 100% 0%, 100% 100%, 0% 100%)";

const BOUTONS_MUI_SANS_SQUIRCLE: [string, React.ReactElement][] = [
  ["ButtonBase", <ButtonBase key="b">Base</ButtonBase>],
  ["ListItemButton", <ListItemButton key="l">Ligne</ListItemButton>],
  ["Chip cliquable", <Chip key="c" label="Puce" onClick={() => undefined} />],
  [
    "ToggleButton",
    <ToggleButton key="t" value="v">
      Bascule
    </ToggleButton>,
  ],
  ["CardActionArea", <CardActionArea key="a">Zone</CardActionArea>],
];

function dansUnAncetreSquircle(enfant: React.ReactElement) {
  return (
    <div data-testid="ancetre" style={{ ["--canop-squircle-clip" as string]: SQUIRCLE_D_ANCETRE }}>
      {enfant}
    </div>
  );
}

function boutonBaseDe(ancetre: HTMLElement): HTMLElement {
  return ancetre.querySelector(".MuiButtonBase-root") as HTMLElement;
}

describe("AC1 - regle generale du theme sur chaque ButtonBase", () => {
  it.each(MODES)(
    "given un ancetre qui pose un squircle, when un ButtonBase y est rendu en theme %s, then il n'herite pas de la variable",
    (mode) => {
      poserDansLeTheme(dansUnAncetreSquircle(<ButtonBase>Base</ButtonBase>), mode);
      const ancetre = screen.getByTestId("ancetre");
      expect(decoupeVue(ancetre)).toBe(SQUIRCLE_D_ANCETRE);
      expect(nePorteAucunSquircle(boutonBaseDe(ancetre))).toBe(true);
    },
  );

  it.each(BOUTONS_MUI_SANS_SQUIRCLE)(
    "given un %s sous un ancetre squircle, when il est presse, then son ripple enfant direct est decoupe par la variable remise a zero",
    (_nom, bouton) => {
      poserDansLeTheme(dansUnAncetreSquircle(bouton));
      const element = boutonBaseDe(screen.getByTestId("ancetre"));
      expect(nePorteAucunSquircle(element)).toBe(true);
      expect(decoupeDuRipple(element)).toBe(DECOUPE_PAR_LE_SQUIRCLE);
    },
  );

  it.each(BOUTONS_MUI_SANS_SQUIRCLE)(
    "given un %s sans squircle, when il est presse, then son ripple garde l'arrondi herite de MUI",
    (_nom, bouton) => {
      poserDansLeTheme(dansUnAncetreSquircle(bouton));
      const element = boutonBaseDe(screen.getByTestId("ancetre"));
      expect(arrondiDuRipple(element)).toBe(arrondi(element));
    },
  );

  it("given un ButtonBase qui pose lui-meme son squircle, when il est presse, then son ripple suit exactement ce squircle", () => {
    const squircleDuBouton = "polygon(0% 20%, 20% 0%, 80% 0%, 100% 20%, 100% 100%, 0% 100%)";
    poserDansLeTheme(
      dansUnAncetreSquircle(
        <ButtonBase sx={{ ["--canop-squircle-clip" as string]: squircleDuBouton }}>
          Base
        </ButtonBase>,
      ),
    );
    const element = boutonBaseDe(screen.getByTestId("ancetre"));
    expect(sansEspaces(decoupeVue(element))).toBe(sansEspaces(squircleDuBouton));
    expect(decoupeDuRipple(element)).toBe(DECOUPE_PAR_LE_SQUIRCLE);
  });

  it("given un ButtonBase, when il est presse, then le ripple decoupe est bien son enfant direct", () => {
    poserDansLeTheme(<ButtonBase>Base</ButtonBase>);
    const element = screen.getByRole("button", { name: "Base" });
    expect(presser(element).parentElement).toBe(element);
  });
});

describe("AC3 - IconButton du theme", () => {
  it.each(["small", "medium", "large"] as const)(
    "given un IconButton %s du theme, when il est presse, then son ripple est decoupe par son squircle",
    (size) => {
      poserDansLeTheme(
        <IconButton aria-label="Icone" size={size}>
          i
        </IconButton>,
      );
      const bouton = screen.getByRole("button", { name: "Icone" });
      expect(estUnSquircle(decoupeVue(bouton))).toBe(true);
      expect(decoupeDuRipple(bouton)).toBe(DECOUPE_PAR_LE_SQUIRCLE);
    },
  );

  it.each(MODES)(
    "given un IconButton du theme %s, when il est presse, then l'onde est agrandie d'environ racine de deux",
    async (mode) => {
      poserDansLeTheme(<IconButton aria-label="Icone">i</IconButton>, mode);
      expect(await echelleDeLOnde(screen.getByRole("button", { name: "Icone" }))).toBeCloseTo(
        ECHELLE_JUSQU_AUX_COINS,
        3,
      );
    },
  );

  it("given un IconButton sous un ancetre squircle, when il est rendu, then il garde son propre squircle", () => {
    poserDansLeTheme(dansUnAncetreSquircle(<IconButton aria-label="Icone">i</IconButton>));
    const decoupe = decoupeVue(screen.getByRole("button", { name: "Icone" }));
    expect(estUnSquircle(decoupe)).toBe(true);
    expect(decoupe).not.toBe(SQUIRCLE_D_ANCETRE);
  });
});

describe("AC5 - non-regression : MenuItem dans un Menu squircle", () => {
  function poserLeMenu() {
    poserDansLeTheme(
      <Menu open onClose={() => undefined} ariaLabel="Actions" items={[{ label: "Renommer" }]} />,
    );
    const entree = screen.getByRole("menuitem", { name: "Renommer" });
    const papier = entree.closest(".MuiPaper-root") as HTMLElement;
    return { entree, papier };
  }

  it("given un Menu dont le papier pose un squircle, when l'entree est rendue, then elle ne reprend pas le contour du papier", () => {
    const { entree, papier } = poserLeMenu();
    expect(estUnSquircle(decoupeVue(papier))).toBe(true);
    expect(nePorteAucunSquircle(entree)).toBe(true);
  });

  it("given une entree de Menu, when elle est pressee, then son ripple ne se decoupe sur aucun squircle", () => {
    const { entree } = poserLeMenu();
    expect(decoupeDuRipple(entree)).toBe(DECOUPE_PAR_LE_SQUIRCLE);
    expect(arrondiDuRipple(entree)).toBe(arrondi(entree));
  });
});

describe("AC5 - non-regression : Checkbox, Radio et Switch gardent un halo rond", () => {
  const CONTROLES: [string, React.ReactElement, string][] = [
    ["Checkbox", <Checkbox key="c" />, ".MuiCheckbox-root"],
    ["Radio", <Radio key="r" />, ".MuiRadio-root"],
    ["Switch", <Switch key="s" />, ".MuiSwitch-switchBase"],
  ];

  it.each(
    MODES.flatMap((mode) => CONTROLES.map(([nom, ui, cible]) => [nom, mode, ui, cible] as const)),
  )(
    "given un %s en theme %s sous un ancetre squircle, when il est presse, then son ripple reste rond",
    (_nom, mode, ui, cible) => {
      const { container } = poserDansLeTheme(dansUnAncetreSquircle(ui), mode);
      const controle = container.querySelector(cible) as HTMLElement;
      expect(nePorteAucunSquircle(controle)).toBe(true);
      expect(arrondi(controle)).toBe("50%");
      expect(arrondiDuRipple(controle)).toBe("50%");
    },
  );
});

describe("AC5 - non-regression : focus clavier sans ripple de focus", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const CIBLES: [string, React.ReactElement, string][] = [
    ["Button", <Button key="b">Valider</Button>, "Valider"],
    [
      "IconActionButton",
      <IconActionButton key="i" icon="trash" ariaLabel="Supprimer" />,
      "Supprimer",
    ],
    [
      "IconButton",
      <IconButton key="ib" aria-label="Icone">
        i
      </IconButton>,
      "Icone",
    ],
    [
      "Breadcrumb",
      <Breadcrumb
        key="br"
        items={[
          { id: "a", label: "Accueil", onClick: () => undefined },
          { id: "b", label: "Ici" },
        ]}
      />,
      "Accueil",
    ],
    [
      "Toolbar tri",
      <Toolbar
        key="t"
        sort={{ options: [{ id: "n", label: "Nom" }], value: "n", onChange: () => undefined }}
      />,
      "Trier",
    ],
    [
      "Toast action",
      <Toast
        key="to"
        open
        message="Fait"
        onClose={() => undefined}
        action={{ label: "Annuler", onClick: () => undefined }}
      />,
      "Annuler",
    ],
  ];

  it("given un bouton MUI qui reclame un ripple de focus, when il est focalise au clavier, then le harnais detecte bien l'onde de focus", async () => {
    simulerLaModaliteClavier();
    poserDansLeTheme(<MuiButton disableFocusRipple={false}>Temoin</MuiButton>);
    const temoin = screen.getByRole("button", { name: "Temoin" });
    await focaliserAuClavier(temoin);
    expect(temoin).toHaveClass("Mui-focusVisible");
    expect(ondesDeFocus(temoin)).toBe(1);
  });

  it.each(CIBLES)(
    "given un %s, when il est focalise au clavier, then il est marque focusVisible sans aucune onde de focus",
    async (_nom, ui, nom) => {
      simulerLaModaliteClavier();
      poserDansLeTheme(ui);
      const cible = screen.getByRole("button", { name: nom });
      await focaliserAuClavier(cible);
      expect(cible).toHaveClass("Mui-focusVisible");
      expect(ondesDeFocus(cible)).toBe(0);
    },
  );

  it.each(["Checkbox", "Radio", "Switch"] as const)(
    "given un %s, when il est focalise au clavier, then aucune onde de focus n'apparait",
    async (nom) => {
      simulerLaModaliteClavier();
      const ui = { Checkbox: <Checkbox />, Radio: <Radio />, Switch: <Switch /> }[nom];
      const { container } = poserDansLeTheme(ui);
      const champ = container.querySelector("input") as HTMLElement;
      await focaliserAuClavier(champ);
      expect(ondesDeFocus(container)).toBe(0);
    },
  );

  it("given une option de SegmentedControl, when elle est focalisee au clavier, then aucune onde de focus n'apparait", async () => {
    simulerLaModaliteClavier();
    const { container } = poserDansLeTheme(
      <SegmentedControl
        ariaLabel="Vue"
        options={[
          { value: "a", label: "Alpha" },
          { value: "b", label: "Beta" },
        ]}
        value="a"
        onChange={() => undefined}
      />,
    );
    const option = container.querySelector(".MuiButtonBase-root") as HTMLElement;
    await focaliserAuClavier(option);
    expect(option).toHaveClass("Mui-focusVisible");
    expect(ondesDeFocus(option)).toBe(0);
  });
});

describe("AC5 - non-regression : Pressable, action de Toast et Card interactive", () => {
  it("given un Pressable, when il est presse puis clique, then l'action part et son contour propre reste pose", async () => {
    const onClick = vi.fn();
    poserDansLeTheme(<Pressable ariaLabel="Choisir" onClick={onClick} />);
    const pressable = screen.getByRole("button", { name: "Choisir" });
    await userEvent.click(pressable);
    expect(onClick).toHaveBeenCalledOnce();
    expect(estUnSquircle(derniereValeurEmise(pressable, "clip-path"))).toBe(true);
  });

  it("given l'action d'un Toast, when elle est pressee, then son ripple garde l'arrondi du bouton sans squircle", () => {
    poserDansLeTheme(
      <Toast
        open
        message="Fait"
        onClose={() => undefined}
        action={{ label: "Annuler", onClick: () => undefined }}
      />,
    );
    const action = screen.getByRole("button", { name: "Annuler" });
    expect(nePorteAucunSquircle(action)).toBe(true);
    expect(arrondiDuRipple(action)).toBe(arrondi(action));
  });

  it("given une Card interactive, when elle est cliquee, then l'action part", async () => {
    const onClick = vi.fn();
    const { container } = poserDansLeTheme(
      <Card variant="interactive" title="Carte" onClick={onClick}>
        Contenu
      </Card>,
    );
    await userEvent.click(container.querySelector(".MuiCard-root") as HTMLElement);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("given une Card interactive contenant un Button, when ils sont rendus, then le squircle de la carte ne fuit pas dans le bouton", () => {
    const { container } = poserDansLeTheme(
      <Card
        variant="interactive"
        title="Carte"
        onClick={() => undefined}
        actions={<Button>Ouvrir</Button>}
      >
        Contenu
      </Card>,
    );
    const carte = container.querySelector(".MuiCard-root") as HTMLElement;
    const bouton = screen.getByRole("button", { name: "Ouvrir" });
    expect(decoupeVue(bouton)).not.toBe(decoupeVue(carte));
  });
});
