import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type ReactNode } from "react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import {
  Autocomplete,
  type CanopAutocompleteOption,
  type CanopAutocompleteProps,
} from "../Autocomplete";
import { foldForSearch } from "../../_shared/foldText";

const OPTIONS: CanopAutocompleteOption[] = [
  { value: "21", label: "Côte-d'Or" },
  { value: "29", label: "Finistère" },
  { value: "75", label: "Paris" },
  { value: "13", label: "Bouches-du-Rhône" },
  { value: "42", label: "Saint-Étienne" },
];

const LOIRES: CanopAutocompleteOption[] = [
  { value: "42", label: "Loire" },
  { value: "44", label: "Loire-Atlantique" },
];

function habiller(ui: ReactNode) {
  return (
    <CanopThemeProvider>
      <CanopI18nProvider locale="fr">{ui}</CanopI18nProvider>
    </CanopThemeProvider>
  );
}

function poser(ui: ReactNode) {
  const rendu = render(habiller(ui));
  return { ...rendu, reposer: (suivant: ReactNode) => rendu.rerender(habiller(suivant)) };
}

type ProprietesControle = Partial<Omit<CanopAutocompleteProps, "value">> & { initiale?: string };

function Controle({ onChange, initiale = "", options = OPTIONS, ...rest }: ProprietesControle) {
  const [value, setValue] = useState(initiale);
  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(suivante) => {
        setValue(suivante);
        onChange?.(suivante);
      }}
      label="Département"
      {...rest}
    />
  );
}

function champ(nom = "Département"): HTMLInputElement {
  return screen.getByRole("textbox", { name: nom }) as HTMLInputElement;
}

function texteFantome(): string {
  const input = champ();
  const calque = (input.parentElement as HTMLElement).querySelector<HTMLElement>(
    ":scope > [aria-hidden='true']:not(fieldset)",
  );
  if (!calque) return "";
  const texte = calque.textContent ?? "";
  return texte.startsWith(input.value) ? texte.slice(input.value.length).replace(/Tab$/, "") : "";
}

async function saisir(texte: string, nom?: string) {
  await userEvent.type(champ(nom), texte);
}

function quitterLeChamp() {
  act(() => champ().blur());
}

