import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Card } from "../../Card";
import { Stack } from "../Stack";

function renderStack(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

function bloc(texte: string): HTMLElement {
  return screen.getByText(texte).parentElement!;
}

function style(element: HTMLElement) {
  return getComputedStyle(element);
}

describe("Stack — collage", () => {
  it("ne colle rien sans la prop", () => {
    renderStack(
      <Stack>
        <span>Libre</span>
      </Stack>,
    );
    expect(style(bloc("Libre")).position).not.toBe("sticky");
  });

  it("colle en haut de la zone qui défile", () => {
    renderStack(
      <Stack sticky="top">
        <span>Haut</span>
      </Stack>,
    );
    const colle = style(bloc("Haut"));
    expect(colle.position).toBe("sticky");
    expect(colle.top).toBe("0px");
  });

  it("colle en bas de la zone qui défile", () => {
    renderStack(
      <Stack sticky="bottom">
        <span>Bas</span>
      </Stack>,
    );
    const colle = style(bloc("Bas"));
    expect(colle.position).toBe("sticky");
    expect(colle.bottom).toBe("0px");
  });

  it("décale le bloc collé de l'espacement demandé", () => {
    renderStack(
      <Stack sticky="top" stickyOffset="md">
        <span>Décalé</span>
      </Stack>,
    );
    expect(style(bloc("Décalé")).top).toBe("1rem");
  });

  it("élève le bloc collé au-dessus d'une Card, qui ouvre son contexte d'empilement", () => {
    renderStack(
      <>
        <Stack sticky="top">
          <span>Collé</span>
        </Stack>
        <Card>
          <span>Carte</span>
        </Card>
      </>,
    );
    expect(Number(style(bloc("Collé")).zIndex)).toBeGreaterThan(0);
  });

  it("ne pose aucun rang d'empilement sans collage", () => {
    renderStack(
      <Stack>
        <span>Sans rang</span>
      </Stack>,
    );
    expect(["", "auto"]).toContain(style(bloc("Sans rang")).zIndex);
  });
});
