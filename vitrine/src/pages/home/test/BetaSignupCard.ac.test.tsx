import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { canopBaseMessages, CanopI18nProvider } from "@canop/ui";
import { App } from "../../../App";
import { VitrineThemeRoot } from "../../../season/VitrineThemeRoot";

type Locale = "fr" | "en";

const ACTION_BUTTONDOWN = "https://buttondown.com/api/emails/embed-subscribe/canopui";
const EMAIL_VALIDE = "martin@example.com";

const TEXTES = {
  fr: {
    titre: "Rejoindre la bêta",
    succes: "Termine ton inscription dans l'onglet ouvert, puis confirme depuis ta boîte mail.",
  },
  en: {
    titre: "Join the beta",
    succes: /Finish signing up in the tab that just opened/,
  },
} as const;

function monteAccueil(locale: Locale = "fr") {
  render(
    <VitrineThemeRoot>
      <CanopI18nProvider locale={locale} messages={canopBaseMessages}>
        <App />
      </CanopI18nProvider>
    </VitrineThemeRoot>,
  );
  const formulaire = trouveFormulaire();
  return {
    formulaire,
    email: champEmail(formulaire),
    consentement: caseConsentement(formulaire),
    bouton: boutonInscription(formulaire),
    piege: champPiege(formulaire),
  };
}

function trouveFormulaire() {
  const formulaires = Array.from(document.querySelectorAll("form")).filter(
    (form) => form.querySelector('input[type="email"], input[name="email"]') !== null,
  );
  expect(formulaires).toHaveLength(1);
  return formulaires[0];
}

function champEmail(formulaire: HTMLFormElement) {
  return formulaire.querySelector<HTMLInputElement>('input[name="email"]')!;
}

function caseConsentement(formulaire: HTMLFormElement) {
  return within(formulaire).getByRole("checkbox");
}

function boutonInscription(formulaire: HTMLFormElement) {
  return formulaire.querySelector<HTMLButtonElement>("button")!;
}

function champPiege(formulaire: HTMLFormElement) {
  const visibles = new Set<Element>([champEmail(formulaire), caseConsentement(formulaire)]);
  const autres = Array.from(formulaire.querySelectorAll<HTMLInputElement>("input")).filter(
    (input) => !visibles.has(input) && input.type !== "hidden",
  );
  expect(autres).toHaveLength(1);
  return autres[0];
}

function soumetEtObserve(declencheur: () => void) {
  let bloquee: boolean | undefined;
  const ecouteur = (event: Event) => {
    bloquee = event.defaultPrevented;
  };
  window.addEventListener("submit", ecouteur);
  declencheur();
  window.removeEventListener("submit", ecouteur);
  return bloquee;
}

function soumet(formulaire: HTMLFormElement) {
  return soumetEtObserve(() => {
    fireEvent.submit(formulaire);
  });
}

function saisit(champ: HTMLInputElement, valeur: string) {
  fireEvent.change(champ, { target: { value: valeur } });
}

function enPixels(taille: string) {
  return taille.endsWith("rem") ? parseFloat(taille) * 16 : parseFloat(taille);
}

function estVisuellementMasque(element: HTMLElement) {
  const style = getComputedStyle(element);
  const horsFlux = style.position === "absolute" || style.position === "fixed";
  const minuscule = enPixels(style.width) <= 1 && enPixels(style.height) <= 1;
  const invisible =
    style.display === "none" || style.visibility === "hidden" || style.opacity === "0";
  return invisible || (horsFlux && minuscule && style.overflow === "hidden");
}

function succesAffiche(locale: Locale) {
  return screen.queryByText(TEXTES[locale].succes) !== null;
}

function texteDe(element: Element) {
  return element.textContent ?? "";
}

beforeEach(() => {
  window.location.hash = "";
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.reject(new Error("aucune requête réseau attendue"))),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AC1 - carte d'inscription à la bêta", () => {
  it.each(["fr", "en"] as const)(
    "affiche le titre, l'email, le consentement, le bouton et l'info Buttondown en %s",
    (locale) => {
      const { formulaire, email, consentement, bouton } = monteAccueil(locale);
      expect(screen.getAllByText(TEXTES[locale].titre).length).toBeGreaterThan(0);
      expect(estVisuellementMasque(email)).toBe(false);
      expect(consentement.isConnected).toBe(true);
      expect(bouton.isConnected).toBe(true);
      expect(texteDe(bouton).trim().length).toBeGreaterThan(0);
      expect(texteDe(formulaire.parentElement ?? formulaire)).toMatch(/Buttondown/);
    },
  );
});

describe("AC2 - formulaire natif Buttondown", () => {
  it("porte les attributs method, action, target, rel et noValidate attendus", () => {
    const { formulaire } = monteAccueil();
    expect(formulaire.getAttribute("method")?.toLowerCase()).toBe("post");
    expect(formulaire.getAttribute("action")).toBe(ACTION_BUTTONDOWN);
    expect(formulaire.getAttribute("target")).toBe("_blank");
    expect(formulaire.getAttribute("rel")).toBe("noopener");
    expect(formulaire.noValidate).toBe(true);
  });

  it("n'expose que les champs nommés email et embed=1", () => {
    const { formulaire } = monteAccueil();
    const nommes = Array.from(formulaire.querySelectorAll("[name]")).map((el) =>
      el.getAttribute("name"),
    );
    expect(nommes.sort()).toEqual(["email", "embed"]);
    const embed = formulaire.querySelector<HTMLInputElement>('[name="embed"]')!;
    expect(embed.value).toBe("1");
    expect(formulaire.querySelector('[name="tag"]')).toBeNull();
  });

  it("ne nomme ni le piège ni la case de consentement", () => {
    const { consentement, piege } = monteAccueil();
    expect(consentement.hasAttribute("name")).toBe(false);
    expect(piege.hasAttribute("name")).toBe(false);
  });

  it("utilise un bouton de type submit", () => {
    const { bouton } = monteAccueil();
    expect(bouton.type).toBe("submit");
  });
});

