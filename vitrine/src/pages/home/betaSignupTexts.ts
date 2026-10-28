import type { DocLocale } from "../../i18n/useDocLocale";

export interface BetaSignupTexts {
  title: string;
  subtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  consentLabel: string;
  consentMissing: string;
  privacyNote: string;
  privacyLink: string;
  submit: string;
  sent: string;
}

const fr: BetaSignupTexts = {
  title: "Rejoindre la bêta",
  subtitle: "Reçois les nouveautés en avant-première.",
  emailLabel: "Email",
  emailPlaceholder: "toi@exemple.com",
  consentLabel:
    "J'accepte de recevoir les annonces de CanopUI (bêta, nouvelles versions). Désinscription en un clic.",
  consentMissing: "Coche cette case pour recevoir les annonces.",
  privacyNote:
    "L'inscription s'ouvre chez Buttondown, service hébergé aux États-Unis, qui gère ton email pour le compte de CanopUI, uniquement pour ces annonces.",
  privacyLink: "Politique de confidentialité de Buttondown",
  submit: "S'inscrire",
  sent: "Termine ton inscription dans l'onglet ouvert, puis confirme depuis ta boîte mail.",
};

const en: BetaSignupTexts = {
  title: "Join the beta",
  subtitle: "Get the news before anyone else.",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  consentLabel:
    "I agree to receive CanopUI announcements (beta, new releases). Unsubscribe in one click.",
  consentMissing: "Tick this box to receive the announcements.",
  privacyNote:
    "Sign-up opens on Buttondown, a US-hosted service that handles your email on behalf of CanopUI, only for these announcements.",
  privacyLink: "Buttondown privacy policy",
  submit: "Sign up",
  sent: "Finish signing up in the tab that just opened, then confirm from your inbox.",
};

export const betaSignupTexts: Record<DocLocale, BetaSignupTexts> = { fr, en };
