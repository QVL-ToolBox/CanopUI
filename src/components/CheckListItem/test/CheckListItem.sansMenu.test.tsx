import { describe, expect, expectTypeOf, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { CanopThemeProvider } from "../../../theme";
import { CheckListItem, type CanopCheckListItemProps } from "../CheckListItem";

const LABEL = "Beurre doux";

const variantes: Array<[string, ReactElement]> = [
  ["sans prop optionnelle", <CheckListItem label={LABEL} />],
  ["cochable", <CheckListItem label={LABEL} onCheckedChange={() => {}} />],
  ["coché", <CheckListItem label={LABEL} checked onCheckedChange={() => {}} />],
  [
    "case en fin, puce et grande taille",
    <CheckListItem
      label={LABEL}
      onCheckedChange={() => {}}
      marker="bullet"
      checkboxPlacement="end"
      checkboxSize="large"
    />,
  ],
  ["atténué", <CheckListItem label={LABEL} muted />],
  ["désactivé", <CheckListItem label={LABEL} disabled onCheckedChange={() => {}} />],
  ["avec actions", <CheckListItem label={LABEL} actions={<span>action</span>} />],
  ["avec éditeur", <CheckListItem label={LABEL} editor={<input aria-label="éditeur" />} />],
];

function renderItem(ui: ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("CheckListItem - AC5 le libellé n'est jamais un bouton de menu", () => {
  it("n'expose plus de prop labelMenu", () => {
    expectTypeOf<CanopCheckListItemProps>().not.toHaveProperty("labelMenu");
  });

  it.each(variantes)("%s : aucun élément n'annonce de menu", (_nom, ui) => {
    const { container } = renderItem(ui);
    expect(container.querySelector("[aria-haspopup]")).toBeNull();
  });

  it.each(variantes)("%s : aucun bouton ne porte le libellé", (_nom, ui) => {
    renderItem(ui);
    expect(screen.queryByRole("button", { name: LABEL })).toBeNull();
  });

  it("ignore une prop labelMenu passée de force", () => {
    const forcee = { label: LABEL, labelMenu: <span>menu</span> } as CanopCheckListItemProps;
    const { container } = renderItem(<CheckListItem {...forcee} />);
    expect(container.querySelector("[aria-haspopup]")).toBeNull();
    expect(screen.queryByRole("button", { name: LABEL })).toBeNull();
    expect(screen.queryByText("menu")).toBeNull();
  });
});
