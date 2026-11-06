import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { tokens } from "../../../tokens";
import { Text } from "../Text";

describe("Text - padding de la variante code", () => {
  it("garde un padding horizontal 2xs et vertical 3xs", () => {
    const { container } = render(
      <CanopThemeProvider>
        <Text variant="code">npm i @canop/ui</Text>
      </CanopThemeProvider>,
    );
    const code = container.querySelector("code") as HTMLElement;
    expect(code).toHaveStyle({
      paddingLeft: tokens.spacing["2xs"],
      paddingRight: tokens.spacing["2xs"],
      paddingTop: tokens.spacing["3xs"],
      paddingBottom: tokens.spacing["3xs"],
    });
  });
});
