import type { CanopLocale, CanopMessages } from "./messages";

export const canopErrorMessages: Record<CanopLocale, CanopMessages> = {
  fr: {
    "canop.error.bad_request": "Requête invalide. Vérifiez les informations saisies.",
    "canop.error.unauthorized": "Identifiants invalides.",
    "canop.error.forbidden": "Accès refusé.",
    "canop.error.conflict": "Cette ressource existe déjà.",
    "canop.error.not_found": "Ressource introuvable.",
    "canop.error.account_pending":
      "Votre compte est en attente de validation par un administrateur.",
    "canop.error.account_disabled": "Votre compte a été désactivé.",
    "canop.error.device_not_allowed":
      "Vous n'êtes pas autorisé à vous connecter depuis cet appareil.",
    "canop.error.internal_error": "Une erreur interne est survenue. Veuillez réessayer plus tard.",
    "canop.error.network": "Impossible de joindre le serveur. Vérifiez votre connexion.",
    "canop.error.unknown": "Une erreur est survenue.",
  },
  en: {
    "canop.error.bad_request": "Invalid request. Please check the submitted information.",
    "canop.error.unauthorized": "Invalid credentials.",
    "canop.error.forbidden": "Access denied.",
    "canop.error.conflict": "This resource already exists.",
    "canop.error.not_found": "Resource not found.",
    "canop.error.account_pending": "Your account is awaiting administrator approval.",
    "canop.error.account_disabled": "Your account has been disabled.",
    "canop.error.device_not_allowed": "You are not allowed to sign in from this device.",
    "canop.error.internal_error": "An internal error occurred. Please try again later.",
    "canop.error.network": "Unable to reach the server. Check your connection.",
    "canop.error.unknown": "An error occurred.",
  },
};
