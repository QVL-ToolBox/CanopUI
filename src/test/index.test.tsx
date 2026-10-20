import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cwd } from "node:process";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CANOP_VERSION } from "../index";

const packageJson = JSON.parse(readFileSync(resolve(cwd(), "package.json"), "utf-8")) as {
  version: string;
};

describe("@canop/ui", () => {
  it("expose la version de la librairie alignee sur package.json", () => {
    expect(CANOP_VERSION).toBe(packageJson.version);
  });

  it("le harnais Testing Library + jsdom fonctionne", () => {
    render(<p>CustHome</p>);
    expect(screen.getByText("CustHome")).toBeInTheDocument();
  });
});
