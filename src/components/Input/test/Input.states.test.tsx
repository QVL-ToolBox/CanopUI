import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { Input, type CanopInputProps } from "../Input";

type ControlledInputProps = Omit<CanopInputProps, "value" | "onChange"> & {
  initialValue?: string;
  onChange?: (value: string) => void;
};

function ControlledInput({ initialValue = "", onChange, ...props }: ControlledInputProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <Input
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
}

function renderInput(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

function formControlOf(field: HTMLElement): HTMLElement {
  return field.closest(".MuiFormControl-root") as HTMLElement;
}

describe("Input - saisie controlee", () => {
  it("nomme le champ par son libelle", () => {
    renderInput(<Input label="Nom" value="" onChange={() => undefined} />);
    expect(screen.getByRole("textbox", { name: "Nom" })).toBeInTheDocument();
  });

  it("affiche la valeur controlee", () => {
    renderInput(<Input label="Nom" value="Ada" onChange={() => undefined} />);
    expect(screen.getByRole("textbox", { name: "Nom" })).toHaveValue("Ada");
  });

  it("remonte chaque frappe a l'appelant", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderInput(<ControlledInput label="Nom" onChange={onChange} />);
    await user.type(screen.getByRole("textbox", { name: "Nom" }), "Ada");
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith("Ada");
  });
});

