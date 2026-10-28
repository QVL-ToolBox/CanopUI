import type { ReactElement, ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { cleanup, renderHook, screen, within } from "@testing-library/react";
import {
  Button as MuiButton,
  Checkbox as MuiCheckbox,
  Chip,
  CircularProgress,
  LinearProgress,
  MenuItem,
  OutlinedInput,
  Radio,
  Select,
  Slider as MuiSlider,
  Switch,
  Tab,
  Tabs,
  Typography,
  type TypographyProps,
} from "@mui/material";
import {
  Badge,
  Card,
  Heading,
  CanopI18nProvider,
  CanopThemeProvider,
  Checkbox,
  ProgressBar,
  SegmentedControl,
  Slider,
  Toggle,
  useNeonGlow,
} from "../../index";
import type { CanopThemeMode } from "../createCanopTheme";
import { simulerViewport } from "../../test/navbarToneKit";
import {
  VARIABLES_NEON,
  couchesDe,
  dureeEnMs,
  estDeCouleur,
  forceDuHalo,
  halosDuSousArbre,
  keyframesDeclarees,
  proprieteBrute,
  proprieteDansLEtat,
  proprieteResolue,
  rendreNeon,
  variablesNeonSurRoot,
  type EtatNeon,
} from "../../test/neonGlowKit";

const ignorer = () => {};

interface CasLumineux {
  nom: string;
  couleur: string;
  ui: ReactElement;
}

const COMPOSANTS_ALLUMES_AU_REPOS: CasLumineux[] = [
  {
    nom: "Button contained",
    couleur: "secondary",
    ui: (
      <MuiButton variant="contained" color="secondary">
        Valider
      </MuiButton>
    ),
  },
  { nom: "Switch MUI coche", couleur: "secondary", ui: <Switch checked color="secondary" /> },
  {
    nom: "Toggle Canop coche",
    couleur: "success",
    ui: <Toggle checked onChange={ignorer} ariaLabel="Actif" color="success" />,
  },
  {
    nom: "Checkbox MUI cochee",
    couleur: "secondary",
    ui: <MuiCheckbox checked color="secondary" />,
  },
  {
    nom: "Checkbox Canop cochee",
    couleur: "primary",
    ui: <Checkbox checked onChange={ignorer} label="Accepter" />,
  },
  { nom: "Radio coche", couleur: "success", ui: <Radio checked color="success" /> },
  { nom: "Slider MUI", couleur: "secondary", ui: <MuiSlider value={40} color="secondary" /> },
  {
    nom: "Slider Canop",
    couleur: "accent",
    ui: <Slider value={40} onChange={ignorer} ariaLabel="Volume" color="accent" />,
  },
  { nom: "Chip colore", couleur: "success", ui: <Chip label="Livre" color="success" /> },
  {
    nom: "Badge",
    couleur: "secondary",
    ui: (
      <Badge variant="dot" color="secondary">
        <span>Boite</span>
      </Badge>
    ),
  },
  {
    nom: "BadgePill",
    couleur: "success",
    ui: (
      <Badge count={4} color="success">
        <span>Boite</span>
      </Badge>
    ),
  },
  {
    nom: "LinearProgress",
    couleur: "secondary",
    ui: <LinearProgress variant="determinate" value={40} color="secondary" />,
  },
  { nom: "CircularProgress", couleur: "success", ui: <CircularProgress color="success" /> },
  { nom: "ProgressBar", couleur: "accent", ui: <ProgressBar value={40} color="accent" /> },
  {
    nom: "Indicateur des Tabs",
    couleur: "secondary",
    ui: (
      <Tabs value={0} indicatorColor="secondary">
        <Tab label="Un" />
        <Tab label="Deux" />
      </Tabs>
    ),
  },
  {
    nom: "Indicateur actif du SegmentedControl",
    couleur: "primary",
    ui: (
      <SegmentedControl
        value="jour"
        onChange={ignorer}
        ariaLabel="Periode"
        options={[
          { value: "jour", label: "Jour" },
          { value: "semaine", label: "Semaine" },
        ]}
      />
    ),
  },
];

const BOUTONS_ALLUMES_A_L_INTERACTION: CasLumineux[] = [
  {
    nom: "Button outlined",
    couleur: "error",
    ui: (
      <MuiButton variant="outlined" color="error">
        Supprimer
      </MuiButton>
    ),
  },
  {
    nom: "Button text",
    couleur: "success",
    ui: (
      <MuiButton variant="text" color="success">
        Plus tard
      </MuiButton>
    ),
  },
];

const COMPOSANTS_ETEINTS_NON_COCHES: CasLumineux[] = [
  { nom: "Switch MUI non coche", couleur: "secondary", ui: <Switch checked={false} /> },
  {
    nom: "Toggle Canop non coche",
    couleur: "success",
    ui: <Toggle checked={false} onChange={ignorer} ariaLabel="Actif" color="success" />,
  },
  { nom: "Checkbox MUI non cochee", couleur: "secondary", ui: <MuiCheckbox checked={false} /> },
  { nom: "Radio non coche", couleur: "success", ui: <Radio checked={false} /> },
];

const TOUS_LES_CAS = [
  ...COMPOSANTS_ALLUMES_AU_REPOS,
  ...BOUTONS_ALLUMES_A_L_INTERACTION,
  { nom: "OutlinedInput", couleur: "primary", ui: <OutlinedInput /> },
  {
    nom: "Titre h1",
    couleur: "primary",
    ui: <Typography variant="h1">Bonsoir</Typography>,
  },
];

function monter(ui: ReactElement, mode: CanopThemeMode) {
  const { container } = rendreNeon(<div data-testid="scene">{ui}</div>, mode);
  return container.querySelector<HTMLElement>("[data-testid='scene']")!;
}

function premierBouton(scene: HTMLElement): HTMLElement {
  return scene.querySelector<HTMLElement>("button")!;
}

function halosDuBouton(ui: ReactElement, etat: EtatNeon): string[] {
  const scene = monter(ui, "dark");
  return halosDuSousArbre(scene, premierBouton(scene), etat);
}

function toutesDeCouleur(halos: string[], couleur: string): boolean {
  return halos.length > 0 && halos.every((halo) => estDeCouleur(halo, couleur));
}

describe("AC1 - mode clair inchange", () => {
  it("ne pose aucune variable --canop-glow-* sur :root", () => {
    rendreNeon(<span />, "light");
    expect(variablesNeonSurRoot()).toEqual({});
  });

  it.each(TOUS_LES_CAS)("$nom ne recoit aucun halo au repos", ({ ui }) => {
    const scene = monter(ui, "light");
    expect(halosDuSousArbre(scene)).toEqual([]);
  });

  it.each(TOUS_LES_CAS)("$nom ne recoit aucun halo au survol", ({ ui }) => {
    const scene = monter(ui, "light");
    const cible = scene.querySelector<HTMLElement>("button, input, [role='slider']") ?? scene;
    expect(halosDuSousArbre(scene, cible, "survol")).toEqual([]);
  });

  it("ne donne aucun text-shadow aux titres", () => {
    const scene = monter(<Typography variant="h1">Bonsoir</Typography>, "light");
    expect(proprieteBrute(scene.firstElementChild!, ["text-shadow"])).toMatch(/^(|none)$/);
  });
});

describe("AC2 - variables du theme sombre", () => {
  it("pose la recette par defaut validee sur :root", () => {
    rendreNeon(<span />, "dark");
    const variables = variablesNeonSurRoot();
    expect(variables).toMatchObject({
      "--canop-glow-intensity": "1",
      "--canop-glow-core": "0.375rem",
      "--canop-glow-aura": "1.5rem",
      "--canop-glow-alpha": "60%",
    });
    expect(Object.keys(variables)).toEqual(expect.arrayContaining([...VARIABLES_NEON]));
  });

  it("active l'animation par defaut avec une keyframes declaree", () => {
    rendreNeon(<Typography variant="h1">Bonsoir</Typography>, "dark");
    const animation = variablesNeonSurRoot()["--canop-glow-flicker"];
    expect(animation).not.toBe("none");
    expect(keyframesDeclarees()).toContain(animation);
  });
});

describe("AC3 - composants qui s'illuminent en sombre dans la couleur de leur palette", () => {
  it.each(COMPOSANTS_ALLUMES_AU_REPOS)(
    "$nom porte un halo $couleur au repos",
    ({ ui, couleur }) => {
      const scene = monter(ui, "dark");
      expect(toutesDeCouleur(halosDuSousArbre(scene), couleur)).toBe(true);
    },
  );

  it.each(["survol", "focusClavier"] as const)(
    "Button contained brille plus fort en %s qu'au repos",
    (etat) => {
      const ui = (
        <MuiButton variant="contained" color="secondary">
          Valider
        </MuiButton>
      );
      const repos = forceDuHalo(halosDuBouton(ui, "repos"));
      const interaction = halosDuBouton(ui, etat);
      expect(toutesDeCouleur(interaction, "secondary")).toBe(true);
      expect(forceDuHalo(interaction)).toBeGreaterThan(repos);
    },
  );

  it.each(BOUTONS_ALLUMES_A_L_INTERACTION)("$nom n'a aucun halo au repos", ({ ui }) => {
    expect(halosDuBouton(ui, "repos")).toEqual([]);
  });

  it.each(BOUTONS_ALLUMES_A_L_INTERACTION)(
    "$nom n'a aucun halo apres un focus souris",
    ({ ui }) => {
      expect(halosDuBouton(ui, "focusSouris")).toEqual([]);
    },
  );

  it.each(
    BOUTONS_ALLUMES_A_L_INTERACTION.flatMap((cas) =>
      (["survol", "focusClavier"] as const).map((etat) => ({ ...cas, etat })),
    ),
  )("$nom porte un halo $couleur en $etat", ({ ui, couleur, etat }) => {
    expect(toutesDeCouleur(halosDuBouton(ui, etat), couleur)).toBe(true);
  });

  it.each(["contained", "outlined", "text"] as const)(
    "un bouton %s desactive n'a de halo dans aucun etat",
    (variant) => {
      const ui = (
        <MuiButton variant={variant} disabled>
          Indisponible
        </MuiButton>
      );
      for (const etat of ["repos", "survol", "focusClavier"] as const) {
        expect({ etat, halos: halosDuBouton(ui, etat) }).toEqual({ etat, halos: [] });
      }
    },
  );

  it.each(COMPOSANTS_ETEINTS_NON_COCHES)("$nom n'a aucun halo au repos", ({ ui }) => {
    const scene = monter(ui, "dark");
    expect(halosDuSousArbre(scene)).toEqual([]);
  });
});

describe("AC4 - champs", () => {
  function champ(erreur: boolean) {
    const scene = monter(
      <OutlinedInput error={erreur} inputProps={{ "aria-label": "Nom" }} />,
      "dark",
    );
    return { scene, saisie: screen.getByRole("textbox", { name: "Nom" }) };
  }

  it("un champ texte n'a aucun halo au repos", () => {
    const { scene } = champ(false);
    expect(halosDuSousArbre(scene)).toEqual([]);
  });

  it.each([
    [false, "primary"],
    [true, "error"],
  ])("un champ texte (erreur %s) s'illumine en %s au survol", (erreur, couleur) => {
    const { scene, saisie } = champ(erreur);
    expect(toutesDeCouleur(halosDuSousArbre(scene, saisie, "survol"), couleur)).toBe(true);
  });

  it.each(
    [false, true].flatMap((erreur) =>
      (["focusSouris", "focusClavier"] as const).map((etat) => ({ erreur, etat })),
    ),
  )("un champ texte (erreur $erreur) reste au repos en $etat", ({ erreur, etat }) => {
    const { scene, saisie } = champ(erreur);
    expect(halosDuSousArbre(scene, saisie, etat)).toEqual([]);
  });

  it("un champ texte reste au repos apres un focus programmatique", () => {
    const { scene, saisie } = champ(false);
    saisie.focus();
    expect(halosDuSousArbre(scene, saisie, "focusSouris")).toEqual([]);
  });

  it.each([
    [false, "primary"],
    [true, "error"],
  ])("un Select (erreur %s) s'illumine en %s au focus clavier", (erreur, couleur) => {
    const scene = monter(
      <Select
        value="a"
        error={erreur}
        input={<OutlinedInput />}
        inputProps={{ "aria-label": "Choix" }}
      >
        <MenuItem value="a">Alpha</MenuItem>
      </Select>,
      "dark",
    );
    const declencheur = scene.querySelector<HTMLElement>(".MuiSelect-select")!;
    expect(toutesDeCouleur(halosDuSousArbre(scene, declencheur, "focusClavier"), couleur)).toBe(
      true,
    );
  });
});

describe("AC5 - titres", () => {
  function titre(props: TypographyProps) {
    const scene = monter(<Typography {...props}>Bonsoir</Typography>, "dark");
    return scene.firstElementChild!;
  }

  it.each(["h1", "h2", "h3"] as const)(
    "la Typography %s porte un text-shadow multicouche primary",
    (variant) => {
      const ombre = proprieteBrute(titre({ variant }), ["text-shadow"]);
      expect(couchesDe(ombre).length).toBeGreaterThanOrEqual(2);
      expect(couchesDe(ombre).every((couche) => estDeCouleur(couche, "primary"))).toBe(true);
      expect(ombre).toContain("--canop-glow-");
    },
  );

  it.each(["h1", "h2", "h3"] as const)(
    "la Typography %s rendue dans une autre balise garde son neon",
    (variant) => {
      expect(proprieteBrute(titre({ variant, component: "p" }), ["text-shadow"])).toContain(
        "--canop-glow-",
      );
    },
  );

  it.each(["h4", "h5", "h6", "subtitle1", "body1", "body2", "caption", "overline"] as const)(
    "la Typography %s n'a pas de neon",
    (variant) => {
      expect(proprieteBrute(titre({ variant }), ["text-shadow"])).not.toContain("--canop-glow-");
    },
  );

  it.each(["h1", "h2", "h3"] as const)(
    "un variant plus petit rendu en balise %s n'a pas de neon",
    (balise) => {
      expect(
        proprieteBrute(titre({ variant: "h5", component: balise }), ["text-shadow"]),
      ).not.toContain("--canop-glow-");
    },
  );

  function ombreDuHeading(props: { level?: 1 | 2 | 3 | 4; size?: 1 | 2 | 3 | 4 | 5 | 6 }) {
    const scene = monter(<Heading {...props}>Bonsoir</Heading>, "dark");
    return proprieteBrute(scene.querySelector(".MuiTypography-root")!, ["text-shadow"]);
  }

  it.each([1, 2, 3] as const)("un Heading de taille %s porte le neon", (size) => {
    expect(ombreDuHeading({ level: 4, size })).toContain("--canop-glow-");
  });

  it.each([4, 5, 6] as const)("un Heading de taille %s n'a pas de neon", (size) => {
    expect(ombreDuHeading({ level: 1, size })).not.toContain("--canop-glow-");
  });

  it.each([
    [2, true],
    [4, false],
  ] as const)("un Heading de niveau %s sans taille suit son niveau", (level, neon) => {
    expect(ombreDuHeading({ level }).includes("--canop-glow-")).toBe(neon);
  });
});

describe("AC6 - animation neon", () => {
  const ANIMATION = ["animation-name", "animation"] as const;

  function titreSombre(ui: ReactNode = "Bonsoir", variant: TypographyProps["variant"] = "h1") {
    const scene = monter(<Typography variant={variant}>{ui}</Typography>, "dark");
    return scene.firstElementChild!;
  }

  function animationCoupee(element: Element, options = {}) {
    const nom = proprieteResolue(element, ANIMATION, options);
    const duree = dureeEnMs(proprieteResolue(element, ["animation-duration"], options));
    return nom === "" || nom === "none" || duree <= 1;
  }

  it.each(["h1", "h2", "h3"] as const)(
    "la Typography %s joue une fois un gresillement d'environ 520 ms",
    (variant) => {
      const element = titreSombre("Bonsoir", variant);
      expect(keyframesDeclarees()).toContain(proprieteResolue(element, ANIMATION));
      expect(dureeEnMs(proprieteResolue(element, ["animation-duration"]))).toBeGreaterThanOrEqual(
        480,
      );
      expect(dureeEnMs(proprieteResolue(element, ["animation-duration"]))).toBeLessThanOrEqual(560);
      expect(proprieteResolue(element, ["animation-iteration-count"])).toMatch(/^(|1)$/);
    },
  );

  it.each(["h4", "body1"] as const)("la Typography %s ne gresille pas", (variant) => {
    expect(animationCoupee(titreSombre("Bonsoir", variant))).toBe(true);
  });

  it("un variant plus petit rendu en balise h1 ne gresille pas", () => {
    const scene = monter(
      <Typography variant="h5" component="h1">
        Bonsoir
      </Typography>,
      "dark",
    );
    expect(animationCoupee(scene.firstElementChild!)).toBe(true);
  });

  it("est coupee quand --canop-glow-flicker vaut none", () => {
    const { container } = rendreNeon(
      <div style={{ ["--canop-glow-flicker" as string]: "none" }}>
        <Typography variant="h1">Bonsoir</Typography>
      </div>,
      "dark",
    );
    expect(animationCoupee(container.querySelector(".MuiTypography-root")!)).toBe(true);
  });

  it("est coupee sous prefers-reduced-motion", () => {
    simulerViewport((requete) => requete.includes("prefers-reduced-motion"));
    const element = titreSombre();
    expect(animationCoupee(element, { moinsDeMouvement: true })).toBe(true);
  });
});

describe("AC7 - pas de neon sur les cartes", () => {
  function carte(mode: CanopThemeMode) {
    const scene = monter(
      <Card variant="interactive" onClick={ignorer}>
        Revue de sprint
      </Card>,
      mode,
    );
    return { scene, carte: within(scene).getByRole("button") };
  }

  it("garde en sombre l'ombre de survol du theme clair", () => {
    const clair = carte("light");
    const ombresClaires = ["filter", "box-shadow"].map((propriete) =>
      proprieteDansLEtat(clair.carte, "survol", propriete),
    );
    cleanup();
    const sombre = carte("dark");
    const ombresSombres = ["filter", "box-shadow"].map((propriete) =>
      proprieteDansLEtat(sombre.carte, "survol", propriete),
    );
    expect(ombresSombres).toEqual(ombresClaires);
    expect(ombresSombres.join("")).not.toBe("");
  });

  it.each(["repos", "survol", "focusClavier"] as const)(
    "n'a aucun halo neon en sombre en %s",
    (etat) => {
      const { scene, carte: element } = carte("dark");
      expect(halosDuSousArbre(scene, element, etat)).toEqual([]);
    },
  );

  it("ne joue aucune animation neon en sombre", () => {
    const { carte: element } = carte("dark");
    const animation = proprieteResolue(element, ["animation-name", "animation"]);
    expect(keyframesDeclarees()).not.toContain(animation);
  });
});

describe("AC8 - API publique", () => {
  function modeDuHook(mode: CanopThemeMode) {
    return renderHook(() => useNeonGlow(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <CanopI18nProvider locale="fr">
          <CanopThemeProvider mode={mode}>{children}</CanopThemeProvider>
        </CanopI18nProvider>
      ),
    }).result.current;
  }

  it("useNeonGlow renvoie true en sombre", () => {
    expect(modeDuHook("dark")).toBe(true);
  });

  it("useNeonGlow renvoie false en clair", () => {
    expect(modeDuHook("light")).toBe(false);
  });
});
