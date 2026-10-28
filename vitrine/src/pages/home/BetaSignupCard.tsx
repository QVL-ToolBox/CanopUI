import { Button, Card, Checkbox, InputEmail, Link, Stack, Text } from "@canop/ui";
import Box from "@mui/material/Box";
import { BUTTONDOWN_PRIVACY_URL } from "../../config/newsletter";
import { useDocLocale } from "../../i18n/useDocLocale";
import { BetaHoneypotField } from "./BetaHoneypotField";
import { BetaSignupOutcome } from "./BetaSignupOutcome";
import { betaSignupTexts } from "./betaSignupTexts";
import { useBetaSignup } from "./useBetaSignup";

export function BetaSignupCard() {
  const t = betaSignupTexts[useDocLocale()];
  const {
    action,
    email,
    setEmail,
    emailError,
    consent,
    setConsent,
    consentMissing,
    honeypot,
    setHoneypot,
    sent,
    submit,
  } = useBetaSignup();

  return (
    <Card title={t.title} subtitle={t.subtitle} elevation="lg">
      <Box
        component="form"
        method="post"
        action={action}
        target="_blank"
        rel="noopener"
        noValidate
        onSubmit={submit}
      >
        <Stack gap="md">
          <InputEmail
            label={t.emailLabel}
            name="email"
            value={email}
            onChange={setEmail}
            error={emailError}
            placeholder={t.emailPlaceholder}
          />
          <input type="hidden" name="embed" value="1" />
          <Checkbox
            checked={consent}
            onChange={setConsent}
            label={t.consentLabel}
            error={consentMissing ? t.consentMissing : null}
          />
          <BetaHoneypotField value={honeypot} onChange={setHoneypot} />
          <BetaSignupOutcome message={sent ? t.sent : null} />
          <Button type="submit" variant="primary" fullWidth>
            {t.submit}
          </Button>
          <Text variant="caption" tone="muted">
            {t.privacyNote}{" "}
            <Link href={BUTTONDOWN_PRIVACY_URL} external size="xsmall" color="muted">
              {t.privacyLink}
            </Link>
          </Text>
        </Stack>
      </Box>
    </Card>
  );
}
