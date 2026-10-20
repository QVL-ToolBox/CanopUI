import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { CanopSoundProvider } from "../../../sound";
import { installFakeAudio, type FakeAudio } from "../../../sound/test/fakeAudio";
import { icons } from "../../Icon/icons";
import { SoundToggle } from "../SoundToggle";
import { useSoundToggle } from "../useSoundToggle";

let audio: FakeAudio | null = null;

beforeEach(() => {
  window.localStorage.clear();
  audio = installFakeAudio();
});

afterEach(() => {
  audio?.restore();
  audio = null;
});

function poser(ui: React.ReactNode, locale: "fr" | "en" = "fr", defaultMuted = false) {
  return render(
    <CanopThemeProvider>
      <CanopI18nProvider locale={locale}>
        <CanopSoundProvider defaultMuted={defaultMuted}>{ui}</CanopSoundProvider>
      </CanopI18nProvider>
    </CanopThemeProvider>,
  );
}

describe("SoundToggle", () => {
  it("annonce l'action à faire, pas l'état courant", () => {
    poser(<SoundToggle />);
    expect(screen.getByRole("button", { name: "Couper le son" })).toBeInTheDocument();
  });

  it("bascule au clic, dans les deux sens", async () => {
    poser(<SoundToggle />);

    await userEvent.click(screen.getByRole("button", { name: "Couper le son" }));
    const rallumer = screen.getByRole("button", { name: "Activer le son" });

    await userEvent.click(rallumer);
    expect(screen.getByRole("button", { name: "Couper le son" })).toBeInTheDocument();
  });

  it("part du réglage du provider", () => {
    poser(<SoundToggle />, "fr", true);
    expect(screen.getByRole("button", { name: "Activer le son" })).toBeInTheDocument();
  });

  it("suit la langue courante", () => {
    poser(<SoundToggle />, "en");
    expect(screen.getByRole("button", { name: "Turn sound off" })).toBeInTheDocument();
  });

  it("garde une seule vérité quand deux boutons coexistent", async () => {
    poser(
      <>
        <SoundToggle />
        <SoundToggle />
      </>,
    );

    await userEvent.click(screen.getAllByRole("button", { name: "Couper le son" })[0]);

    expect(screen.getAllByRole("button", { name: "Activer le son" })).toHaveLength(2);
  });
});

describe("useSoundToggle", () => {
  function monter(defaultMuted = false) {
    return renderHook(() => useSoundToggle(), {
      wrapper: ({ children }) => (
        <CanopI18nProvider locale="fr">
          <CanopSoundProvider defaultMuted={defaultMuted}>{children}</CanopSoundProvider>
        </CanopI18nProvider>
      ),
    });
  }

  it("choisit l'icône selon l'état", () => {
    expect(monter(false).result.current.icon).toBe("volumeUp");
    expect(monter(true).result.current.icon).toBe("volumeOff");
  });

  it("désigne des icônes qui existent vraiment au registre", () => {
    expect(icons).toHaveProperty("volumeUp");
    expect(icons).toHaveProperty("volumeOff");
  });
});
