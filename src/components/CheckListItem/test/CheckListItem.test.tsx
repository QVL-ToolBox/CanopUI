import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent, { PointerEventsCheckLevel } from "@testing-library/user-event";
import type { ReactElement } from "react";
import { CanopThemeProvider } from "../../../theme";
import { CheckListItem } from "../CheckListItem";

const LABEL = "Beurre doux";

function renderItem(ui: ReactElement) {
  const view = render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
  const row = view.container.querySelector<HTMLElement>("[data-checked]");
  if (!row) throw new Error("ligne introuvable");
  return { ...view, row };
}

describe("CheckListItem - AC1 libellé et bascule de la ligne", () => {
  it("affiche le libellé", () => {
    renderItem(<CheckListItem label={LABEL} onCheckedChange={() => {}} />);
    expect(screen.getByText(LABEL)).toBeInTheDocument();
  });

  it("coche l'item et transmet true quand on clique sur le libellé", async () => {
    const onCheckedChange = vi.fn();
    renderItem(<CheckListItem label={LABEL} onCheckedChange={onCheckedChange} />);
    await userEvent.setup().click(screen.getByText(LABEL));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("décoche l'item et transmet false quand on clique sur le libellé d'un item coché", async () => {
    const onCheckedChange = vi.fn();
    renderItem(<CheckListItem label={LABEL} checked onCheckedChange={onCheckedChange} />);
    await userEvent.setup().click(screen.getByText(LABEL));
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("transmet la nouvelle valeur quand on clique sur la case", async () => {
    const onCheckedChange = vi.fn();
    renderItem(<CheckListItem label={LABEL} onCheckedChange={onCheckedChange} />);
    await userEvent.setup().click(screen.getByRole("checkbox", { name: LABEL }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("bascule au clavier avec la barre d'espace", async () => {
    const onCheckedChange = vi.fn();
    renderItem(<CheckListItem label={LABEL} onCheckedChange={onCheckedChange} />);
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard(" ");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});

describe("CheckListItem - AC2 état coché", () => {
  it("marque la ligne comme cochée quand checked vaut true", () => {
    const { row } = renderItem(<CheckListItem label={LABEL} checked onCheckedChange={() => {}} />);
    expect(row).toHaveAttribute("data-checked", "on");
    expect(screen.getByRole("checkbox", { name: LABEL })).toBeChecked();
  });

  it("ne marque pas la ligne comme cochée par défaut", () => {
    const { row } = renderItem(<CheckListItem label={LABEL} onCheckedChange={() => {}} />);
    expect(row).toHaveAttribute("data-checked", "off");
    expect(screen.getByRole("checkbox", { name: LABEL })).not.toBeChecked();
  });
});

describe("CheckListItem - AC3 item de tiroir sans onCheckedChange", () => {
  it("n'affiche aucune case à cocher mais garde le libellé", () => {
    renderItem(<CheckListItem label={LABEL} />);
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.getByText(LABEL)).toBeInTheDocument();
  });

  it("n'affiche aucune case même si checked vaut true", () => {
    renderItem(<CheckListItem label={LABEL} checked />);
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});

describe("CheckListItem - AC4 item atténué", () => {
  it("marque la ligne comme atténuée quand muted vaut true", () => {
    const { row } = renderItem(<CheckListItem label={LABEL} muted onCheckedChange={() => {}} />);
    expect(row).toHaveAttribute("data-muted", "on");
  });

  it("ne marque pas la ligne comme atténuée par défaut", () => {
    const { row } = renderItem(<CheckListItem label={LABEL} onCheckedChange={() => {}} />);
    expect(row).toHaveAttribute("data-muted", "off");
  });

  it("laisse les actions cliquables quand l'item est atténué", async () => {
    const onRemove = vi.fn();
    renderItem(
      <CheckListItem
        label={LABEL}
        muted
        onCheckedChange={() => {}}
        actions={
          <button type="button" onClick={onRemove}>
            Retirer
          </button>
        }
      />,
    );
    const action = screen.getByRole("button", { name: "Retirer" });
    expect(action).toBeEnabled();
    await userEvent.setup().click(action);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});

describe("CheckListItem - AC5 éditeur à la place du libellé", () => {
  it("affiche l'éditeur et garde le libellé comme nom accessible de la case", () => {
    renderItem(
      <CheckListItem
        label={LABEL}
        onCheckedChange={() => {}}
        editor={<input aria-label="Modifier l'article" defaultValue="Beurre salé" />}
      />,
    );
    expect(screen.getByRole("textbox", { name: "Modifier l'article" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: LABEL })).toBeInTheDocument();
  });

  it("ne rend plus le libellé en texte et le porte par l'aria-label de la case", () => {
    renderItem(
      <CheckListItem
        label={LABEL}
        onCheckedChange={() => {}}
        editor={<input aria-label="Modifier l'article" />}
      />,
    );
    expect(screen.queryByText(LABEL)).not.toBeInTheDocument();
    const checkbox = screen.getByRole("checkbox", { name: LABEL });
    expect(checkbox).toHaveAttribute("aria-label", LABEL);
  });
});

describe("CheckListItem - AC6 item désactivé", () => {
  it("rend la case inactive", () => {
    renderItem(<CheckListItem label={LABEL} disabled onCheckedChange={() => {}} />);
    expect(screen.getByRole("checkbox", { name: LABEL })).toBeDisabled();
  });

  it("n'appelle pas onCheckedChange au clic sur le libellé ni sur la case", async () => {
    const onCheckedChange = vi.fn();
    renderItem(<CheckListItem label={LABEL} disabled onCheckedChange={onCheckedChange} />);
    const user = userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });
    await user.click(screen.getByText(LABEL));
    await user.click(screen.getByRole("checkbox", { name: LABEL }));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
