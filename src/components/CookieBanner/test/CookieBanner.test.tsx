import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CookieBanner } from "../CookieBanner";
import { DEFAULT_COOKIE_CONSENT_KEY, setStoredConsent } from "../cookieConsent";

const MESSAGE = "Nous utilisons des cookies pour mesurer l'audience du portail.";

function renderBanner(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("CookieBanner", () => {
  beforeEach(() => {
    setStoredConsent(DEFAULT_COOKIE_CONSENT_KEY, null);
  });

  it("affiche le message du portail et les deux choix", () => {
    renderBanner(<CookieBanner message={MESSAGE} />);

    expect(screen.getByText(MESSAGE)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Accepter" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Refuser" })).toBeInTheDocument();
  });

  it("expose une region nommee pour les lecteurs d'ecran", () => {
    renderBanner(<CookieBanner message={MESSAGE} />);

    expect(screen.getByRole("region", { name: "Consentement aux cookies" })).toBeInTheDocument();
  });

  it("retient l'acceptation et previent le portail", async () => {
    const onDecision = vi.fn();
    renderBanner(<CookieBanner message={MESSAGE} onDecision={onDecision} />);

    await userEvent.click(screen.getByRole("button", { name: "Accepter" }));

    expect(onDecision).toHaveBeenCalledWith("accepted");
    expect(window.localStorage.getItem(DEFAULT_COOKIE_CONSENT_KEY)).toBe("accepted");
  });

  it("retient le refus", async () => {
    const onDecision = vi.fn();
    renderBanner(<CookieBanner message={MESSAGE} onDecision={onDecision} />);

    await userEvent.click(screen.getByRole("button", { name: "Refuser" }));

    expect(onDecision).toHaveBeenCalledWith("declined");
    expect(window.localStorage.getItem(DEFAULT_COOKIE_CONSENT_KEY)).toBe("declined");
  });

  it("ne reapparait pas quand la decision est deja prise", () => {
    setStoredConsent(DEFAULT_COOKIE_CONSENT_KEY, "declined");
    renderBanner(<CookieBanner message={MESSAGE} />);

    expect(screen.queryByText(MESSAGE)).not.toBeInTheDocument();
  });

  it("ne persiste rien quand storageKey vaut null", async () => {
    renderBanner(<CookieBanner message={MESSAGE} storageKey={null} />);

    await userEvent.click(screen.getByRole("button", { name: "Accepter" }));

    expect(window.localStorage.getItem(DEFAULT_COOKIE_CONSENT_KEY)).toBeNull();
  });
});
