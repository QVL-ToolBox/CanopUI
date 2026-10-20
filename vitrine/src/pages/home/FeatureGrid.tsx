import Typography from "@mui/material/Typography";
import { Card, CardGrid, Icon, Stack, type CanopIconName } from "@canop/ui";
import { useDocLocale } from "../../i18n/useDocLocale";

interface Feature {
  icon: CanopIconName;
  title: string;
  description: string;
}

const fr: Feature[] = [
  {
    icon: "apps",
    title: "40+ composants",
    description:
      "Boutons, formulaires, tables riches, navigation, upload par chunks : tout le socle des portails Studio.",
  },
  {
    icon: "moon",
    title: "Light & dark natifs",
    description:
      "Deux palettes complètes pilotées par CSS variables, avec détection du thème système et persistance.",
  },
  {
    icon: "shield",
    title: "Fiable et testé",
    description:
      "TypeScript strict, couverture de tests supérieure à 80 %, API stables et rétrocompatibles.",
  },
  {
    icon: "settings",
    title: "Design tokens",
    description:
      "Palette, typographie, espacements, rayons et ombres exposés en tokens réutilisables partout.",
  },
];

const en: typeof fr = [
  {
    icon: "apps",
    title: "40+ components",
    description:
      "Buttons, forms, rich tables, navigation, chunked uploads: the full foundation for Studio portals.",
  },
  {
    icon: "moon",
    title: "Native light & dark",
    description:
      "Two complete palettes driven by CSS variables, with system theme detection and persistence.",
  },
  {
    icon: "shield",
    title: "Reliable and tested",
    description: "Strict TypeScript, test coverage above 80%, stable and backward-compatible APIs.",
  },
  {
    icon: "settings",
    title: "Design tokens",
    description:
      "Palette, typography, spacing, radii and shadows exposed as tokens reusable everywhere.",
  },
];

const texts = { fr, en };

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <Card elevation="sm" fill>
      <Stack gap="sm">
        <Icon name={feature.icon} variant="solid" size="lg" color="primary" />
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1.05rem",
          }}
        >
          {feature.title}
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: "0.9rem",
            lineHeight: 1.6,
          }}
        >
          {feature.description}
        </Typography>
      </Stack>
    </Card>
  );
}

export function FeatureGrid() {
  const features = texts[useDocLocale()];
  return (
    <CardGrid minItemWidth="15rem" gap="lg">
      {features.map((feature) => (
        <FeatureCard key={feature.icon} feature={feature} />
      ))}
    </CardGrid>
  );
}
