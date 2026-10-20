import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Heading } from "../Heading";

function renderHeading(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

const styleKeys = [
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "color",
] as const;

function visualOf(element: HTMLElement) {
  const style = getComputedStyle(element);
  return Object.fromEntries(styleKeys.map((key) => [key, style[key]]));
}

describe("Heading - component", () => {
  it.each(["p", "span", "div"] as const)(
    "given component=%s, when rendered, then the tag matches without heading role",
    (component) => {
      renderHeading(
        <Heading level={1} component={component}>
          Titre neutre
        </Heading>,
      );
      expect(screen.getByText("Titre neutre").tagName).toBe(component.toUpperCase());
      expect(screen.queryByRole("heading")).toBeNull();
    },
  );

  it.each([1, 2, 3, 4] as const)(
    "given no component and level %s, when rendered, then the tag is the matching h",
    (level) => {
      renderHeading(<Heading level={level}>Titre</Heading>);
      expect(screen.getByRole("heading", { level }).tagName).toBe(`H${level}`);
    },
  );

  it("given component=p, when rendered, then it keeps the look of its level", () => {
    renderHeading(
      <>
        <Heading level={2}>Semantique</Heading>
        <Heading level={2} component="p">
          Visuel
        </Heading>
      </>,
    );
    expect(visualOf(screen.getByText("Visuel"))).toEqual(visualOf(screen.getByText("Semantique")));
  });
});
