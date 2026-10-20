import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form } from "../Form";

describe("Form", () => {
  it("appelle onSubmit à la soumission", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit} submitLabel="Envoyer">
        <input aria-label="champ" />
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Envoyer" }));

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("affiche l'erreur fournie", () => {
    render(
      <Form onSubmit={() => {}} submitLabel="Envoyer" error="Champ invalide">
        <input aria-label="champ" />
      </Form>,
    );

    expect(screen.getByText("Champ invalide")).toBeInTheDocument();
  });

  it("désactive le bouton en chargement", () => {
    render(
      <Form onSubmit={() => {}} submitLabel="Envoyer" loading>
        <input aria-label="champ" />
      </Form>,
    );

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applique la variante accent au bouton submit via submitVariant", () => {
    render(
      <Form onSubmit={() => {}} submitLabel="Envoyer" submitVariant="accent">
        <input aria-label="champ" />
      </Form>,
    );

    expect(screen.getByRole("button", { name: "Envoyer" }).className).toContain("colorAccent");
  });

  it("utilise la variante primary par défaut sans submitVariant", () => {
    render(
      <Form onSubmit={() => {}} submitLabel="Envoyer">
        <input aria-label="champ" />
      </Form>,
    );

    expect(screen.getByRole("button", { name: "Envoyer" }).className).toContain("colorPrimary");
  });

  it("désactive le bouton avec submitDisabled", () => {
    render(
      <Form onSubmit={() => {}} submitLabel="Envoyer" submitDisabled>
        <input aria-label="champ" />
      </Form>,
    );

    expect(screen.getByRole("button", { name: "Envoyer" })).toBeDisabled();
  });

  it("n'appelle pas onSubmit quand submitDisabled", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit} submitLabel="Envoyer" submitDisabled>
        <input aria-label="champ" />
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Envoyer" })).catch(() => undefined);

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
