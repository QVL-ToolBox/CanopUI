import { describe, expect, it } from "vitest";
import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import Popover from "@mui/material/Popover";
import Paper from "@mui/material/Paper";
import { CanopThemeProvider } from "..";
import { createCanopTheme } from "../createCanopTheme";
import { Input } from "../../components/Input";
import { Autocomplete } from "../../components/Autocomplete";
import { Select } from "../../components/Select";
import { MultiSelect } from "../../components/MultiSelect";
import { Toolbar } from "../../components/Toolbar";

type Mode = "light" | "dark";

const MODES: Mode[] = ["light", "dark"];
const SELECTEUR_LABEL_FLOTTANT =
  ":has(.MuiOutlinedInput-notchedOutline legend > span:not(.notranslate))";
const OPTIONS = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];

function rendre(ui: ReactElement, mode: Mode = "light") {
  return render(<CanopThemeProvider mode={mode}>{ui}</CanopThemeProvider>);
}

function racineDuChamp(container: HTMLElement): HTMLElement {
  return container.querySelector(".MuiOutlinedInput-root") as HTMLElement;
}

function toutesLesRegles(): CSSStyleRule[] {
  const regles: CSSStyleRule[] = [];
  for (const feuille of Array.from(document.styleSheets)) {
    for (const regle of Array.from(feuille.cssRules)) {
      if (regle instanceof CSSStyleRule) regles.push(regle);
    }
  }
  return regles;
}

function reglesDe(element: HTMLElement): CSSStyleRule[] {
  const classes = Array.from(element.classList).filter((nom) => nom.startsWith("css-"));
  return toutesLesRegles().filter((regle) =>
    classes.some((nom) => regle.selectorText.includes("." + nom)),
  );
}

function regleCiblant(
  element: HTMLElement,
  predicat: (selecteur: string) => boolean,
): CSSStyleRule[] {
  return reglesDe(element).filter((regle) => predicat(regle.selectorText));
}

function regleFieldsetNotched(racine: HTMLElement): CSSStyleRule | undefined {
  return regleCiblant(
    racine,
    (s) => s.includes(SELECTEUR_LABEL_FLOTTANT) && s.endsWith(") .MuiOutlinedInput-notchedOutline"),
  )[0];
}

function regleAvantMasque(racine: HTMLElement): CSSStyleRule | undefined {
  return regleCiblant(
    racine,
    (s) => s.includes(SELECTEUR_LABEL_FLOTTANT) && s.endsWith("::before"),
  )[0];
}

function traitsDuHaut(racine: HTMLElement): CSSStyleRule[] {
  return regleCiblant(
    racine,
    (s) => s.includes(SELECTEUR_LABEL_FLOTTANT) && s.includes(") .MuiOutlinedInput-notchedOutline"),
  ).filter((regle) => {
    const style = regle.style;
    const bordureHaute =
      style.getPropertyValue("border-style").startsWith("solid") &&
      !/^(0[a-z]*)?$/.test(style.getPropertyValue("border-width").split(/\s+(?![^(]*\))/)[0]) &&
      style.getPropertyValue("border-color").includes("var(--canop-input-outline)");
    const degrade = ["background", "background-image"].some((propriete) =>
      style.getPropertyValue(propriete).includes("var(--canop-input-outline)"),
    );
    return bordureHaute || degrade;
  });
}

function variableOutline(racine: HTMLElement): string {
  return getComputedStyle(racine).getPropertyValue("--canop-input-outline").trim();
}

function valeurOutlineDansRegle(racine: HTMLElement, predicat: (selecteur: string) => boolean) {
  return regleCiblant(racine, predicat)
    .map((regle) => regle.style.getPropertyValue("--canop-input-outline").trim())
    .find((valeur) => valeur !== "");
}

function aUnLabelFlottant(racine: HTMLElement): boolean {
  const span = racine.querySelector(".MuiOutlinedInput-notchedOutline legend > span");
  return span !== null && !span.classList.contains("notranslate");
}

