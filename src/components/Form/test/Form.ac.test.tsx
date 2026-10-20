import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form } from "../Form";

describe("Form - AC2 désactivation de la soumission", () => {
  it("laisse le bouton actif quand submitDisabled n'est pas fourni", () => {
    render(
      <Form onSubmit={() => {}} submitLabel="Envoyer">
        <input aria-label="champ" />
      </Form>,
    );
    expect(screen.getByRole("button", { name: "Envoyer" })).toBeEnabled();
  });

  it("laisse le bouton actif quand submitDisabled vaut false", () => {
    render(
      <Form onSubmit={() => {}} submitLabel="Envoyer" submitDisabled={false}>
        <input aria-label="champ" />
      </Form>,
    );
    expect(screen.getByRole("button", { name: "Envoyer" })).toBeEnabled();
  });

  it("soumet le formulaire quand submitDisabled n'est pas actif", async () => {
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
});
