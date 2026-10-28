const BUTTONDOWN_USERNAME_FALLBACK = "canopui";

const BUTTONDOWN_USERNAME =
  import.meta.env.VITE_BUTTONDOWN_USERNAME?.trim() || BUTTONDOWN_USERNAME_FALLBACK;

export const BUTTONDOWN_EMBED_SUBSCRIBE_URL = `https://buttondown.com/api/emails/embed-subscribe/${encodeURIComponent(BUTTONDOWN_USERNAME)}`;

export const BUTTONDOWN_PRIVACY_URL = "https://buttondown.com/legal/privacy";
