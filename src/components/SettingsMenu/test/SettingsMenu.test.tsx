import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { SettingsMenu } from "../SettingsMenu";

function renderMenu(ui: React.ReactElement) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

describe("SettingsMenu", () => {
  it("affiche un bouton info-lien vers infoHref quand footer et infoHref sont fournis", async () => {
    const user = userEvent.setup();
    renderMenu(<SettingsMenu footer={<span>Mentions legales</span>} infoHref="/cgu" />);
    await user.click(screen.getByLabelText("Ouvrir le menu"));
    const info = await screen.findByRole("link", { name: "Informations légales" });
    expect(info).toBeInTheDocument();
    expect(info).toHaveAttribute("href", "/cgu");
  });

  it("affiche le contenu du footer en pied du menu", async () => {
    const user = userEvent.setup();
    renderMenu(
      <SettingsMenu onLogout={vi.fn()} footer={<span>Mentions legales</span>} infoHref="/cgu" />,
    );
    await user.click(screen.getByLabelText("Ouvrir le menu"));
    const dialog = await screen.findByRole("presentation");
    const footer = within(dialog).getByText("Mentions legales");
    const logout = within(dialog).getByRole("button", { name: "Déconnexion" });
    expect(logout.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("separe le bouton info du reste du menu par un separateur", async () => {
    const user = userEvent.setup();
    renderMenu(<SettingsMenu footer={<span>Mentions legales</span>} infoHref="/cgu" />);
    await user.click(screen.getByLabelText("Ouvrir le menu"));
    const dialog = await screen.findByRole("presentation");
    expect(within(dialog).getByRole("separator")).toBeInTheDocument();
  });

  it("n'affiche pas le bouton info quand infoHref manque mais garde le footer", async () => {
    const user = userEvent.setup();
    renderMenu(<SettingsMenu footer={<span>Mentions legales</span>} />);
    await user.click(screen.getByLabelText("Ouvrir le menu"));
    const dialog = await screen.findByRole("presentation");
    expect(
      within(dialog).queryByRole("link", { name: "Informations légales" }),
    ).not.toBeInTheDocument();
    expect(within(dialog).getByText("Mentions legales")).toBeInTheDocument();
  });

  it("n'affiche pas le bouton info quand footer manque", async () => {
    const user = userEvent.setup();
    renderMenu(<SettingsMenu infoHref="/cgu" />);
    await user.click(screen.getByLabelText("Ouvrir le menu"));
    const dialog = await screen.findByRole("presentation");
    expect(
      within(dialog).queryByRole("link", { name: "Informations légales" }),
    ).not.toBeInTheDocument();
  });

  it("retro-compat: sans footer le menu s'ouvre sans bouton info ni separateur", async () => {
    const user = userEvent.setup();
    renderMenu(<SettingsMenu onLogout={vi.fn()} />);
    await user.click(screen.getByLabelText("Ouvrir le menu"));
    const logout = await screen.findByRole("button", { name: "Déconnexion" });
    const dialog = screen.getByRole("presentation");
    expect(logout).toBeInTheDocument();
    expect(within(dialog).queryByRole("separator")).not.toBeInTheDocument();
  });

  it("annonce l'etat du menu sur son declencheur", async () => {
    const user = userEvent.setup();
    renderMenu(<SettingsMenu onLogout={vi.fn()} />);
    const trigger = screen.getByLabelText("Ouvrir le menu");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("aria-controls");

    await user.click(trigger);
    const panel = await screen.findByRole("dialog", { name: "Ouvrir le menu" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", panel.id);
  });

  it("ferme le menu au clic sur le bouton info", async () => {
    const user = userEvent.setup();
    renderMenu(<SettingsMenu footer={<span>Mentions legales</span>} infoHref="/cgu" />);
    await user.click(screen.getByLabelText("Ouvrir le menu"));
    await user.click(await screen.findByRole("link", { name: "Informations légales" }));
    await vi.waitFor(() => {
      expect(screen.queryByRole("link", { name: "Informations légales" })).not.toBeInTheDocument();
    });
  });
});

describe("SettingsMenu - signalement de bug", () => {
  it("affiche un bouton help vers supportHref", async () => {
    const user = userEvent.setup();
    renderMenu(<SettingsMenu supportHref="/bug" />);

    await user.click(screen.getByLabelText("Ouvrir le menu"));

    expect(screen.getByRole("link", { name: "Signaler un bug" })).toHaveAttribute("href", "/bug");
  });

  it("n'affiche rien quand supportHref manque", async () => {
    const user = userEvent.setup();
    renderMenu(<SettingsMenu />);

    await user.click(screen.getByLabelText("Ouvrir le menu"));

    expect(screen.queryByRole("link", { name: "Signaler un bug" })).not.toBeInTheDocument();
  });

  it("cohabite avec le lien d'informations legales", async () => {
    const user = userEvent.setup();
    renderMenu(
      <SettingsMenu footer={<span>Mentions legales</span>} infoHref="/cgu" supportHref="/bug" />,
    );

    await user.click(screen.getByLabelText("Ouvrir le menu"));

    expect(screen.getByRole("link", { name: "Informations légales" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Signaler un bug" })).toBeInTheDocument();
  });
});
