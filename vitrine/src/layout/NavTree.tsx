import Box from "@mui/material/Box";
import { squircleClip, tokens } from "@canop/ui";
import Typography from "@mui/material/Typography";
import { Stack } from "@canop/ui";
import { navCategories, type NavEntry } from "../registry/nav";
import { routeHref } from "../router/routes";
import { useDocLocale, type DocLocale } from "../i18n/useDocLocale";

interface NavTreeLinkProps {
  entry: NavEntry;
  locale: DocLocale;
  active: boolean;
  onNavigate?: () => void;
}

function NavTreeLink({ entry, locale, active, onNavigate }: NavTreeLinkProps) {
  return (
    <Box
      component="a"
      href={routeHref(entry.path)}
      onClick={onNavigate}
      sx={{
        display: "block",
        padding: "0.375rem 0.75rem",
        fontSize: "0.9rem",
        fontWeight: active ? 700 : 400,
        color: active ? "primary.main" : "text.secondary",
        ...squircleClip(tokens.radius.sm),
        textDecoration: "none",

        backgroundColor: active
          ? "color-mix(in srgb, var(--canop-palette-primary-main) 12%, transparent)"
          : "transparent",

        transition: "background-color 160ms ease, color 160ms ease",

        "&:hover": {
          backgroundColor: active
            ? "color-mix(in srgb, var(--canop-palette-primary-main) 16%, transparent)"
            : "color-mix(in srgb, var(--canop-palette-text-primary) 6%, transparent)",
          color: active ? "primary.main" : "text.primary",
        },
      }}
    >
      {entry.title[locale]}
    </Box>
  );
}

export interface NavTreeProps {
  activePath: string;
  onNavigate?: () => void;
}

export function NavTree({ activePath, onNavigate }: NavTreeProps) {
  const locale = useDocLocale();
  return (
    <Stack gap="lg">
      {navCategories.map((category) => (
        <Stack key={category.title.fr} gap="xs">
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "text.secondary",
              paddingLeft: "0.75rem",
            }}
          >
            {category.title[locale]}
          </Typography>
          <Stack gap="xs">
            {category.entries.map((entry) => (
              <NavTreeLink
                key={entry.path}
                entry={entry}
                locale={locale}
                active={activePath === entry.path}
                onNavigate={onNavigate}
              />
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
