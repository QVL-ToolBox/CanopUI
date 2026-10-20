import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CanopThemeProvider } from "../../theme";
import { Badge } from "../../components/Badge/Badge";
import { Icon } from "../../components/Icon/Icon";
import { StatCard } from "../../components/StatCard/StatCard";
import { StatusChip } from "../../components/StatusChip/StatusChip";

const iconColors = [
  "primary",
  "secondary",
  "accent",
  "success",
  "warning",
  "error",
  "info",
  "inherit",
  "neutral",
] as const;

const badgeColors = [
  "primary",
  "secondary",
  "accent",
  "success",
  "warning",
  "error",
  "info",
] as const;

const forbiddenVariablePrefix = "--canop-palette-neutral-";

function renderAll() {
  return render(
    <CanopThemeProvider>
      {iconColors.map((color) => (
        <Icon key={`icon-${color}`} name="star" color={color} />
      ))}
      {iconColors.map((iconColor) => (
        <StatCard
          key={`card-${iconColor}`}
          label="Fichiers"
          value="128"
          icon="star"
          iconColor={iconColor}
        />
      ))}
      {badgeColors.map((color) => (
        <Badge key={`badge-${color}`} count={3} color={color} />
      ))}
      <Badge count={3} />
      <StatusChip tone="neutral" label="Argent" />
    </CanopThemeProvider>,
  );
}

function collectStyles(container: HTMLElement) {
  const inlineStyles = Array.from(container.querySelectorAll("[style]")).map(
    (element) => element.getAttribute("style") ?? "",
  );
  const sheets = Array.from(document.querySelectorAll("style")).map(
    (element) => element.textContent ?? "",
  );
  return [...inlineStyles, ...sheets].join("\n");
}

describe("garde-fou anti-variable de palette neutral", () => {
  it("n'émet aucune référence à --canop-palette-neutral- sur Icon, StatCard, Badge et StatusChip", () => {
    const { container } = renderAll();
    expect(collectStyles(container)).not.toContain(forbiddenVariablePrefix);
  });

  it("détecte bien la sous-chaîne interdite quand elle est présente", () => {
    const { container } = renderAll();
    const polluted = document.createElement("div");
    polluted.setAttribute("style", `background-color: var(${forbiddenVariablePrefix}main)`);
    container.appendChild(polluted);
    expect(collectStyles(container)).toContain(forbiddenVariablePrefix);
  });
});
