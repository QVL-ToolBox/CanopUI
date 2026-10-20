import Typography from "@mui/material/Typography";
import { Button, Heading, Stack } from "@canop/ui";
import { navigateTo } from "../router/routes";
import { useDocLocale } from "../i18n/useDocLocale";

const labels = {
  fr: {
    title: "Page introuvable",
    body: "Cette page n'existe pas dans la vitrine CanopUI.",
    back: "Retour à l'accueil",
  },
  en: {
    title: "Page not found",
    body: "This page does not exist in the CanopUI showcase.",
    back: "Back to home",
  },
};

export function NotFoundPage() {
  const t = labels[useDocLocale()];
  return (
    <Stack alignItems="center" gap="md" padding="xl">
      <Heading level={1} size={3} gutterBottom={false}>
        {t.title}
      </Heading>
      <Typography
        sx={{
          color: "text.secondary",
        }}
      >
        {t.body}
      </Typography>
      <Button variant="primary" onClick={() => navigateTo("/")}>
        {t.back}
      </Button>
    </Stack>
  );
}
