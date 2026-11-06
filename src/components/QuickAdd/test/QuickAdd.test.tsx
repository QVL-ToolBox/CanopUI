import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent, { PointerEventsCheckLevel } from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { QuickAdd } from "../QuickAdd";

const LABEL = "Ajouter un article";
const SUBMIT = "Ajouter à la liste";

function renderQuickAdd() {
  const onAdd = vi.fn();
  const user = userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });
  render(
    <CanopThemeProvider>
      <QuickAdd label={LABEL} submitLabel={SUBMIT} onAdd={onAdd} />
    </CanopThemeProvider>,
  );
  return {
    onAdd,
    user,
    field: screen.getByRole("textbox", { name: LABEL }),
    submit: screen.getByRole("button", { name: SUBMIT }),
  };
}

describe("QuickAdd - AC1 ajout par Entrée", () => {
  it("transmet la saisie sans ses espaces de bord, vide le champ et garde le focus", async () => {
    const { onAdd, user, field } = renderQuickAdd();
    await user.click(field);
    await user.keyboard("   Beurre doux  {Enter}");
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith("Beurre doux");
    expect(field).toHaveValue("");
    expect(field).toHaveFocus();
  });

  it("permet d'enchaîner deux ajouts sans reprendre le champ", async () => {
    const { onAdd, user, field } = renderQuickAdd();
    await user.click(field);
    await user.keyboard("Lait{Enter}Oeufs{Enter}");
    expect(onAdd.mock.calls).toEqual([["Lait"], ["Oeufs"]]);
  });
});

describe("QuickAdd - AC2 ajout par le bouton", () => {
  it("transmet la saisie sans ses espaces de bord, vide le champ et garde le focus", async () => {
    const { onAdd, user, field, submit } = renderQuickAdd();
    await user.click(field);
    await user.keyboard("  Pain  ");
    await user.click(submit);
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith("Pain");
    expect(field).toHaveValue("");
    expect(field).toHaveFocus();
  });

  it("soumet le formulaire du champ au clic sur le bouton", async () => {
    const { onAdd, user, field, submit } = renderQuickAdd();
    const form = field.closest("form") as HTMLFormElement;
    const onSubmit = vi.fn();
    form.addEventListener("submit", onSubmit);
    await user.click(field);
    await user.keyboard("Pain");
    await user.click(submit);
    expect(submit).toHaveAttribute("type", "submit");
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledTimes(1);
  });
});

describe("QuickAdd - AC3 saisie vide refusée", () => {
  it("rend le bouton inactif tant que rien n'est saisi", () => {
    const { submit } = renderQuickAdd();
    expect(submit).toBeDisabled();
  });

  it("garde le bouton inactif pour une saisie faite d'espaces", async () => {
    const { user, field, submit } = renderQuickAdd();
    await user.click(field);
    await user.keyboard("     ");
    expect(submit).toBeDisabled();
  });

  it("active le bouton dès qu'un caractère utile est saisi", async () => {
    const { user, field, submit } = renderQuickAdd();
    await user.click(field);
    await user.keyboard(" x");
    expect(submit).toBeEnabled();
  });

  it("n'appelle pas onAdd sur Entrée avec un champ vide", async () => {
    const { onAdd, user, field } = renderQuickAdd();
    await user.click(field);
    await user.keyboard("{Enter}");
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("n'appelle pas onAdd sur Entrée avec une saisie faite d'espaces", async () => {
    const { onAdd, user, field } = renderQuickAdd();
    await user.click(field);
    await user.keyboard("    {Enter}");
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("n'appelle pas onAdd au clic sur le bouton avec une saisie faite d'espaces", async () => {
    const { onAdd, user, field, submit } = renderQuickAdd();
    await user.click(field);
    await user.keyboard("   ");
    await user.click(submit);
    expect(onAdd).not.toHaveBeenCalled();
  });
});

describe("QuickAdd - AC4 nom accessible", () => {
  it("expose le label comme nom accessible du champ", () => {
    const { field } = renderQuickAdd();
    expect(field).toHaveAccessibleName(LABEL);
  });
});
