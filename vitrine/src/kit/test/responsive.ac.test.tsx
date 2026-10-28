import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, fireEvent, screen, within } from "@testing-library/react";
import { CodeBlock } from "../CodeBlock";
import { DemoCard } from "../DemoCard";
import { PropsTable } from "../PropsTable";
import {
  forgetViewportWidth,
  installClipboardSpy,
  mdBreakpointRem,
  removeClipboardSpy,
  renderInVitrine,
  simulateViewportWidth,
  stubScrollIntoView,
} from "../../test/vitrineTestKit";

const LONG_TYPE = "'primary' | 'secondary' | 'accent' | 'danger' | 'tonal' | 'ghost' | 'text'";
const ROWS = [
  { name: "variant", type: LONG_TYPE, defaultValue: "'primary'", description: "Style du bouton." },
  { name: "onClick", type: "(event: MouseEvent) => void", required: true, description: "Action." },
];
const DEMO_CODE = `<Button variant="primary">Valider</Button>`;

function renderPropsTableAt(widthRem: number) {
  simulateViewportWidth(widthRem);
  return renderInVitrine(<PropsTable rows={ROWS} />);
}

function typeCell(): HTMLElement {
  return screen.getAllByText(LONG_TYPE)[0];
}

function wrapsLongWords(element: HTMLElement): boolean {
  const style = getComputedStyle(element);
  const breaksWords =
    ["anywhere", "break-word"].includes(style.overflowWrap) ||
    ["break-all", "break-word"].includes(style.wordBreak);
  return breaksWords && !["nowrap", "pre"].includes(style.whiteSpace);
}

function ancestorsOf(element: HTMLElement, stopAt: HTMLElement): HTMLElement[] {
  const chain: HTMLElement[] = [];
  for (let node: HTMLElement | null = element; node && node !== stopAt; node = node.parentElement) {
    chain.push(node);
  }
  return chain;
}

beforeEach(() => {
  stubScrollIntoView();
});

afterEach(() => {
  forgetViewportWidth();
  removeClipboardSpy();
});

describe("AC5 PropsTable responsive", () => {
  it("s'affiche en tableau à partir de md", () => {
    renderPropsTableAt(mdBreakpointRem());
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(ROWS.length + 1);
  });

  it("s'affiche en tableau bien au-dessus de md", () => {
    renderPropsTableAt(mdBreakpointRem() + 40);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("s'affiche en cartes empilées juste sous md", () => {
    renderPropsTableAt(mdBreakpointRem() - 0.5);
    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.getAllByRole("listitem")).toHaveLength(ROWS.length);
  });

  it("s'affiche en cartes empilées sur mobile", () => {
    renderPropsTableAt(20);
    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.getAllByRole("listitem")).toHaveLength(ROWS.length);
  });

  it("garde nom, type et description de chaque prop dans les cartes", () => {
    renderPropsTableAt(20);
    const [first] = screen.getAllByRole("listitem");
    expect(within(first).getByText("variant")).toBeInTheDocument();
    expect(within(first).getByText(LONG_TYPE)).toBeInTheDocument();
    expect(within(first).getByText("Style du bouton.")).toBeInTheDocument();
  });

  it.each([
    ["en tableau", 100],
    ["en cartes", 20],
  ])("fait passer les types longs à la ligne %s", (_layout, widthRem) => {
    renderPropsTableAt(widthRem);
    expect(wrapsLongWords(typeCell())).toBe(true);
  });
});

describe("AC5 CodeBlock défile dans son cadre", () => {
  it("défile horizontalement dans un cadre qui peut rétrécir", () => {
    const { container } = renderInVitrine(<CodeBlock code={`const x = "${"a".repeat(400)}";`} />);
    const pre = container.querySelector("pre") as HTMLElement;
    const frames = ancestorsOf(pre, container).filter((node) => {
      const style = getComputedStyle(node);
      return style.overflowX === "auto" && style.minWidth === "0px";
    });
    expect(frames.length).toBeGreaterThan(0);
  });

  it("ne laisse aucun ancêtre du code imposer une largeur minimale", () => {
    const { container } = renderInVitrine(<CodeBlock code="const a = 1;" />);
    const pre = container.querySelector("pre") as HTMLElement;
    const blocking = ancestorsOf(pre, container).filter((node) => {
      const minWidth = getComputedStyle(node).minWidth;
      return minWidth !== "" && minWidth !== "auto" && minWidth !== "0px" && minWidth !== "0";
    });
    expect(blocking).toEqual([]);
  });
});

describe("AC5 démos bornées", () => {
  it("borne la démo par min-width: 0 et max-width: 100%", () => {
    renderInVitrine(
      <DemoCard title="Démo" code={DEMO_CODE}>
        <span>contenu de démo</span>
      </DemoCard>,
    );
    const card = screen.getByRole("heading", { level: 3, name: "Démo" })
      .parentElement as HTMLElement;
    const bounded = ancestorsOf(screen.getByText("contenu de démo"), card).filter((node) => {
      const style = getComputedStyle(node);
      return style.minWidth === "0px" && style.maxWidth === "100%";
    });
    expect(bounded.length).toBeGreaterThan(0);
  });
});

describe("AC5 bouton Copier des démos", () => {
  it("copie le code de la démo et non l'événement", async () => {
    const copies = installClipboardSpy();
    renderInVitrine(
      <DemoCard title="Démo" code={DEMO_CODE}>
        <span>contenu</span>
      </DemoCard>,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /copier/i }));
    });
    expect(copies).toEqual([DEMO_CODE]);
  });

  it("copie le code du CodeBlock", async () => {
    const copies = installClipboardSpy();
    renderInVitrine(<CodeBlock code="npm i @canop/ui" />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /copier/i }));
    });
    expect(copies).toEqual(["npm i @canop/ui"]);
  });
});
