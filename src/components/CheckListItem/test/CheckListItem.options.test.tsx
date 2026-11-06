import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { CanopThemeProvider } from "../../../theme";
import { CheckListItem } from "../CheckListItem";

const LABEL = "Beurre doux";
const ROOT_FONT_SIZE_PX = 16;
const LARGE_MIN_REM = 2.75;

function renderItem(ui: ReactElement) {
  const view = render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
  const row = view.container.querySelector<HTMLElement>("[data-checked]");
  if (!row) throw new Error("ligne introuvable");
  return { ...view, row };
}

function toRem(value: string): number {
  if (value.endsWith("rem")) return parseFloat(value);
  if (value.endsWith("px")) return parseFloat(value) / ROOT_FONT_SIZE_PX;
  return Number.NaN;
}

function clickableSizeInRem(element: HTMLElement) {
  const style = getComputedStyle(element);
  const width = Math.max(toRem(style.width) || 0, toRem(style.minWidth) || 0);
  const height = Math.max(toRem(style.height) || 0, toRem(style.minHeight) || 0);
  return { width, height };
}

function checkboxClickableZone(): HTMLElement {
  const input = screen.getByRole("checkbox", { name: LABEL });
  const zone = input.parentElement;
  if (!zone) throw new Error("zone cliquable introuvable");
  return zone;
}

function precedes(first: Node, second: Node): boolean {
  return Boolean(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);
}

describe("CheckListItem - option marker", () => {
  it("rend une puce quand marker vaut bullet", () => {
    const { row } = renderItem(
      <CheckListItem label={LABEL} marker="bullet" onCheckedChange={() => {}} />,
    );
    expect(row.querySelector('[data-marker="bullet"]')).not.toBeNull();
  });

  it("ne rend aucune puce sans la prop marker", () => {
    const { container } = renderItem(<CheckListItem label={LABEL} onCheckedChange={() => {}} />);
    expect(container.querySelector("[data-marker]")).toBeNull();
  });

  it("ne rend aucune puce quand marker vaut none", () => {
    const { container } = renderItem(
      <CheckListItem label={LABEL} marker="none" onCheckedChange={() => {}} />,
    );
    expect(container.querySelector('[data-marker="bullet"]')).toBeNull();
  });

  it("rend la puce sur un item de tiroir sans case", () => {
    const { row } = renderItem(<CheckListItem label={LABEL} marker="bullet" />);
    expect(row.querySelector('[data-marker="bullet"]')).not.toBeNull();
  });
});

describe("CheckListItem - option checkboxPlacement", () => {
  it("place la case après le libellé dans le DOM quand checkboxPlacement vaut end", () => {
    renderItem(<CheckListItem label={LABEL} checkboxPlacement="end" onCheckedChange={() => {}} />);
    expect(precedes(screen.getByText(LABEL), screen.getByRole("checkbox", { name: LABEL }))).toBe(
      true,
    );
  });

  it("garde la case avant le libellé par défaut", () => {
    renderItem(<CheckListItem label={LABEL} onCheckedChange={() => {}} />);
    expect(precedes(screen.getByRole("checkbox", { name: LABEL }), screen.getByText(LABEL))).toBe(
      true,
    );
  });

  it("ne coche pas au clic sur le libellé quand checkboxPlacement vaut end", async () => {
    const onCheckedChange = vi.fn();
    renderItem(
      <CheckListItem label={LABEL} checkboxPlacement="end" onCheckedChange={onCheckedChange} />,
    );
    await userEvent.setup().click(screen.getByText(LABEL));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("coche au clic sur la case quand checkboxPlacement vaut end", async () => {
    const onCheckedChange = vi.fn();
    renderItem(
      <CheckListItem label={LABEL} checkboxPlacement="end" onCheckedChange={onCheckedChange} />,
    );
    await userEvent.setup().click(screen.getByRole("checkbox", { name: LABEL }));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("décoche au clic sur la case d'un item coché quand checkboxPlacement vaut end", async () => {
    const onCheckedChange = vi.fn();
    renderItem(
      <CheckListItem
        label={LABEL}
        checked
        checkboxPlacement="end"
        onCheckedChange={onCheckedChange}
      />,
    );
    await userEvent.setup().click(screen.getByRole("checkbox", { name: LABEL }));
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });
});

describe("CheckListItem - option checkboxSize", () => {
  it("offre une zone cliquable d'au moins 2.75rem quand checkboxSize vaut large", () => {
    renderItem(<CheckListItem label={LABEL} checkboxSize="large" onCheckedChange={() => {}} />);
    const { width, height } = clickableSizeInRem(checkboxClickableZone());
    expect(width).toBeGreaterThanOrEqual(LARGE_MIN_REM);
    expect(height).toBeGreaterThanOrEqual(LARGE_MIN_REM);
  });

  it("offre une zone cliquable d'au moins 2.75rem en large même placée en fin de ligne", () => {
    renderItem(
      <CheckListItem
        label={LABEL}
        checkboxSize="large"
        checkboxPlacement="end"
        onCheckedChange={() => {}}
      />,
    );
    const { width, height } = clickableSizeInRem(checkboxClickableZone());
    expect(width).toBeGreaterThanOrEqual(LARGE_MIN_REM);
    expect(height).toBeGreaterThanOrEqual(LARGE_MIN_REM);
  });

  it("coche toujours au clic sur une case large", async () => {
    const onCheckedChange = vi.fn();
    renderItem(
      <CheckListItem label={LABEL} checkboxSize="large" onCheckedChange={onCheckedChange} />,
    );
    await userEvent.setup().click(screen.getByRole("checkbox", { name: LABEL }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});

describe("CheckListItem - état coché combiné aux nouvelles options", () => {
  const variants: [string, Partial<Parameters<typeof CheckListItem>[0]>][] = [
    ["marker bullet", { marker: "bullet" }],
    ["checkboxPlacement end", { checkboxPlacement: "end" }],
    ["checkboxSize large", { checkboxSize: "large" }],
    [
      "toutes les options",
      {
        marker: "bullet",
        checkboxPlacement: "end",
        checkboxSize: "large",
      },
    ],
  ];

  it.each(variants)('reste barré (data-checked="on") avec %s', (_name, props) => {
    const { row } = renderItem(
      <CheckListItem label={LABEL} checked onCheckedChange={() => {}} {...props} />,
    );
    expect(row).toHaveAttribute("data-checked", "on");
    expect(screen.getByRole("checkbox", { name: LABEL })).toBeChecked();
  });
});