describe("AC3 - validation de l'email", () => {
  it.each([
    ["vide", ""],
    ["sans arobase", "martin.example.com"],
    ["sans domaine", "martin@"],
    ["avec espaces seuls", "   "],
  ])("bloque la soumission et affiche une erreur quand l'email est %s", (_cas, valeur) => {
    const { formulaire, email, consentement } = monteAccueil();
    fireEvent.click(consentement);
    saisit(email, valeur);
    const texteAvant = texteDe(formulaire);
    expect(soumet(formulaire)).toBe(true);
    expect(email.getAttribute("aria-invalid")).toBe("true");
    expect(texteDe(formulaire).length).toBeGreaterThan(texteAvant.length);
  });

  it("efface l'erreur quand l'email est retapé", () => {
    const { formulaire, email, consentement } = monteAccueil();
    fireEvent.click(consentement);
    const texteInitial = texteDe(formulaire);
    soumet(formulaire);
    expect(email.getAttribute("aria-invalid")).toBe("true");
    saisit(email, "m");
    expect(email.getAttribute("aria-invalid")).not.toBe("true");
    expect(texteDe(formulaire)).toBe(texteInitial);
  });
});

describe("AC4 - consentement RGPD", () => {
  it("présente la case décochée par défaut", () => {
    const { consentement } = monteAccueil();
    expect((consentement as HTMLInputElement).checked).toBe(false);
  });

  it("bloque la soumission et affiche un message tant que la case n'est pas cochée", () => {
    const { formulaire, email } = monteAccueil();
    saisit(email, EMAIL_VALIDE);
    const texteAvant = texteDe(formulaire);
    expect(soumet(formulaire)).toBe(true);
    expect(texteDe(formulaire).length).toBeGreaterThan(texteAvant.length);
    expect(succesAffiche("fr")).toBe(false);
  });

  it("efface l'erreur de consentement quand la case est cochée", () => {
    const { formulaire, email, consentement } = monteAccueil();
    saisit(email, EMAIL_VALIDE);
    const texteInitial = texteDe(formulaire);
    soumet(formulaire);
    fireEvent.click(consentement);
    expect((consentement as HTMLInputElement).checked).toBe(true);
    expect(texteDe(formulaire)).toBe(texteInitial);
  });
});

describe("AC5 - envoi valide", () => {
  it.each(["fr", "en"] as const)(
    "laisse partir la soumission et affiche le message de fin d'inscription en %s",
    (locale) => {
      const { formulaire, email, consentement } = monteAccueil(locale);
      saisit(email, EMAIL_VALIDE);
      fireEvent.click(consentement);
      expect(soumet(formulaire)).toBe(false);
      expect(succesAffiche(locale)).toBe(true);
      expect(champEmail(trouveFormulaire()).value).toBe(EMAIL_VALIDE);
      expect(fetch).not.toHaveBeenCalled();
    },
  );

  it("laisse partir la soumission déclenchée par le clic sur le bouton", () => {
    const { email, consentement, bouton } = monteAccueil();
    saisit(email, EMAIL_VALIDE);
    fireEvent.click(consentement);
    const bloquee = soumetEtObserve(() => {
      fireEvent.click(bouton);
    });
    expect(bloquee).toBe(false);
    expect(succesAffiche("fr")).toBe(true);
  });
});

describe("AC6 - touche Entrée", () => {
  it("soumet le formulaire quand Entrée est pressée dans le champ email", async () => {
    const { userEvent } = await import("@testing-library/user-event");
    const { formulaire, email, consentement } = monteAccueil();
    fireEvent.click(consentement);
    let soumissions = 0;
    formulaire.addEventListener("submit", () => {
      soumissions += 1;
    });
    await userEvent.type(email, `${EMAIL_VALIDE}{Enter}`);
    expect(soumissions).toBe(1);
    expect(succesAffiche("fr")).toBe(true);
  });
});

describe("AC7 - honeypot", () => {
  it("cache le piège, le retire de la navigation clavier et le marque aria-hidden", () => {
    const { piege } = monteAccueil();
    const conteneurMasque = piege.closest<HTMLElement>('[aria-hidden="true"]');
    expect(conteneurMasque).not.toBeNull();
    expect(estVisuellementMasque(conteneurMasque!)).toBe(true);
    expect(piege.tabIndex).toBe(-1);
  });

  it("bloque la soumission et affiche le faux succès quand le piège est rempli", () => {
    const { formulaire, email, consentement, piege } = monteAccueil();
    saisit(email, EMAIL_VALIDE);
    fireEvent.click(consentement);
    saisit(piege, "robot");
    expect(soumet(formulaire)).toBe(true);
    expect(succesAffiche("fr")).toBe(true);
  });
});

describe("AC8 - langue", () => {
  it("affiche des textes de carte différents en français et en anglais", () => {
    const { formulaire: fr } = monteAccueil("fr");
    const texteFr = texteDe(fr.parentElement ?? fr);
    cleanup();
    const { formulaire: en } = monteAccueil("en");
    const texteEn = texteDe(en.parentElement ?? en);
    expect(texteFr).not.toBe(texteEn);
    expect(screen.queryByText(TEXTES.fr.titre)).toBeNull();
  });
});
