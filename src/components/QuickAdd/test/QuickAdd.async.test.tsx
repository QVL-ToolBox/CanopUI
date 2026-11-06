import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent, { PointerEventsCheckLevel } from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import {
  laisserPasserLesMicrotaches,
  suivreLesRejetsNonGeres,
} from "../../../test/unhandledRejections";
import { QuickAdd, type CanopQuickAddHandler, type CanopQuickAddOutcome } from "..";

const LABEL = "Ajouter un article";
const SUBMIT = "Ajouter à la liste";

const rejets = suivreLesRejetsNonGeres();

function renderQuickAdd(onAdd: CanopQuickAddHandler, maxLength?: number) {
  const user = userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });
  render(
    <CanopThemeProvider>
      <QuickAdd label={LABEL} submitLabel={SUBMIT} onAdd={onAdd} maxLength={maxLength} />
    </CanopThemeProvider>,
  );
  return {
    user,
    field: screen.getByRole("textbox", { name: LABEL }),
    submit: screen.getByRole("button", { name: SUBMIT }),
  };
}

function deferred() {
  let resolve: (value: CanopQuickAddOutcome) => void = () => undefined;
  let reject: (reason: unknown) => void = () => undefined;
  const promise = new Promise<CanopQuickAddOutcome>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function isBlocked(button: HTMLElement) {
  return button.hasAttribute("disabled") || button.getAttribute("aria-busy") === "true";
}

describe("QuickAdd - onAdd synchrone", () => {
  it("vide le champ et garde le focus quand onAdd ne renvoie rien", async () => {
    const { user, field } = renderQuickAdd(vi.fn());
    await user.click(field);
    await user.keyboard("Beurre{Enter}");
    expect(field).toHaveValue("");
    expect(field).toHaveFocus();
  });

  it("vide le champ quand onAdd renvoie true", async () => {
    const { user, field } = renderQuickAdd(vi.fn(() => true));
    await user.click(field);
    await user.keyboard("Beurre{Enter}");
    expect(field).toHaveValue("");
  });

  it("conserve la saisie et le focus quand onAdd renvoie false", async () => {
    const onAdd = vi.fn(() => false);
    const { user, field } = renderQuickAdd(onAdd);
    await user.click(field);
    await user.keyboard("Beurre{Enter}");
    expect(onAdd).toHaveBeenCalledWith("Beurre");
    expect(field).toHaveValue("Beurre");
    expect(field).toHaveFocus();
  });

  it("conserve la saisie quand onAdd renvoie false au clic sur le bouton", async () => {
    const { user, field, submit } = renderQuickAdd(vi.fn(() => false));
    await user.click(field);
    await user.keyboard("Beurre");
    await user.click(submit);
    expect(field).toHaveValue("Beurre");
  });
});

describe("QuickAdd - onAdd asynchrone en attente", () => {
  it("désactive ou marque occupé le bouton pendant l'attente", async () => {
    const pending = deferred();
    const { user, field, submit } = renderQuickAdd(() => pending.promise);
    await user.click(field);
    await user.keyboard("Beurre{Enter}");
    expect(isBlocked(submit)).toBe(true);
    pending.resolve(undefined);
    await waitFor(() => expect(field).toHaveValue(""));
  });

  it("n'appelle onAdd qu'une fois sur un double Entrée", async () => {
    const pending = deferred();
    const onAdd = vi.fn(() => pending.promise);
    const { user, field } = renderQuickAdd(onAdd);
    await user.click(field);
    await user.keyboard("Beurre{Enter}{Enter}");
    expect(onAdd).toHaveBeenCalledTimes(1);
    pending.resolve(undefined);
    await waitFor(() => expect(field).toHaveValue(""));
  });

  it("n'appelle onAdd qu'une fois sur Entrée puis clic sur le bouton", async () => {
    const pending = deferred();
    const onAdd = vi.fn(() => pending.promise);
    const { user, field, submit } = renderQuickAdd(onAdd);
    await user.click(field);
    await user.keyboard("Beurre{Enter}");
    await user.click(submit);
    expect(onAdd).toHaveBeenCalledTimes(1);
    pending.resolve(undefined);
    await waitFor(() => expect(field).toHaveValue(""));
  });
});

describe("QuickAdd - onAdd asynchrone terminé", () => {
  it("vide le champ quand la promesse est résolue", async () => {
    const { user, field } = renderQuickAdd(() => Promise.resolve());
    await user.click(field);
    await user.keyboard("Beurre{Enter}");
    await waitFor(() => expect(field).toHaveValue(""));
    expect(field).toHaveFocus();
  });

  it("vide le champ quand la promesse est résolue à true", async () => {
    const { user, field } = renderQuickAdd(() => Promise.resolve(true));
    await user.click(field);
    await user.keyboard("Beurre{Enter}");
    await waitFor(() => expect(field).toHaveValue(""));
  });

  it("conserve la saisie et le focus quand la promesse est résolue à false", async () => {
    const { user, field, submit } = renderQuickAdd(() => Promise.resolve(false));
    await user.click(field);
    await user.keyboard("Beurre{Enter}");
    await waitFor(() => expect(isBlocked(submit)).toBe(false));
    expect(field).toHaveValue("Beurre");
    expect(field).toHaveFocus();
  });

  it("conserve la saisie et le focus quand la promesse est rejetée", async () => {
    const { user, field, submit } = renderQuickAdd(() => Promise.reject(new Error("réseau")));
    await user.click(field);
    await user.keyboard("Beurre{Enter}");
    await waitFor(() => expect(isBlocked(submit)).toBe(false));
    expect(field).toHaveValue("Beurre");
    expect(field).toHaveFocus();
  });

  it("ne laisse aucune promesse rejetée non gérée", async () => {
    const { user, field, submit } = renderQuickAdd(() => Promise.reject(new Error("réseau")));
    await user.click(field);
    await user.keyboard("Beurre{Enter}");
    await waitFor(() => expect(isBlocked(submit)).toBe(false));
    await laisserPasserLesMicrotaches();
    expect(rejets).toEqual([]);
  });

  it("permet un nouvel ajout après un rejet", async () => {
    const onAdd = vi
      .fn<CanopQuickAddHandler>()
      .mockRejectedValueOnce(new Error("réseau"))
      .mockResolvedValueOnce(undefined);
    const { user, field, submit } = renderQuickAdd(onAdd);
    await user.click(field);
    await user.keyboard("Beurre{Enter}");
    await waitFor(() => expect(isBlocked(submit)).toBe(false));
    await user.keyboard("{Enter}");
    await waitFor(() => expect(field).toHaveValue(""));
    expect(onAdd).toHaveBeenCalledTimes(2);
  });
});

describe("QuickAdd - attributs", () => {
  it("pose l'attribut maxlength sur l'input", () => {
    const { field } = renderQuickAdd(vi.fn(), 60);
    expect(field).toHaveAttribute("maxlength", "60");
  });

  it("n'en pose aucun sans maxLength", () => {
    const { field } = renderQuickAdd(vi.fn());
    expect(field).not.toHaveAttribute("maxlength");
  });

  it("rend un bouton de type submit", () => {
    const { submit } = renderQuickAdd(vi.fn());
    expect(submit).toHaveAttribute("type", "submit");
  });

  it("place le bouton dans le même formulaire que le champ", () => {
    const { field, submit } = renderQuickAdd(vi.fn());
    const form = field.closest("form");
    expect(form).not.toBeNull();
    expect(submit.closest("form")).toBe(form);
  });
});
