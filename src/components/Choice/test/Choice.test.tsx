import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { Choice } from "../Choice";

function poser(ui: React.ReactNode, locale: "fr" | "en" = "fr") {
  return render(
    <CanopThemeProvider>
      <CanopI18nProvider locale={locale}>{ui}</CanopI18nProvider>
    </CanopThemeProvider>,
  );
}

describe("Choice", () => {
  it("rend ce qu'on lui donne", () => {
    poser(<Choice>Finistère</Choice>);
    expect(screen.getByText("Finistère")).toBeInTheDocument();
  });

  it("ne marque rien tant que la question n'est pas tranchée", () => {
    poser(<Choice>Finistère</Choice>);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("ne porte pas l'état par la seule couleur", () => {
    poser(<Choice state="correct">Finistère</Choice>);
    expect(screen.getByRole("img", { name: "Bonne réponse" })).toBeInTheDocument();
  });

  it("marque aussi la réponse choisie à tort", () => {
    poser(<Choice state="incorrect">Morbihan</Choice>);
    expect(screen.getByRole("img", { name: "Mauvaise réponse" })).toBeInTheDocument();
  });

  it("répond au clic", async () => {
    const onClick = vi.fn();
    poser(<Choice onClick={onClick}>Finistère</Choice>);

    await userEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("se tait quand il est désactivé", () => {
    const onClick = vi.fn();
    poser(
      <Choice onClick={onClick} disabled>
        Finistère
      </Choice>,
    );

    expect(screen.getByRole("button")).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("reste atteignable au clavier", async () => {
    const onClick = vi.fn();
    poser(<Choice onClick={onClick}>Finistère</Choice>);

    await userEvent.tab();
    await userEvent.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalled();
  });

  it("accepte un nom accessible imposé", () => {
    poser(<Choice ariaLabel="Répondre Finistère">Finistère</Choice>);
    expect(screen.getByRole("button", { name: "Répondre Finistère" })).toBeInTheDocument();
  });

  it("suit la langue courante", () => {
    poser(<Choice state="correct">Finistère</Choice>, "en");
    expect(screen.getByRole("img", { name: "Correct answer" })).toBeInTheDocument();
  });

  it("reste pleinement lisible une fois verrouillé sur son verdict", () => {
    poser(
      <Choice state="correct" disabled>
        Finistère
      </Choice>,
    );

    expect(getComputedStyle(screen.getByRole("button")).opacity).not.toBe("0.5");
  });

  it("s'atténue quand il est désactivé sans verdict", () => {
    poser(<Choice disabled>Finistère</Choice>);
    expect(getComputedStyle(screen.getByRole("button")).opacity).toBe("0.5");
  });

  it("révèle la bonne réponse même si elle n'a pas été choisie", () => {
    poser(
      <>
        <Choice state="incorrect">Morbihan</Choice>
        <Choice state="correct">Finistère</Choice>
      </>,
    );

    expect(screen.getByRole("img", { name: "Mauvaise réponse" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Bonne réponse" })).toBeInTheDocument();
  });
});
