import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import {
  laisserPasserLesMicrotaches,
  suivreLesRejetsNonGeres,
} from "../../../test/unhandledRejections";
import { DeleteButton } from "../DeleteButton";

const TRIGGER = "Supprimer l'élément";
const CONFIRM = "Supprimer";
const DEFAULT_ERROR = "La suppression a échoué. Réessayez.";

const rejets = suivreLesRejetsNonGeres();

function renderDeleteButton(onConfirm: () => void | Promise<void>, errorMessage?: string) {
  render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>
        <DeleteButton ariaLabel={TRIGGER} onConfirm={onConfirm} errorMessage={errorMessage} />
      </CanopThemeProvider>
    </CanopI18nProvider>,
  );
  return userEvent.setup();
}

async function openAndConfirm(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: TRIGGER }));
  await user.click(screen.getByRole("button", { name: CONFIRM }));
}

describe("DeleteButton - échec de onConfirm", () => {
  it("garde la dialog ouverte et affiche le message par défaut en role alert", async () => {
    const user = renderDeleteButton(() => Promise.reject(new Error("réseau")));
    await openAndConfirm(user);
    expect(await screen.findByRole("alert")).toHaveTextContent(DEFAULT_ERROR);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("affiche errorMessage quand il est fourni", async () => {
    const user = renderDeleteButton(
      () => Promise.reject(new Error("réseau")),
      "Article introuvable.",
    );
    await openAndConfirm(user);
    expect(await screen.findByRole("alert")).toHaveTextContent("Article introuvable.");
  });

  it("réactive le bouton de confirmation", async () => {
    const user = renderDeleteButton(() => Promise.reject(new Error("réseau")));
    await openAndConfirm(user);
    await screen.findByRole("alert");
    await waitFor(() => expect(screen.getByRole("button", { name: CONFIRM })).toBeEnabled());
  });

  it("ne laisse aucune promesse rejetée non gérée", async () => {
    const user = renderDeleteButton(() => Promise.reject(new Error("réseau")));
    await openAndConfirm(user);
    await screen.findByRole("alert");
    await laisserPasserLesMicrotaches();
    expect(rejets).toEqual([]);
  });

  it("efface l'erreur à la réouverture", async () => {
    const user = renderDeleteButton(() => Promise.reject(new Error("réseau")));
    await openAndConfirm(user);
    await screen.findByRole("alert");
    await user.click(screen.getByRole("button", { name: "Annuler" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: TRIGGER }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("permet de réessayer avec succès après un échec", async () => {
    const onConfirm = vi
      .fn<() => Promise<void>>()
      .mockRejectedValueOnce(new Error("réseau"))
      .mockResolvedValueOnce(undefined);
    const user = renderDeleteButton(onConfirm);
    await openAndConfirm(user);
    await screen.findByRole("alert");
    await waitFor(() => expect(screen.getByRole("button", { name: CONFIRM })).toBeEnabled());
    await user.click(screen.getByRole("button", { name: CONFIRM }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(onConfirm).toHaveBeenCalledTimes(2);
  });
});

describe("DeleteButton - succès de onConfirm", () => {
  it("ferme la dialog après une promesse résolue", async () => {
    const user = renderDeleteButton(() => Promise.resolve());
    await openAndConfirm(user);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("ferme la dialog après un onConfirm synchrone", async () => {
    const user = renderDeleteButton(() => undefined);
    await openAndConfirm(user);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