describe("Autocomplete — AC9 remplacement de la liste", () => {
  it("n'expose ni combobox, ni liste, ni option", async () => {
    poser(<Controle />);

    await saisir("pa");

    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  it("est un champ texte à texte fantôme bâti sur les libellés", async () => {
    poser(<Controle />);

    await saisir("fin");

    expect(champ()).toHaveAttribute("aria-autocomplete", "inline");
    expect(texteFantome()).toBe("istère");
  });

  it("se rabat sur la value d'une option sans libellé", async () => {
    poser(<Controle options={[{ value: "Lyon" }]} />);

    await saisir("ly");

    expect(texteFantome()).toBe("on");
  });
});

describe("Autocomplete — AC10 valeur", () => {
  it("transmet la value de l'option à l'acceptation", async () => {
    const onChange = vi.fn();
    poser(<Controle onChange={onChange} />);

    await saisir("pa");
    await userEvent.keyboard("{Tab}");

    expect(onChange).toHaveBeenLastCalledWith("75");
    expect(champ()).toHaveValue("Paris");
  });

  it("transmet la value quand la saisie normalisée est exactement un libellé", async () => {
    const onChange = vi.fn();
    poser(<Controle onChange={onChange} />);

    await saisir("PARIS");

    expect(onChange).toHaveBeenLastCalledWith("75");
  });

  it("n'appelle onChange que si la value change", async () => {
    const onChange = vi.fn();
    poser(<Controle onChange={onChange} />);

    await saisir("zz");
    expect(onChange).not.toHaveBeenCalled();

    await userEvent.clear(champ());
    await saisir("paris");
    await userEvent.keyboard("{Tab}");

    expect(onChange.mock.calls).toEqual([["75"]]);
  });

  it("affiche le libellé d'une value venue de l'extérieur", () => {
    const { reposer } = poser(
      <Autocomplete options={OPTIONS} value="75" onChange={vi.fn()} label="Département" />,
    );
    expect(champ()).toHaveValue("Paris");

    reposer(<Autocomplete options={OPTIONS} value="21" onChange={vi.fn()} label="Département" />);

    expect(champ()).toHaveValue("Côte-d'Or");
  });

  it("affiche le libellé quand les options arrivent après la value", () => {
    const { reposer } = poser(
      <Autocomplete options={[]} value="29" onChange={vi.fn()} label="Département" />,
    );

    reposer(<Autocomplete options={OPTIONS} value="29" onChange={vi.fn()} label="Département" />);

    expect(champ()).toHaveValue("Finistère");
  });

  it("retrouve le libellé dans une liste reconstruite", () => {
    const { reposer } = poser(
      <Autocomplete options={[...OPTIONS]} value="75" onChange={vi.fn()} label="Département" />,
    );

    reposer(
      <Autocomplete
        options={OPTIONS.map((option) => ({ ...option }))}
        value="75"
        onChange={vi.fn()}
        label="Département"
      />,
    );

    expect(champ()).toHaveValue("Paris");
  });
});

describe("Autocomplete — AC11 correspondance exacte", () => {
  it("retient le libellé exact sans proposer d'option plus longue", async () => {
    const onChange = vi.fn();
    poser(
      <>
        <Controle options={LOIRES} onChange={onChange} />
        <button type="button">Suivant</button>
      </>,
    );

    await saisir("Loire");

    expect(onChange).toHaveBeenLastCalledWith("42");
    expect(texteFantome()).toBe("");
  });

  it("quitte le champ sur Tab sans rien changer", async () => {
    const onChange = vi.fn();
    poser(
      <>
        <Controle options={LOIRES} onChange={onChange} />
        <button type="button">Suivant</button>
      </>,
    );

    await saisir("Loire");
    await userEvent.tab();

    expect(screen.getByRole("button", { name: "Suivant" })).toHaveFocus();
    expect(champ()).toHaveValue("Loire");
    expect(onChange.mock.calls).toEqual([["42"]]);
  });

  it("accepte le fantôme avec Entrée", async () => {
    const onChange = vi.fn();
    poser(<Controle onChange={onChange} />);

    await saisir("pa");
    await userEvent.keyboard("{Enter}");

    expect(onChange).toHaveBeenLastCalledWith("75");
    expect(champ()).toHaveValue("Paris");
  });
});

describe("Autocomplete — AC11 normalisation", () => {
  it.each([
    ["cote", "-d'Or"],
    ["cote ", "d'Or"],
    ["cote d", "'Or"],
  ])("« %s » affiche « %s »", async (saisie, suite) => {
    poser(<Controle />);

    await saisir(saisie);

    expect(texteFantome()).toBe(suite);
  });

  it("donne le libellé exact et sa value à l'acceptation", async () => {
    const onChange = vi.fn();
    poser(<Controle onChange={onChange} />);

    await saisir("cote d");
    await userEvent.keyboard("{Tab}");

    expect(champ()).toHaveValue("Côte-d'Or");
    expect(onChange).toHaveBeenLastCalledWith("21");
  });

  it("ignore les espaces multiples et la ponctuation en trop", async () => {
    const onChange = vi.fn();
    poser(<Controle onChange={onChange} />);

    await saisir("bouches  du   rhone");

    expect(onChange).toHaveBeenLastCalledWith("13");
  });

  it("respecte une normalisation personnalisée", async () => {
    const onChange = vi.fn();
    const normalize = (texte: string) => foldForSearch(texte).replace(/\bst\b/g, "saint");
    poser(<Controle onChange={onChange} normalize={normalize} />);

    await saisir("st");
    expect(texteFantome()).not.toBe("");
    await userEvent.keyboard("{Tab}");

    expect(champ()).toHaveValue("Saint-Étienne");
    expect(onChange).toHaveBeenLastCalledWith("42");
  });

  it("reconnaît une saisie exacte à travers la normalisation personnalisée", async () => {
    const onChange = vi.fn();
    const normalize = (texte: string) => foldForSearch(texte).replace(/\bst\b/g, "saint");
    poser(<Controle onChange={onChange} normalize={normalize} />);

    await saisir("st etienne");

    expect(onChange).toHaveBeenLastCalledWith("42");
  });

  it("ne propose pas un libellé impossible à découper proprement", async () => {
    const aLEnvers = (texte: string) => texte.toLowerCase().split("").reverse().join("");
    poser(<Controle options={[{ value: "75", label: "Paris" }]} normalize={aLEnvers} />);

    await saisir("s");

    expect(texteFantome()).toBe("");
  });
});

describe("Autocomplete — AC12 hors liste", () => {
  it("transmet une value vide pour une saisie hors liste", async () => {
    const onChange = vi.fn();
    poser(<Controle onChange={onChange} initiale="75" />);

    await userEvent.clear(champ());
    await saisir("Atlantide");

    expect(onChange).toHaveBeenLastCalledWith("");
    expect(onChange).not.toHaveBeenCalledWith("Atlantide");
  });

  it("reprend au blur le libellé de la value retenue", async () => {
    const onChange = vi.fn();
    poser(<Autocomplete options={OPTIONS} value="75" onChange={onChange} label="Département" />);

    await userEvent.clear(champ());
    await saisir("Atlantide");
    quitterLeChamp();

    expect(onChange).toHaveBeenCalledWith("");
    expect(champ()).toHaveValue("Paris");
  });

  it("vide le champ au blur quand plus rien n'est retenu", async () => {
    poser(<Controle initiale="75" />);

    await userEvent.clear(champ());
    await saisir("Atlantide");
    quitterLeChamp();

    expect(champ()).toHaveValue("");
  });

  it("transmet le texte brut avec allowFreeText", async () => {
    const onChange = vi.fn();
    poser(<Controle onChange={onChange} allowFreeText />);

    await saisir("Atlantide");
    quitterLeChamp();

    expect(onChange).toHaveBeenLastCalledWith("Atlantide");
    expect(champ()).toHaveValue("Atlantide");
  });
});

describe("Autocomplete — AC13 clearOnSelect", () => {
  it("transmet l'option acceptée puis vide le champ", async () => {
    const onChange = vi.fn();
    poser(<Controle onChange={onChange} clearOnSelect />);

    await saisir("pa");
    await userEvent.keyboard("{Tab}");

    expect(onChange).toHaveBeenLastCalledWith("75");
    expect(champ()).toHaveValue("");
  });

  it("enchaîne les saisies sans émettre de chaîne vide ni de texte libre", async () => {
    const onChange = vi.fn();
    poser(<Controle onChange={onChange} clearOnSelect />);

    await saisir("zz");
    await userEvent.clear(champ());
    await saisir("paris");
    await saisir("cote");
    await userEvent.keyboard("{Tab}");

    expect(onChange.mock.calls).toEqual([["75"], ["21"]]);
    expect(champ()).toHaveValue("");
  });

  it("ne retient pas immédiatement une saisie exacte qu'une autre option prolonge", async () => {
    const onChange = vi.fn();
    poser(<Controle options={LOIRES} onChange={onChange} clearOnSelect />);

    await saisir("loire");

    expect(onChange).not.toHaveBeenCalled();
    expect(champ()).toHaveValue("loire");
  });

  it("retient au blur une saisie exacte qu'une autre option prolonge", async () => {
    const onChange = vi.fn();
    poser(<Controle options={LOIRES} onChange={onChange} clearOnSelect />);

    await saisir("loire");
    quitterLeChamp();

    expect(onChange.mock.calls).toEqual([["42"]]);
    expect(champ()).toHaveValue("");
  });

  it("retient Loire-Atlantique avec Entrée et vide le champ", async () => {
    const onChange = vi.fn();
    poser(<Controle options={LOIRES} onChange={onChange} clearOnSelect />);

    await saisir("loire-a");
    await userEvent.keyboard("{Enter}");

    expect(onChange.mock.calls).toEqual([["44"]]);
    expect(champ()).toHaveValue("");
  });

  it("permet d'atteindre Loire-Atlantique au clavier", async () => {
    const onChange = vi.fn();
    poser(<Controle options={LOIRES} onChange={onChange} clearOnSelect />);

    await saisir("loire-a");
    await userEvent.keyboard("{Tab}");

    expect(onChange.mock.calls).toEqual([["44"]]);
    expect(champ()).toHaveValue("");
  });

  it("ne transmet pas de texte libre même avec allowFreeText", async () => {
    const onChange = vi.fn();
    poser(<Controle onChange={onChange} clearOnSelect allowFreeText />);

    await saisir("Atlantide");

    expect(onChange).not.toHaveBeenCalledWith("Atlantide");
    expect(onChange).not.toHaveBeenCalledWith("");
  });
});

describe("Autocomplete — AC14 props conservées", () => {
  it("se laisse piloter par inputValue et onInputChange", async () => {
    const onInputChange = vi.fn();
    const { reposer } = poser(
      <Controle inputValue="Fi" onInputChange={onInputChange} label="Département" />,
    );
    expect(champ()).toHaveValue("Fi");

    await saisir("n");
    expect(onInputChange).toHaveBeenLastCalledWith("Fin");
    expect(champ()).toHaveValue("Fi");

    reposer(<Controle inputValue="Fin" onInputChange={onInputChange} label="Département" />);
    expect(champ()).toHaveValue("Fin");
    expect(texteFantome()).toBe("istère");
  });

  it("se laisse nommer sans libellé visible", () => {
    poser(
      <Autocomplete
        options={OPTIONS}
        value=""
        onChange={vi.fn()}
        ariaLabel="Choisir un département"
      />,
    );

    expect(champ("Choisir un département")).toBeInTheDocument();
  });

  it("affiche le placeholder et le texte d'aide", () => {
    poser(<Controle placeholder="Tapez un nom" helperText="Un seul département" />);

    expect(champ()).toHaveAttribute("placeholder", "Tapez un nom");
    expect(screen.getByText("Un seul département")).toBeInTheDocument();
  });

  it("affiche l'erreur", () => {
    poser(<Controle error="Département inconnu" />);

    expect(screen.getByText("Département inconnu")).toBeInTheDocument();
    expect(champ()).toHaveAttribute("aria-invalid", "true");
  });

  it("se désactive", () => {
    poser(<Controle disabled />);

    expect(champ()).toBeDisabled();
  });

  it("prend toute la largeur avec fullWidth", () => {
    const { container } = poser(<Controle fullWidth />);

    expect(container.querySelector(".MuiFormControl-root")).toHaveClass("MuiFormControl-fullWidth");
  });

  it("prend le focus au montage avec autoFocus", () => {
    poser(<Controle autoFocus />);

    expect(champ()).toHaveFocus();
  });

  it("applique la petite taille", () => {
    poser(<Controle size="small" />);

    expect(champ().closest(".MuiInputBase-root")).toHaveClass("MuiInputBase-sizeSmall");
  });

  it("accepte maxSuggestions sans effet", async () => {
    poser(<Controle maxSuggestions={0} />);

    await saisir("pa");

    expect(texteFantome()).toBe("ris");
  });
});

describe("Autocomplete — libellés en double", () => {
  it("avertit en développement", () => {
    const avertir = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    poser(
      <Controle
        options={[
          { value: "1", label: "Paris" },
          { value: "2", label: "Paris" },
        ]}
      />,
    );

    expect(avertir).toHaveBeenCalled();
    avertir.mockRestore();
  });
});

describe("Autocomplete — saisie exacte quel que soit l'ordre", () => {
  it("ne propose pas « -Atlantique » même quand l'option longue vient en premier", async () => {
    const onChange = vi.fn();
    poser(<Controle options={[...LOIRES].reverse()} onChange={onChange} />);

    await saisir("Loire");

    expect(onChange).toHaveBeenLastCalledWith("42");
    expect(texteFantome()).toBe("");
  });
});

describe("foldForSearch", () => {
  it("retire accents, casse et séparateurs", () => {
    expect(foldForSearch("Côte-d'Or")).toBe("cote d or");
    expect(foldForSearch("Seine-Saint-Denis")).toBe("seine saint denis");
    expect(foldForSearch("  Val-de-Marne  ")).toBe("val de marne");
  });

  it("garde les chiffres, qui font partie de bien des libellés", () => {
    expect(foldForSearch("Paris 15e")).toBe("paris 15e");
  });
});
