import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Card, CardGrid, Heading, Link, Stack } from "@canop/ui";
import { componentCategories, type NavEntry } from "../../registry/nav";
import { routeHref } from "../../router/routes";
import { useDocLocale, type DocLocale } from "../../i18n/useDocLocale";

const labels = {
  fr: {
    title: "Composants",
    intro:
      "Tous les composants du design system, documentés avec démos interactives, code source et référence complète des props.",
    seeDoc: "Voir la documentation →",
  },
  en: {
    title: "Components",
    intro:
      "All design system components, documented with interactive demos, source code and a complete props reference.",
    seeDoc: "View documentation →",
  },
};

function ComponentCard({ entry, locale }: { entry: NavEntry; locale: DocLocale }) {
  return (
    <Box
      component="a"
      href={routeHref(entry.path)}
      sx={{
        textDecoration: "none",
        display: "block",
        transition: "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)",
        "@media (prefers-reduced-motion: no-preference)": {
          "&:hover": { transform: "translateY(-0.25rem)" },
        },
      }}
    >
      <Card title={entry.title[locale]} elevation="sm" fill>
        <Stack gap="sm">
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.9rem",
            }}
          >
            {entry.description[locale]}
          </Typography>
          <Link href={routeHref(entry.path)} size="small">
            {labels[locale].seeDoc}
          </Link>
        </Stack>
      </Card>
    </Box>
  );
}

export function ComponentsIndexPage() {
  const locale = useDocLocale();
  const t = labels[locale];
  return (
    <Stack gap="xl">
      <Stack gap="sm">
        <Heading level={1} size={3} gutterBottom={false}>
          {t.title}
        </Heading>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: "1.1rem",
          }}
        >
          {t.intro}
        </Typography>
      </Stack>
      {componentCategories.map((category) => (
        <Stack key={category.title.fr} gap="md">
          <Heading level={2} size={4} gutterBottom={false}>
            {category.title[locale]}
          </Heading>
          <CardGrid minItemWidth="17rem" gap="md">
            {category.entries.map((entry) => (
              <ComponentCard key={entry.path} entry={entry} locale={locale} />
            ))}
          </CardGrid>
        </Stack>
      ))}
    </Stack>
  );
}