const CHAMPS_A_LABEL_FLOTTANT: Array<[string, ReactElement, string]> = [
  ["Input", <Input label="Nom complet" value="Dupont" onChange={() => {}} />, "Nom complet"],
  [
    "Autocomplete",
    <Autocomplete label="Ville" options={OPTIONS} value="" onChange={() => {}} />,
    "Ville",
  ],
  ["TextField MUI avec label", <TextField label="Commentaire" defaultValue="ok" />, "Commentaire"],
];

const CHAMPS_SANS_LABEL_FLOTTANT: Array<[string, ReactElement]> = [
  ["Select", <Select ariaLabel="Tri" options={OPTIONS} value="a" onChange={() => {}} />],
  ["Select avec label", <Select label="Tri" options={OPTIONS} value="a" onChange={() => {}} />],
  ["MultiSelect", <MultiSelect label="Tags" options={OPTIONS} value={["a"]} onChange={() => {}} />],
  [
    "ToolbarSearch",
    <Toolbar search={{ value: "", onChange: () => {}, placeholder: "Chercher" }} />,
  ],
  ["TextField MUI sans label", <TextField placeholder="Libre" />],
];

describe("AC1 - le label flottant ne peint plus aucun fond", () => {
  it.each(MODES)(
    "le thème %s ne donne ni background ni backgroundImage au MuiInputLabel",
    (mode) => {
      const surcharges = JSON.stringify(createCanopTheme(mode).components?.MuiInputLabel ?? {});
      expect(surcharges).not.toMatch(/background/i);
    },
  );

  it.each(MODES)("le label remonté rendu en %s n'a aucune règle de fond", (mode) => {
    const { container } = rendre(<Input label="Nom" value="Dupont" onChange={() => {}} />, mode);
    const label = container.querySelector("label.MuiInputLabel-shrink") as HTMLElement;
    expect(label).not.toBeNull();
    for (const regle of reglesDe(label)) {
      expect(regle.style.getPropertyValue("background")).toBe("");
      expect(regle.style.getPropertyValue("background-color")).toBe("");
      expect(regle.style.getPropertyValue("background-image")).toBe("");
    }
  });

  it.each(MODES)("le thème %s ne définit plus --canop-input-notch", (mode) => {
    expect(JSON.stringify(createCanopTheme(mode))).not.toContain("--canop-input-notch");
  });

  it.each(MODES)(
    "aucune règle injectée en %s par Paper, Popover, Dialog et champs ne porte --canop-input-notch",
    (mode) => {
      const ancre = document.createElement("div");
      document.body.appendChild(ancre);
      rendre(
        <>
          <Paper>surface</Paper>
          <Popover open anchorEl={ancre}>
            <Input label="Dans popover" value="" onChange={() => {}} />
          </Popover>
          <Dialog open>
            <Input label="Dans dialog" value="" onChange={() => {}} />
          </Dialog>
          <Input label="Nom" value="" onChange={() => {}} />
        </>,
        mode,
      );
      const texte = toutesLesRegles()
        .map((regle) => regle.cssText)
        .join("\n");
      expect(texte).not.toContain("--canop-input-notch");
      for (const element of Array.from(
        document.querySelectorAll<HTMLElement>(".MuiPaper-root, .MuiOutlinedInput-root"),
      )) {
        expect(getComputedStyle(element).getPropertyValue("--canop-input-notch")).toBe("");
      }
      ancre.remove();
    },
  );
});

