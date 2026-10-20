import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { SaveButton } from "../SaveButton";

const SUCCES = "Modifications enregistrées";
const ECHEC = "L’enregistrement a échoué";

function avecTheme(ui: React.ReactElement) {
  return <CanopThemeProvider>{ui}</CanopThemeProvider>;
}

function renderButton(ui: React.ReactElement) {
  return render(avecTheme(ui));
}

function bouton(nom = "Enregistrer") {
  return screen.getByRole("button", { name: nom });
}

function indicateurDeProgression() {
  return bouton().querySelector('[role="progressbar"]');
}

function sauvegardeSuspendue() {
  const issues: { reussir: () => void; echouer: () => void }[] = [];
  const onSave = vi.fn(
    () =>
      new Promise<void>((resolve, reject) => {
        issues.push({ reussir: () => resolve(), echouer: () => reject(new Error("500")) });
      }),
  );
  return {
    onSave,
    reussir: () => issues.at(-1)?.reussir(),
    echouer: () => issues.at(-1)?.echouer(),
  };
}

async function attendreLeToast(message: string) {
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(message));
}

async function attendreLaFinDuChargement() {
  await waitFor(() => expect(bouton()).not.toHaveAttribute("aria-busy"));
}

async function lancerUneSauvegardeAuClic() {
  const user = userEvent.setup();
  const sauvegarde = sauvegardeSuspendue();
  renderButton(<SaveButton onSave={sauvegarde.onSave} />);
  await user.click(bouton());
  return { user, ...sauvegarde };
}

async function lancerUneSauvegardeAuClavier(touche: string) {
  const user = userEvent.setup();
  const sauvegarde = sauvegardeSuspendue();
  renderButton(<SaveButton onSave={sauvegarde.onSave} />);
  await user.tab();
  await user.keyboard(touche);
  return { user, ...sauvegarde };
}

