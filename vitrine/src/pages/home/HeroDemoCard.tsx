import { Button, Card, Feedback, Input, ProgressBar, Stack, StatusChip, Toggle } from "@canop/ui";
import { useDocLocale } from "../../i18n/useDocLocale";
import { useHeroDemo } from "./useHeroDemo";

const fr = {
  title: "Rejoindre la bêta",
  subtitle: "Démo interactive — 100 % CanopUI",
  emailLabel: "Email",
  notificationsLabel: "Recevoir les notifications",
  notificationsOn: "Activées",
  notificationsOff: "Coupées",
  success: "Inscription envoyée — bienvenue !",
  submit: "S'inscrire",
};

const en: typeof fr = {
  title: "Join the beta",
  subtitle: "Interactive demo — 100% CanopUI",
  emailLabel: "Email",
  notificationsLabel: "Receive notifications",
  notificationsOn: "On",
  notificationsOff: "Off",
  success: "Sign-up sent — welcome aboard!",
  submit: "Sign up",
};

const texts = { fr, en };

export function HeroDemoCard() {
  const t = texts[useDocLocale()];
  const { email, setEmail, notifications, setNotifications, progress, sending, sent, send } =
    useHeroDemo();

  return (
    <Card title={t.title} subtitle={t.subtitle} elevation="lg">
      <Stack gap="md">
        <Input
          label={t.emailLabel}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="martin@qvl-studio.com"
          icon="mail"
        />
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Toggle
            checked={notifications}
            onChange={setNotifications}
            ariaLabel={t.notificationsLabel}
          />
          <StatusChip
            tone={notifications ? "success" : "neutral"}
            label={notifications ? t.notificationsOn : t.notificationsOff}
          />
        </Stack>
        {sending ? <ProgressBar value={progress} /> : null}
        {sent ? <Feedback severity="success">{t.success}</Feedback> : null}
        <Button variant="primary" fullWidth loading={sending} onClick={send}>
          {t.submit}
        </Button>
      </Stack>
    </Card>
  );
}
