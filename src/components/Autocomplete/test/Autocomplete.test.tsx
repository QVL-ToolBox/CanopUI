import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import {
  Autocomplete,
  type CanopAutocompleteOption,
  type CanopAutocompleteProps,
} from "../Autocomplete";
import { foldForSearch } from "../foldForSearch";

const OPTIONS: CanopAutocompleteOption[] = [
  { value: "21", label: "Côte-d'Or" },
  { value: "29", label: "Finistère" },
  { value: "75", label: "Paris" },
  { value: "13", label: "Bouches-du-Rhône" },
  { value: "06", label: "Alpes-Maritimes" },
  { value: "31", label: "Haute-Garonne" },
  { value: "68", label: "Haut-Rhin" },
];

function poser(ui: React.ReactNode, locale: "fr" | "en" = "fr") {
  return render(
    <CanopThemeProvider>
      <CanopI18nProvider locale={locale}>{ui}</CanopI18nProvider>
    </CanopThemeProvider>,
  );
}

type ProprietesControle = Partial<
  Omit<CanopAutocompleteProps, "options" | "value" | "inputValue" | "onInputChange">
>;

function Controle({ onChange, ...rest }: ProprietesControle) {
  const [value, setValue] = useState("");
  const [texte, setTexte] = useState("");
  return (
    <Autocomplete
      options={OPTIONS}
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
      inputValue={texte}
      onInputChange={setTexte}
      label="Département"
      {...rest}
    />
  );
}

describe("Autocomplete", () => {
  it("propose les options qui correspondent à la saisie", async () => {
    poser(<Controle />);

    await userEvent.type(screen.getByRole("combobox", { name: "Département" }), "pari");

    expect(screen.getByRole("option", { name: "Paris" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Finistère" })).not.toBeInTheDocument();
  });

  it("ignore les accents, que le clavier ne facilite pas", async () => {
    poser(<Controle />);

    await userEvent.type(screen.getByRole("combobox", { name: "Département" }), "cote");

    expect(screen.getByRole("option", { name: "Côte-d'Or" })).toBeInTheDocument();
  });

  it("ignore la casse", async () => {
    poser(<Controle />);

    await userEvent.type(screen.getByRole("combobox", { name: "Département" }), "FINIS");

    expect(screen.getByRole("option", { name: "Finistère" })).toBeInTheDocument();
  });

  it("retient la première suggestion sur Entrée", async () => {
    const onChange = vi.fn();
    poser(<Controle onChange={onChange} />);

    await userEvent.type(screen.getByRole("combobox", { name: "Département" }), "cote");
    await userEvent.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledWith("21");
  });

  it("rend la valeur et non le libellé", async () => {
    const onChange = vi.fn();
    poser(<Controle onChange={onChange} />);

    await userEvent.type(screen.getByRole("combobox", { name: "Département" }), "pari");
    await userEvent.click(screen.getByRole("option", { name: "Paris" }));

    expect(onChange).toHaveBeenCalledWith("75");
  });

  it("navigue au clavier dans les suggestions", async () => {
    const onChange = vi.fn();
    poser(<Controle onChange={onChange} />);

    await userEvent.type(screen.getByRole("combobox", { name: "Département" }), "a");
    await userEvent.keyboard("{ArrowDown}{Enter}");

    expect(onChange).toHaveBeenCalled();
  });

  it("dit qu'il n'a rien trouvé", async () => {
    poser(<Controle />);

    await userEvent.type(screen.getByRole("combobox", { name: "Département" }), "zzzz");

    expect(screen.getByText("Aucune correspondance")).toBeInTheDocument();
  });

  it("refuse par défaut une saisie hors liste", async () => {
    const onChange = vi.fn();
    poser(<Controle onChange={onChange} />);

    await userEvent.type(screen.getByRole("combobox", { name: "Département" }), "Atlantide");
    await userEvent.keyboard("{Enter}");

    expect(onChange).not.toHaveBeenCalled();
  });

  it("accepte une saisie libre quand on le lui demande", async () => {
    const onChange = vi.fn();
    poser(<Controle onChange={onChange} allowFreeText />);

    await userEvent.type(screen.getByRole("combobox", { name: "Département" }), "Atlantide");
    await userEvent.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledWith("Atlantide");
  });

  it("plafonne les suggestions quand on le lui demande", async () => {
    poser(<Controle maxSuggestions={2} />);

    await userEvent.type(screen.getByRole("combobox", { name: "Département" }), "e");

    expect(screen.getAllByRole("option").length).toBeLessThanOrEqual(2);
  });

  it("affiche l'erreur qu'on lui passe", () => {
    poser(<Controle error="Département inconnu" />);
    expect(screen.getByText("Département inconnu")).toBeInTheDocument();
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
    expect(screen.getByRole("combobox", { name: "Choisir un département" })).toBeInTheDocument();
  });

  it("retrouve la sélection dans une liste reconstruite", () => {
    const { rerender } = poser(
      <Autocomplete options={[...OPTIONS]} value="75" onChange={vi.fn()} label="Département" />,
    );
    rerender(
      <CanopThemeProvider>
        <CanopI18nProvider locale="fr">
          <Autocomplete
            options={OPTIONS.map((option) => ({ ...option }))}
            value="75"
            onChange={vi.fn()}
            label="Département"
          />
        </CanopI18nProvider>
      </CanopThemeProvider>,
    );

    expect(screen.getByRole("combobox", { name: "Département" })).toHaveValue("Paris");
  });

  it("suit la langue courante", async () => {
    poser(<Controle />, "en");

    await userEvent.type(screen.getByRole("combobox", { name: "Département" }), "zzzz");

    expect(screen.getByText("No match")).toBeInTheDocument();
  });
});

describe("Autocomplete — la normalisation", () => {
  it("ignore les séparateurs, que personne ne tape", async () => {
    poser(<Controle />);

    await userEvent.type(screen.getByRole("combobox", { name: "Département" }), "cote d or");

    expect(screen.getByRole("option", { name: "Côte-d'Or" })).toBeInTheDocument();
  });

  it("ignore aussi les espaces multiples et la ponctuation en trop", async () => {
    poser(<Controle />);

    await userEvent.type(screen.getByRole("combobox", { name: "Département" }), "bouches  du   rh");

    expect(screen.getByRole("option", { name: "Bouches-du-Rhône" })).toBeInTheDocument();
  });

  it("accepte une normalisation maison", async () => {
    const normalize = (texte: string) => foldForSearch(texte).replace(/\bfini\b/g, "finistere");
    poser(<Controle normalize={normalize} />);

    await userEvent.type(screen.getByRole("combobox", { name: "Département" }), "fini");

    expect(screen.getByRole("option", { name: "Finistère" })).toBeInTheDocument();
  });

  it("plafonne toujours les suggestions avec un filtre maison", async () => {
    poser(<Controle normalize={(texte) => texte.toLowerCase()} maxSuggestions={1} />);

    await userEvent.type(screen.getByRole("combobox", { name: "Département" }), "a");

    expect(screen.getAllByRole("option")).toHaveLength(1);
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

describe("Autocomplete — la mise en avant", () => {
  it("retient l'option atteinte à la flèche, et non la première", async () => {
    const onChange = vi.fn();
    poser(<Controle onChange={onChange} />);

    await userEvent.type(screen.getByRole("combobox", { name: "Département" }), "haut");
    await userEvent.keyboard("{ArrowDown}{Enter}");

    expect(onChange).toHaveBeenCalledWith("68");
  });
});