describe("SaveButton", () => {
  it("porte un nom accessible par defaut", () => {
    renderButton(<SaveButton onSave={() => {}} />);
    expect(bouton()).toBeInTheDocument();
  });

  it("declenche l'enregistrement au clic", async () => {
    const onSave = vi.fn();
    renderButton(<SaveButton onSave={onSave} />);

    await userEvent.click(bouton());

    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("confirme par un toast quand l'enregistrement aboutit", async () => {
    renderButton(<SaveButton onSave={() => Promise.resolve()} />);

    await userEvent.click(bouton());

    expect(await screen.findByRole("status")).toHaveTextContent(SUCCES);
  });

  it("signale l'echec sans laisser croire au succes", async () => {
    renderButton(<SaveButton onSave={() => Promise.reject(new Error("500"))} />);

    await userEvent.click(bouton());

    const toast = await screen.findByRole("status");
    expect(toast).toHaveTextContent(ECHEC);
    expect(toast).not.toHaveTextContent(SUCCES);
  });

  it("laisse le portail imposer ses propres messages", async () => {
    renderButton(<SaveButton onSave={() => Promise.resolve()} successMessage="Devis sauvegardé" />);

    await userEvent.click(bouton());

    expect(await screen.findByRole("status")).toHaveTextContent("Devis sauvegardé");
  });

  it("empeche un second envoi tant que le premier court, sans desactiver le bouton", async () => {
    const { user, onSave, reussir } = await lancerUneSauvegardeAuClic();

    expect(bouton()).not.toBeDisabled();
    expect(bouton()).toHaveAttribute("aria-busy", "true");
    await user.click(bouton());

    reussir();
    await attendreLeToast(SUCCES);
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});

describe("SaveButton — mode chargement pendant la sauvegarde", () => {
  it("given une sauvegarde qui court, when on observe le bouton, then il est en chargement et non desactive", async () => {
    await lancerUneSauvegardeAuClic();

    expect(bouton()).not.toBeDisabled();
    expect(bouton()).toHaveAttribute("aria-busy", "true");
    expect(indicateurDeProgression()).not.toBeNull();
  });

  it("given une sauvegarde lancee au clavier, when elle court, then le bouton est en chargement et non desactive", async () => {
    await lancerUneSauvegardeAuClavier("{Enter}");

    expect(bouton()).not.toBeDisabled();
    expect(bouton()).toHaveAttribute("aria-busy", "true");
    expect(indicateurDeProgression()).not.toBeNull();
  });

  it("given une sauvegarde longue, when du temps passe sans reponse, then le bouton reste en chargement", async () => {
    await lancerUneSauvegardeAuClic();

    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(bouton()).not.toBeDisabled();
    expect(bouton()).toHaveAttribute("aria-busy", "true");
    expect(indicateurDeProgression()).not.toBeNull();
  });

  it("given une sauvegarde qui aboutit, when elle se termine, then le chargement cesse", async () => {
    const { reussir } = await lancerUneSauvegardeAuClic();

    reussir();
    await attendreLeToast(SUCCES);

    await attendreLaFinDuChargement();
    expect(indicateurDeProgression()).toBeNull();
  });

  it("given une sauvegarde qui echoue, when elle se termine, then le chargement cesse", async () => {
    const { echouer } = await lancerUneSauvegardeAuClic();

    echouer();
    await attendreLeToast(ECHEC);

    await attendreLaFinDuChargement();
    expect(indicateurDeProgression()).toBeNull();
  });
});

describe("SaveButton — focus et double soumission pendant la sauvegarde", () => {
  it("given un clic sur le bouton, when la sauvegarde court, then le focus reste sur le bouton qui n'est pas desactive", async () => {
    await lancerUneSauvegardeAuClic();

    expect(bouton()).not.toBeDisabled();
    expect(bouton()).toHaveFocus();
  });

  it("given le bouton atteint au clavier, when on l'active avec Entree, then onSave part et le focus reste sur le bouton", async () => {
    const { onSave } = await lancerUneSauvegardeAuClavier("{Enter}");

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(bouton()).toHaveAttribute("aria-busy", "true");
    expect(bouton()).toHaveFocus();
  });

  it("given le bouton atteint au clavier, when on l'active avec Espace, then onSave part et le focus reste sur le bouton", async () => {
    const { onSave } = await lancerUneSauvegardeAuClavier(" ");

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(bouton()).toHaveAttribute("aria-busy", "true");
    expect(bouton()).toHaveFocus();
  });

  it("given une sauvegarde qui court, when on clique plusieurs fois, then onSave n'est appele qu'une fois", async () => {
    const { user, onSave } = await lancerUneSauvegardeAuClic();

    await user.click(bouton());
    await user.click(bouton());
    await user.dblClick(bouton());

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(bouton()).toHaveFocus();
  });

  it("given une sauvegarde qui court, when on appuie plusieurs fois sur Entree, then onSave n'est appele qu'une fois", async () => {
    const { user, onSave } = await lancerUneSauvegardeAuClavier("{Enter}");

    await user.keyboard("{Enter}{Enter}{Enter}");

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(bouton()).toHaveFocus();
  });

  it("given une sauvegarde qui court, when on appuie plusieurs fois sur Espace, then onSave n'est appele qu'une fois", async () => {
    const { user, onSave } = await lancerUneSauvegardeAuClavier(" ");

    await user.keyboard("   ");

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(bouton()).toHaveFocus();
  });

  it("given une sauvegarde qui court, when on maintient Entree enfoncee, then onSave n'est appele qu'une fois", async () => {
    const { user, onSave } = await lancerUneSauvegardeAuClavier("{Enter}");

    await user.keyboard("{Enter>5/}");

    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("given une sauvegarde qui court, when on mele clics, Entree et Espace, then une seule soumission aboutit", async () => {
    const { user, onSave, reussir } = await lancerUneSauvegardeAuClic();

    await user.keyboard("{Enter}");
    await user.click(bouton());
    await user.keyboard(" ");
    await user.keyboard("{Enter}");
    reussir();
    await attendreLeToast(SUCCES);

    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("given une sauvegarde qui court, when on quitte le bouton puis y revient au clavier, then il est toujours dans l'ordre de tabulation", async () => {
    const user = userEvent.setup();
    const { onSave } = sauvegardeSuspendue();
    renderButton(
      <>
        <button type="button">Avant</button>
        <SaveButton onSave={onSave} />
      </>,
    );
    await user.click(bouton());

    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Avant" })).toHaveFocus();
    await user.tab();

    expect(bouton()).toHaveFocus();
    expect(bouton()).toHaveAttribute("aria-busy", "true");
  });

  it("given une sauvegarde lancee au clavier, when elle aboutit, then le focus reste sur le bouton", async () => {
    const { reussir } = await lancerUneSauvegardeAuClavier("{Enter}");

    reussir();
    await attendreLeToast(SUCCES);
    await attendreLaFinDuChargement();

    expect(bouton()).toHaveFocus();
  });

  it("given une sauvegarde lancee au clavier, when elle echoue, then le focus reste sur le bouton", async () => {
    const { echouer } = await lancerUneSauvegardeAuClavier(" ");

    echouer();
    await attendreLeToast(ECHEC);
    await attendreLaFinDuChargement();

    expect(bouton()).toHaveFocus();
  });

  it("given une sauvegarde lancee au clic, when elle aboutit, then le focus reste sur le bouton", async () => {
    const { reussir } = await lancerUneSauvegardeAuClic();

    reussir();
    await attendreLeToast(SUCCES);
    await attendreLaFinDuChargement();

    expect(bouton()).toHaveFocus();
  });
});

describe("SaveButton — aria-busy", () => {
  it("given le bouton au repos, when il est rendu, then aria-busy est absent", () => {
    renderButton(<SaveButton onSave={() => {}} />);

    expect(bouton()).not.toHaveAttribute("aria-busy");
  });

  it("given une sauvegarde qui court, when on observe le bouton, then aria-busy vaut true", async () => {
    await lancerUneSauvegardeAuClic();

    expect(bouton()).toHaveAttribute("aria-busy", "true");
  });

  it("given une sauvegarde qui aboutit, when elle se termine, then aria-busy disparait", async () => {
    const { reussir } = await lancerUneSauvegardeAuClic();

    reussir();
    await attendreLeToast(SUCCES);

    await attendreLaFinDuChargement();
  });

  it("given une sauvegarde qui echoue, when elle se termine, then aria-busy disparait", async () => {
    const { echouer } = await lancerUneSauvegardeAuClic();

    echouer();
    await attendreLeToast(ECHEC);

    await attendreLaFinDuChargement();
  });

  it("given un onSave synchrone, when on clique, then aria-busy reste absent une fois l'action terminee", async () => {
    renderButton(<SaveButton onSave={() => {}} />);

    await userEvent.click(bouton());
    await attendreLeToast(SUCCES);

    expect(bouton()).not.toHaveAttribute("aria-busy");
  });

  it("given le bouton desactive par le portail, when il est rendu, then aria-busy est absent", () => {
    renderButton(<SaveButton onSave={() => {}} disabled />);

    expect(bouton()).not.toHaveAttribute("aria-busy");
  });
});

describe("SaveButton — nom accessible pendant la sauvegarde", () => {
  it("given une sauvegarde qui court, when on cherche le bouton par son role, then il garde le nom Enregistrer", async () => {
    await lancerUneSauvegardeAuClic();

    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.getByRole("button")).toHaveAccessibleName("Enregistrer");
  });

  it("given un ariaLabel du portail, when la sauvegarde court, then le nom accessible du portail est conserve", async () => {
    const user = userEvent.setup();
    const { onSave } = sauvegardeSuspendue();
    renderButton(<SaveButton onSave={onSave} ariaLabel="Sauvegarder le devis" />);

    await user.click(bouton("Sauvegarder le devis"));

    expect(bouton("Sauvegarder le devis")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button")).toHaveAccessibleName("Sauvegarder le devis");
  });

  it("given une sauvegarde qui aboutit, when elle se termine, then le nom accessible est toujours Enregistrer", async () => {
    const { reussir } = await lancerUneSauvegardeAuClic();

    reussir();
    await attendreLeToast(SUCCES);
    await attendreLaFinDuChargement();

    expect(screen.getByRole("button")).toHaveAccessibleName("Enregistrer");
  });
});

describe("SaveButton — etats hors sauvegarde inchanges", () => {
  it("given le bouton au repos, when il est rendu, then il est actif et sans indicateur de progression", () => {
    renderButton(<SaveButton onSave={() => {}} />);

    expect(bouton()).not.toBeDisabled();
    expect(indicateurDeProgression()).toBeNull();
  });

  it("given une sauvegarde aboutie, when on clique a nouveau, then le bouton est actif et relance onSave", async () => {
    const { user, onSave, reussir } = await lancerUneSauvegardeAuClic();
    reussir();
    await attendreLeToast(SUCCES);
    await attendreLaFinDuChargement();

    expect(bouton()).not.toBeDisabled();
    expect(indicateurDeProgression()).toBeNull();
    await user.click(bouton());

    expect(onSave).toHaveBeenCalledTimes(2);
  });

  it("given une sauvegarde echouee, when on clique a nouveau, then le bouton est actif et relance onSave", async () => {
    const { user, onSave, echouer } = await lancerUneSauvegardeAuClic();
    echouer();
    await attendreLeToast(ECHEC);
    await attendreLaFinDuChargement();

    expect(bouton()).not.toBeDisabled();
    expect(indicateurDeProgression()).toBeNull();
    await user.click(bouton());

    expect(onSave).toHaveBeenCalledTimes(2);
  });

  it("given la prop disabled, when on clique, then le bouton est desactive et onSave n'est pas appele", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onSave = vi.fn();
    renderButton(<SaveButton onSave={onSave} disabled />);

    await user.click(bouton());

    expect(bouton()).toBeDisabled();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("given la prop disabled, when on tente de l'atteindre au clavier puis d'appuyer sur Entree et Espace, then onSave n'est pas appele", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    renderButton(<SaveButton onSave={onSave} disabled />);

    await user.tab();
    await user.keyboard("{Enter} ");

    expect(bouton()).not.toHaveFocus();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("given une sauvegarde qui court, when le portail passe disabled, then le bouton est desactive et refuse tout nouvel envoi", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const { onSave } = sauvegardeSuspendue();
    const { rerender } = renderButton(<SaveButton onSave={onSave} />);
    await user.click(bouton());

    rerender(avecTheme(<SaveButton onSave={onSave} disabled />));
    await user.click(bouton());
    await user.keyboard("{Enter} ");

    expect(bouton()).toBeDisabled();
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("given disabled pendant une sauvegarde, when elle aboutit, then le toast confirme et le bouton reste desactive", async () => {
    const user = userEvent.setup();
    const { onSave, reussir } = sauvegardeSuspendue();
    const { rerender } = renderButton(<SaveButton onSave={onSave} />);
    await user.click(bouton());
    rerender(avecTheme(<SaveButton onSave={onSave} disabled />));

    reussir();
    await attendreLeToast(SUCCES);

    expect(bouton()).toBeDisabled();
  });

  it("given disabled pendant une sauvegarde, when elle echoue, then le toast d'erreur s'affiche et le bouton reste desactive", async () => {
    const user = userEvent.setup();
    const { onSave, echouer } = sauvegardeSuspendue();
    const { rerender } = renderButton(<SaveButton onSave={onSave} />);
    await user.click(bouton());
    rerender(avecTheme(<SaveButton onSave={onSave} disabled />));

    echouer();
    await attendreLeToast(ECHEC);

    expect(bouton()).toBeDisabled();
  });
});
