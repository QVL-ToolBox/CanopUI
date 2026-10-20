import { useState } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputEmail } from "../InputEmail";
import { InputPassword } from "../InputPassword";

function ControlledEmail({ required = true }: { required?: boolean }) {
  const [value, setValue] = useState("");
  return <InputEmail label="Email" value={value} onChange={setValue} required={required} />;
}

function ControlledPassword() {
  const [value, setValue] = useState("");
  return (
    <InputPassword
      label="Mot de passe"
      value={value}
      onChange={setValue}
      required
      autoComplete="new-password"
    />
  );
}

describe("InputEmail", () => {
  it("affiche l'erreur requise au blur si vide", async () => {
    const user = userEvent.setup();
    render(<ControlledEmail />);
    await user.click(screen.getByLabelText(/email/i));
    await user.tab();
    expect(await screen.findByText("Ce champ est requis.")).toBeInTheDocument();
  });

  it("rejette un email mal formé via la regex", async () => {
    const user = userEvent.setup();
    render(<ControlledEmail required={false} />);
    await user.type(screen.getByLabelText(/email/i), "pasunemail");
    await user.tab();
    expect(await screen.findByText("Format d'email invalide.")).toBeInTheDocument();
  });

  it("accepte un email valide", async () => {
    const user = userEvent.setup();
    render(<ControlledEmail />);
    await user.type(screen.getByLabelText(/email/i), "a@b.fr");
    await user.tab();
    expect(screen.queryByText(/email invalide/i)).not.toBeInTheDocument();
  });
});

describe("InputPassword", () => {
  it("rejette un mot de passe qui ne respecte pas tous les critères", async () => {
    const user = userEvent.setup();
    render(<ControlledPassword />);
    await user.type(screen.getByLabelText(/^mot de passe/i), "court");
    await user.tab();
    expect(await screen.findByText(/critères de sécurité/i)).toBeInTheDocument();
  });

  it("affiche les barres de conformité des critères", () => {
    render(<ControlledPassword />);
    expect(screen.getByRole("meter", { name: /sécurité du mot de passe/i })).toBeInTheDocument();
    expect(screen.getByText(/au moins 8 caractères/i)).toBeInTheDocument();
    expect(screen.getByText(/une majuscule/i)).toBeInTheDocument();
    expect(screen.getByText(/un caractère spécial/i)).toBeInTheDocument();
  });

  it("accepte un mot de passe conforme", async () => {
    const user = userEvent.setup();
    render(<ControlledPassword />);
    await user.type(screen.getByLabelText(/^mot de passe/i), "Abcdef1!");
    await user.tab();
    expect(screen.queryByText(/critères de sécurité/i)).not.toBeInTheDocument();
  });

  it("permet d'afficher puis masquer le mot de passe", async () => {
    const user = userEvent.setup();
    render(<ControlledPassword />);
    await user.click(screen.getByRole("button", { name: "Afficher la saisie" }));
    expect(screen.getByRole("button", { name: "Masquer la saisie" })).toBeInTheDocument();
  });
});