describe("AC2 - le contour suit l'encoche du label flottant", () => {
  describe.each(MODES)("en mode %s", (mode) => {
    it.each(CHAMPS_A_LABEL_FLOTTANT)(
      "%s : le legend porte le texte du label",
      (_nom, ui, texte) => {
        const racine = racineDuChamp(rendre(ui, mode).container);
        const span = racine.querySelector(
          ".MuiOutlinedInput-notchedOutline legend > span",
        ) as HTMLElement;
        expect(aUnLabelFlottant(racine)).toBe(true);
        expect(racine.matches(SELECTEUR_LABEL_FLOTTANT)).toBe(true);
        expect(span.textContent).toBe(texte);
      },
    );

    it.each(CHAMPS_A_LABEL_FLOTTANT)(
      "%s : le fieldset notched trace seul tout le contour à la couleur du contour, découpé au squircle",
      (_nom, ui) => {
        const racine = racineDuChamp(rendre(ui, mode).container);
        const regle = regleFieldsetNotched(racine);
        expect(regle).toBeDefined();
        expect(regle!.style.getPropertyValue("clip-path")).toMatch(/^polygon\(/);
        expect(traitsDuHaut(racine).length).toBeGreaterThan(0);
        expect(getComputedStyle(racine).getPropertyValue("--canop-squircle-clip")).toContain(
          "polygon(",
        );
      },
    );

    it.each(CHAMPS_A_LABEL_FLOTTANT)("%s : le ::before ne peint plus le contour", (_nom, ui) => {
      const racine = racineDuChamp(rendre(ui, mode).container);
      const regle = regleAvantMasque(racine);
      expect(regle).toBeDefined();
      expect(regle!.style.getPropertyValue("display")).toBe("none");
    });

    it.each(CHAMPS_A_LABEL_FLOTTANT)(
      "%s : le legend garde une marge de fin pour épargner le coin haut-droit",
      (_nom, ui) => {
        const racine = racineDuChamp(rendre(ui, mode).container);
        const espacesDeFin = regleCiblant(
          racine,
          (s) =>
            s.includes(SELECTEUR_LABEL_FLOTTANT) &&
            (s.endsWith(") .MuiOutlinedInput-notchedOutline") || s.endsWith("legend")),
        ).flatMap((regle) => [
          regle.style.getPropertyValue("margin-inline-end"),
          regle.style.getPropertyValue("margin-right"),
          regle.style.getPropertyValue("padding-inline-end"),
          regle.style.getPropertyValue("padding-right"),
          regle.style.getPropertyValue("padding-inline").split(/\s+(?![^(]*\))/)[1] ?? "",
        ]);
        expect(espacesDeFin.some((valeur) => valeur.includes("var(--canop-radius-md)"))).toBe(true);
      },
    );

    it("le label rétracté se place en rem au début de l'encoche", () => {
      const { container } = rendre(<Input label="Nom" value="Dupont" onChange={() => {}} />, mode);
      const label = container.querySelector("label.MuiInputLabel-shrink") as HTMLElement;
      const transformations = reglesDe(label)
        .filter((regle) => regle.selectorText.includes("MuiInputLabel-shrink"))
        .map((regle) => regle.style.getPropertyValue("transform"))
        .filter((valeur) => valeur !== "");
      expect(transformations.length).toBeGreaterThan(0);
      expect(transformations[transformations.length - 1]).toMatch(
        /^translate\(.*rem.*,\s*-0\.5625rem\)\s*scale\(0\.75\)$/,
      );
    });

    it.each(CHAMPS_A_LABEL_FLOTTANT)(
      "%s : le legend est affiché sans largeur figée",
      (_nom, ui) => {
        const racine = racineDuChamp(rendre(ui, mode).container);
        const regles = regleCiblant(
          racine,
          (s) => s.includes(SELECTEUR_LABEL_FLOTTANT) && s.endsWith("legend"),
        );
        expect(regles.length).toBeGreaterThan(0);
        for (const regle of regles) {
          expect(regle.style.getPropertyValue("display")).toBe("block");
          expect(regle.style.getPropertyValue("width")).toBe("");
        }
      },
    );
  });

  it("le legend suit un label plus long", () => {
    const racine = racineDuChamp(
      rendre(<Input label="Adresse de facturation complète" value="" onChange={() => {}} />)
        .container,
    );
    expect(racine.querySelector("legend > span")?.textContent).toBe(
      "Adresse de facturation complète",
    );
  });
});

describe("AC3 - --canop-input-outline suit l'état du champ", () => {
  describe.each(MODES)("en mode %s", (mode) => {
    const palette = createCanopTheme(mode).palette;

    it("au repos vaut primary.main", () => {
      const racine = racineDuChamp(
        rendre(<Input label="Nom" value="" onChange={() => {}} />, mode).container,
      );
      expect(variableOutline(racine).toLowerCase()).toBe(palette.primary.main.toLowerCase());
    });

    it("en erreur vaut error.main", () => {
      const racine = racineDuChamp(
        rendre(<Input label="Nom" value="" error="Obligatoire" onChange={() => {}} />, mode)
          .container,
      );
      expect(racine).toHaveClass("Mui-error");
      expect(variableOutline(racine).toLowerCase()).toBe(palette.error.main.toLowerCase());
    });

    it("désactivé vaut action.disabled", () => {
      const racine = racineDuChamp(
        rendre(<Input label="Nom" value="" disabled onChange={() => {}} />, mode).container,
      );
      expect(racine).toHaveClass("Mui-disabled");
      expect(variableOutline(racine).replace(/\s/g, "")).toBe(
        palette.action.disabled.replace(/\s/g, ""),
      );
    });

    it("au survol vaut primary.dark", () => {
      const racine = racineDuChamp(
        rendre(<Input label="Nom" value="" onChange={() => {}} />, mode).container,
      );
      const valeur = valeurOutlineDansRegle(
        racine,
        (s) => s.includes(":hover") && !s.includes("::before"),
      );
      expect(valeur?.toLowerCase()).toBe(palette.primary.dark.toLowerCase());
    });

    it("au focus clavier du Select vaut primary.dark", () => {
      const racine = racineDuChamp(
        rendre(<Select ariaLabel="Tri" options={OPTIONS} value="a" onChange={() => {}} />, mode)
          .container,
      );
      const valeur = valeurOutlineDansRegle(
        racine,
        (s) => s.includes(".MuiSelect-select:focus-visible") && !s.includes("::before"),
      );
      expect(valeur?.toLowerCase()).toBe(palette.primary.dark.toLowerCase());
    });

    it("le ::before et le fieldset utilisent la même variable dans tous les états", () => {
      const racine = racineDuChamp(
        rendre(<Input label="Nom" value="" onChange={() => {}} />, mode).container,
      );
      const fondsAvant = regleCiblant(racine, (s) => s.endsWith("::before"))
        .map((regle) => regle.style.getPropertyValue("background-color"))
        .filter((valeur) => valeur !== "");
      expect(fondsAvant.length).toBeGreaterThan(0);
      expect(fondsAvant.every((valeur) => valeur === "var(--canop-input-outline)")).toBe(true);
      expect(traitsDuHaut(racine).length).toBeGreaterThan(0);
    });
  });
});

describe("AC4 - les champs sans label flottant gardent leur rendu", () => {
  describe.each(MODES)("en mode %s", (mode) => {
    it.each(CHAMPS_SANS_LABEL_FLOTTANT)("%s : n'a pas de label dans l'encoche", (_nom, ui) => {
      const racine = racineDuChamp(rendre(ui, mode).container);
      expect(racine).not.toBeNull();
      expect(aUnLabelFlottant(racine)).toBe(false);
      expect(racine.matches(SELECTEUR_LABEL_FLOTTANT)).toBe(false);
    });

    it.each(CHAMPS_SANS_LABEL_FLOTTANT)(
      "%s : ni masque ni bordure de fieldset hors du cas label flottant",
      (_nom, ui) => {
        const racine = racineDuChamp(rendre(ui, mode).container);
        const reglesInconditionnelles = reglesDe(racine).filter(
          (regle) => !regle.selectorText.includes(":has(.MuiOutlinedInput-notchedOutline legend"),
        );
        for (const regle of reglesInconditionnelles) {
          expect(regle.style.getPropertyValue("mask-image")).toBe("");
          expect(regle.style.getPropertyValue("clip-path")).not.toBe("var(--canop-squircle-clip)");
        }
        const fieldset = reglesInconditionnelles.filter((regle) =>
          regle.selectorText.endsWith(" .MuiOutlinedInput-notchedOutline"),
        );
        expect(
          fieldset.some((regle) => regle.style.getPropertyValue("border-style") === "solid"),
        ).toBe(false);
      },
    );
  });
});
