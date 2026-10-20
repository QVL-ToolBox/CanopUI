import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { Stack } from "../Stack";

function renderStack(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

function reglesDe(element: Element): string {
  const classes = Array.from(element.classList);
  return Array.from(document.querySelectorAll("style"))
    .flatMap((noeud) => (noeud.textContent ?? "").split("}"))
    .filter((regle) => classes.some((classe) => regle.includes(`.${classe}{`)))
    .join("}");
}

describe("Stack", () => {
  it("rend ses enfants dans un div en colonne par défaut", () => {
    renderStack(
      <Stack>
        <span>Premier</span>
        <span>Second</span>
      </Stack>,
    );
    const stack = screen.getByText("Premier").parentElement!;
    expect(stack.tagName).toBe("DIV");
    expect(stack).toHaveStyle({ display: "flex", flexDirection: "column" });
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it.each([
    ["xs", "0.5rem"],
    ["sm", "0.75rem"],
    ["md", "1rem"],
    ["lg", "1.5rem"],
    ["xl", "2rem"],
  ] as const)("applique le gap %s (%s) issu des tokens", (gap, value) => {
    renderStack(
      <Stack gap={gap}>
        <span>Contenu</span>
      </Stack>,
    );
    expect(screen.getByText("Contenu").parentElement).toHaveStyle({ gap: value });
  });

  it("applique le gap md par défaut", () => {
    renderStack(
      <Stack>
        <span>Contenu</span>
      </Stack>,
    );
    expect(screen.getByText("Contenu").parentElement).toHaveStyle({ gap: "1rem" });
  });

  it("ne réclame aucune part de l'espace tant qu'on ne demande rien", () => {
    renderStack(
      <Stack>
        <span>Contenu</span>
      </Stack>,
    );
    expect(reglesDe(screen.getByText("Contenu").parentElement!)).not.toContain("flex:");
  });

  it("prend une part égale à celle de ses frères avec fill", () => {
    renderStack(
      <Stack fill>
        <span>Contenu</span>
      </Stack>,
    );
    expect(reglesDe(screen.getByText("Contenu").parentElement!)).toContain("flex:1 1 0%");
  });

  it("prend la part qu'on lui donne parmi ses frères", () => {
    renderStack(
      <Stack direction="row" weight={2}>
        <span>Contenu</span>
      </Stack>,
    );
    expect(reglesDe(screen.getByText("Contenu").parentElement!)).toContain("flex:2 1 0%");
  });

  it("partage l'espace sans qu'on ait à poser fill en plus", () => {
    renderStack(
      <Stack direction="row" weight={3}>
        <span>Contenu</span>
      </Stack>,
    );
    expect(reglesDe(screen.getByText("Contenu").parentElement!)).toContain("flex:3 1 0%");
  });

  it("donne à deux colonnes des parts qui ne doivent rien à leur contenu", () => {
    renderStack(
      <Stack direction="row">
        <Stack weight={2}>
          <span>Carte</span>
        </Stack>
        <Stack weight={1}>
          <span>Ain</span>
        </Stack>
      </Stack>,
    );

    expect(reglesDe(screen.getByText("Carte").parentElement!)).toContain("flex:2 1 0%");
    expect(reglesDe(screen.getByText("Ain").parentElement!)).toContain("flex:1 1 0%");
  });

  it("rend un formulaire soumettable avec as=form", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    renderStack(
      <Stack as="form" onSubmit={onSubmit}>
        <button type="submit">Envoyer</button>
      </Stack>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Envoyer" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("rend une navigation accessible avec as=nav et ariaLabel", () => {
    renderStack(
      <Stack as="nav" ariaLabel="Liens secondaires" gap="xs">
        <a href="/register">Créer un compte</a>
      </Stack>,
    );
    expect(screen.getByRole("navigation", { name: "Liens secondaires" })).toBeInTheDocument();
  });

  it("rend une section avec as=section", () => {
    renderStack(
      <Stack as="section">
        <span>Contenu</span>
      </Stack>,
    );
    expect(screen.getByText("Contenu").parentElement!.tagName).toBe("SECTION");
  });
});