describe("Input - types de champ", () => {
  it("rend un champ texte par defaut", () => {
    renderInput(<Input label="Nom" value="" onChange={() => undefined} />);
    expect(screen.getByRole("textbox", { name: "Nom" })).toHaveAttribute("type", "text");
  });

  it("rend un champ numerique en type number", () => {
    renderInput(<Input label="Quantite" type="number" value="" onChange={() => undefined} />);
    expect(screen.getByRole("spinbutton", { name: "Quantite" })).toBeInTheDocument();
  });

  it("rend un champ telephone en type tel", () => {
    renderInput(<Input label="Telephone" type="tel" value="" onChange={() => undefined} />);
    expect(screen.getByRole("textbox", { name: "Telephone" })).toHaveAttribute("type", "tel");
  });

  it("masque la saisie en type password", () => {
    renderInput(<Input label="Secret" type="password" value="" onChange={() => undefined} />);
    expect(screen.getByLabelText("Secret")).toHaveAttribute("type", "password");
  });

  it("permet de reveler puis de remasquer un mot de passe", async () => {
    const user = userEvent.setup();
    renderInput(<Input label="Secret" type="password" value="" onChange={() => undefined} />);
    await user.click(screen.getByRole("button", { name: "Afficher la saisie" }));
    expect(screen.getByLabelText("Secret")).toHaveAttribute("type", "text");
    await user.click(screen.getByRole("button", { name: "Masquer la saisie" }));
    expect(screen.getByLabelText("Secret")).toHaveAttribute("type", "password");
  });

  it("n'ajoute aucun bouton de revelation hors mot de passe", () => {
    renderInput(<Input label="Nom" value="" onChange={() => undefined} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("Input - etats du champ", () => {
  it("affiche le texte d'aide sous le champ", () => {
    renderInput(
      <Input
        label="Pseudo"
        value=""
        onChange={() => undefined}
        helperText="Visible par les autres membres."
      />,
    );
    expect(screen.getByRole("textbox", { name: "Pseudo" })).toHaveAccessibleDescription(
      "Visible par les autres membres.",
    );
  });

  it("remplace le texte d'aide par l'erreur controlee", () => {
    renderInput(
      <Input
        label="Email"
        value=""
        onChange={() => undefined}
        helperText="Visible par les autres membres."
        error="Adresse email invalide."
      />,
    );
    const field = screen.getByRole("textbox", { name: "Email" });
    expect(field).toHaveAccessibleDescription("Adresse email invalide.");
    expect(field).toBeInvalid();
    expect(screen.queryByText("Visible par les autres membres.")).not.toBeInTheDocument();
  });

  it("ne signale aucune erreur quand la prop error vaut null", () => {
    renderInput(<Input label="Email" value="" onChange={() => undefined} error={null} />);
    expect(screen.getByRole("textbox", { name: "Email" })).toBeValid();
  });

  it("marque le champ comme obligatoire", () => {
    renderInput(<Input label="Nom" value="" onChange={() => undefined} required />);
    expect(screen.getByRole("textbox", { name: "Nom" })).toBeRequired();
  });

  it("laisse le champ facultatif par defaut", () => {
    renderInput(<Input label="Nom" value="" onChange={() => undefined} />);
    expect(screen.getByRole("textbox", { name: "Nom" })).not.toBeRequired();
  });

  it("neutralise le champ desactive", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onChange = vi.fn();
    renderInput(
      <ControlledInput
        label="Identifiant"
        initialValue="verrouille"
        disabled
        onChange={onChange}
      />,
    );
    const field = screen.getByRole("textbox", { name: "Identifiant" });
    expect(field).toBeDisabled();
    await user.type(field, "abc");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("place le focus au montage quand autoFocus est demande", () => {
    renderInput(<Input label="Nom" value="" onChange={() => undefined} autoFocus />);
    expect(screen.getByRole("textbox", { name: "Nom" })).toHaveFocus();
  });

  it("laisse le focus ailleurs par defaut", () => {
    renderInput(<Input label="Nom" value="" onChange={() => undefined} />);
    expect(screen.getByRole("textbox", { name: "Nom" })).not.toHaveFocus();
  });

  it("transmet le nom natif, le texte indicatif et l'autocompletion", () => {
    renderInput(
      <Input
        label="Nom"
        value=""
        onChange={() => undefined}
        name="lastName"
        placeholder="Votre nom"
        autoComplete="family-name"
      />,
    );
    const field = screen.getByRole("textbox", { name: "Nom" });
    expect(field).toHaveAttribute("name", "lastName");
    expect(field).toHaveAttribute("placeholder", "Votre nom");
    expect(field).toHaveAttribute("autocomplete", "family-name");
  });

  it("occupe toute la largeur disponible par defaut", () => {
    renderInput(<Input label="Nom" value="" onChange={() => undefined} />);
    expect(formControlOf(screen.getByRole("textbox", { name: "Nom" }))).toHaveClass(
      "MuiFormControl-fullWidth",
    );
  });

  it("s'en tient a sa largeur naturelle quand fullWidth est desactive", () => {
    renderInput(<Input label="Nom" value="" onChange={() => undefined} fullWidth={false} />);
    expect(formControlOf(screen.getByRole("textbox", { name: "Nom" }))).not.toHaveClass(
      "MuiFormControl-fullWidth",
    );
  });

  it("resserre le champ en densite compacte", () => {
    renderInput(<Input label="Nom" value="" onChange={() => undefined} size="small" />);
    const root = screen.getByRole("textbox", { name: "Nom" }).closest(".MuiInputBase-root");
    expect(root).toHaveClass("MuiInputBase-sizeSmall");
  });

  it("n'affiche une icone de tete que lorsqu'elle est demandee", () => {
    const { container, rerender } = renderInput(
      <Input label="Nom" value="" onChange={() => undefined} />,
    );
    expect(container.querySelector(".MuiInputAdornment-positionStart")).toBeNull();
    rerender(
      <CanopThemeProvider>
        <Input label="Nom" value="" onChange={() => undefined} icon="user" />
      </CanopThemeProvider>,
    );
    expect(container.querySelector(".MuiInputAdornment-positionStart")).not.toBeNull();
  });
});

describe("Input - validation par motif", () => {
  const POSTAL_CODE = /^\d{5}$/;

  it("signale au blur une valeur qui ne respecte pas le motif", async () => {
    const user = userEvent.setup();
    renderInput(
      <ControlledInput
        label="Code postal"
        pattern={POSTAL_CODE}
        patternMessage="Cinq chiffres attendus."
      />,
    );
    await user.type(screen.getByRole("textbox", { name: "Code postal" }), "abc");
    await user.tab();
    expect(await screen.findByText("Cinq chiffres attendus.")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Code postal" })).toBeInvalid();
  });

  it("retombe sur un message generique quand patternMessage est absent", async () => {
    const user = userEvent.setup();
    renderInput(<ControlledInput label="Code postal" pattern={POSTAL_CODE} />);
    await user.type(screen.getByRole("textbox", { name: "Code postal" }), "abc");
    await user.tab();
    expect(await screen.findByText("Format invalide.")).toBeInTheDocument();
  });

  it("accepte une valeur conforme au motif", async () => {
    const user = userEvent.setup();
    renderInput(<ControlledInput label="Code postal" pattern={POSTAL_CODE} />);
    await user.type(screen.getByRole("textbox", { name: "Code postal" }), "75001");
    await user.tab();
    expect(screen.queryByText("Format invalide.")).not.toBeInTheDocument();
  });

  it("n'oppose pas le motif a un champ facultatif laisse vide", async () => {
    const user = userEvent.setup();
    renderInput(<ControlledInput label="Code postal" pattern={POSTAL_CODE} />);
    await user.click(screen.getByRole("textbox", { name: "Code postal" }));
    await user.tab();
    expect(screen.queryByText("Format invalide.")).not.toBeInTheDocument();
  });

  it("reclame un champ obligatoire laisse vide", async () => {
    const user = userEvent.setup();
    renderInput(<ControlledInput label="Code postal" pattern={POSTAL_CODE} required />);
    await user.click(screen.getByRole("textbox", { name: "Code postal" }));
    await user.tab();
    expect(await screen.findByText("Ce champ est requis.")).toBeInTheDocument();
  });

  it("refuse une suite d'espaces sur un champ obligatoire", async () => {
    const user = userEvent.setup();
    renderInput(<ControlledInput label="Code postal" pattern={POSTAL_CODE} required />);
    await user.type(screen.getByRole("textbox", { name: "Code postal" }), "   ");
    await user.tab();
    expect(await screen.findByText("Ce champ est requis.")).toBeInTheDocument();
  });

  it("attend la perte de focus avant de signaler une erreur", async () => {
    const user = userEvent.setup();
    renderInput(<ControlledInput label="Code postal" pattern={POSTAL_CODE} />);
    await user.type(screen.getByRole("textbox", { name: "Code postal" }), "abc");
    expect(screen.queryByText("Format invalide.")).not.toBeInTheDocument();
  });

  it("efface l'erreur des que la saisie redevient conforme", async () => {
    const user = userEvent.setup();
    renderInput(<ControlledInput label="Code postal" pattern={POSTAL_CODE} />);
    const field = screen.getByRole("textbox", { name: "Code postal" });
    await user.type(field, "abc");
    await user.tab();
    expect(await screen.findByText("Format invalide.")).toBeInTheDocument();
    await user.clear(field);
    await user.type(field, "75001");
    expect(screen.queryByText("Format invalide.")).not.toBeInTheDocument();
  });

  it("ne signale rien au blur en l'absence de regle de validation", async () => {
    const user = userEvent.setup();
    renderInput(<ControlledInput label="Nom" />);
    await user.click(screen.getByRole("textbox", { name: "Nom" }));
    await user.tab();
    expect(screen.getByRole("textbox", { name: "Nom" })).toBeValid();
  });
});

describe("Input - validation personnalisee", () => {
  it("prend le pas sur le motif", async () => {
    const user = userEvent.setup();
    renderInput(
      <ControlledInput
        label="Code postal"
        pattern={/^\d{5}$/}
        patternMessage="Cinq chiffres attendus."
        validate={() => "Code interdit."}
      />,
    );
    await user.type(screen.getByRole("textbox", { name: "Code postal" }), "75001");
    await user.tab();
    expect(await screen.findByText("Code interdit.")).toBeInTheDocument();
    expect(screen.queryByText("Cinq chiffres attendus.")).not.toBeInTheDocument();
  });

  it("recoit la valeur saisie", async () => {
    const user = userEvent.setup();
    const validate = vi.fn<(value: string) => string | null>(() => null);
    renderInput(<ControlledInput label="Nom" validate={validate} />);
    await user.type(screen.getByRole("textbox", { name: "Nom" }), "Ada");
    await user.tab();
    expect(validate).toHaveBeenCalledWith("Ada");
  });

  it("laisse le champ valide quand elle ne renvoie aucune erreur", async () => {
    const user = userEvent.setup();
    renderInput(<ControlledInput label="Nom" validate={() => null} />);
    await user.type(screen.getByRole("textbox", { name: "Nom" }), "Ada");
    await user.tab();
    expect(screen.getByRole("textbox", { name: "Nom" })).toBeValid();
  });

  it("conserve l'erreur controlee malgre une validation locale reussie", async () => {
    const user = userEvent.setup();
    renderInput(<ControlledInput label="Nom" error="Nom deja utilise." validate={() => null} />);
    await user.type(screen.getByRole("textbox", { name: "Nom" }), "Ada");
    await user.tab();
    expect(screen.getByText("Nom deja utilise.")).toBeInTheDocument();
  });
});
