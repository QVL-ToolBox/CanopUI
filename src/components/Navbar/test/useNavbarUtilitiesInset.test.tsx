import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { CanopI18nProvider } from "../../../i18n";
import { useNavbarUtilitiesInset } from "../useNavbarUtilitiesInset";

function monolingue({ children }: { children: ReactNode }) {
  return <CanopI18nProvider locale="fr">{children}</CanopI18nProvider>;
}

function bilingue({ children }: { children: ReactNode }) {
  return (
    <CanopI18nProvider locale="fr" messages={{ fr: {}, en: {} }}>
      {children}
    </CanopI18nProvider>
  );
}

function empreinte(hasActions: boolean, wrapper: typeof monolingue): string {
  return renderHook(() => useNavbarUtilitiesInset(hasActions), { wrapper }).result.current;
}

describe("useNavbarUtilitiesInset", () => {
  it("ne réserve rien en portail monolingue sans actions", () => {
    expect(empreinte(false, monolingue)).toBe("0rem");
  });

  it("réserve la gouttière des utilitaires en portail multilingue", () => {
    expect(empreinte(false, bilingue)).not.toBe("0rem");
  });

  it("réserve la gouttière en portail monolingue dès qu'il y a des actions", () => {
    expect(empreinte(true, monolingue)).toBe(empreinte(false, bilingue));
  });

  it("garde la gouttière en portail multilingue avec des actions", () => {
    expect(empreinte(true, bilingue)).toBe(empreinte(false, bilingue));
  });
});
