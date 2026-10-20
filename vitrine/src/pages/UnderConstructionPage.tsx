import Typography from "@mui/material/Typography";
import { Heading, Spinner, Stack } from "@canop/ui";
import { useDocLocale } from "../i18n/useDocLocale";

const labels = {
  fr: {
    title: "Page en cours de rédaction",
    body: "La documentation de ce composant arrive très bientôt.",
  },
  en: {
    title: "Page being written",
    body: "This component's documentation is coming very soon.",
  },
};

export function UnderConstructionPage() {
  const t = labels[useDocLocale()];
  return (
    <Stack alignItems="center" gap="md" padding="xl">
      <Spinner />
      <Heading level={1} size={4} gutterBottom={false}>
        {t.title}
      </Heading>
      <Typography
        sx={{
          color: "text.secondary",
        }}
      >
        {t.body}
      </Typography>
    </Stack>
  );
}
