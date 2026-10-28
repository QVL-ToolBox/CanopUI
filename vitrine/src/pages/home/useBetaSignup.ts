import { isValidEmail, useTranslation } from "@canop/ui";
import { useState, type FormEvent } from "react";
import { BUTTONDOWN_EMBED_SUBSCRIBE_URL } from "../../config/newsletter";

type BetaSignupEmailIssue = "required" | "email";

export interface UseBetaSignupResult {
  action: string;
  email: string;
  setEmail: (value: string) => void;
  emailError: string | null;
  consent: boolean;
  setConsent: (value: boolean) => void;
  consentMissing: boolean;
  honeypot: string;
  setHoneypot: (value: string) => void;
  sent: boolean;
  submit: (event: FormEvent<HTMLFormElement>) => void;
}

function findEmailIssue(email: string): BetaSignupEmailIssue | null {
  if (email === "") return "required";
  return isValidEmail(email) ? null : "email";
}

export function useBetaSignup(): UseBetaSignupResult {
  const { t } = useTranslation();
  const [email, setEmailValue] = useState("");
  const [emailIssue, setEmailIssue] = useState<BetaSignupEmailIssue | null>(null);
  const [consent, setConsentValue] = useState(false);
  const [consentMissing, setConsentMissing] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [sent, setSent] = useState(false);

  const setEmail = (value: string) => {
    setEmailValue(value);
    setEmailIssue(null);
    setSent(false);
  };

  const setConsent = (value: boolean) => {
    setConsentValue(value);
    setConsentMissing(false);
  };

  const holdBack = (event: FormEvent<HTMLFormElement>, fakeSuccess: boolean) => {
    event.preventDefault();
    setSent(fakeSuccess);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    if (honeypot !== "") {
      holdBack(event, true);
      return;
    }
    const issue = findEmailIssue(email.trim());
    setEmailIssue(issue);
    setConsentMissing(!consent);
    if (issue !== null || !consent) {
      holdBack(event, false);
      return;
    }
    setSent(true);
  };

  return {
    action: BUTTONDOWN_EMBED_SUBSCRIBE_URL,
    email,
    setEmail,
    emailError: emailIssue === null ? null : t(`canop.validation.${emailIssue}`),
    consent,
    setConsent,
    consentMissing,
    honeypot,
    setHoneypot,
    sent,
    submit,
  };
}
