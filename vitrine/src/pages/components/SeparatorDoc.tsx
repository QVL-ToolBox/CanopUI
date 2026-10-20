import Box from "@mui/material/Box";
import { Separator } from "@canop/ui";
import { squircleClip, tokens } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Separator } from "@canop/ui";`;

const normalCode = `<Box bgcolor="primary.main" padding="1rem" borderRadius="0.75rem" width="100%">
  <Box color="primary.contrastText" paddingBottom="0.75rem">
    Élément supérieur
  </Box>
  <Separator />
  <Box color="primary.contrastText" paddingTop="0.75rem">
    Élément inférieur
  </Box>
</Box>`;

const fullWidthCode = `<Box bgcolor="primary.main" padding="1rem" borderRadius="0.75rem" width="100%">
  <Box color="primary.contrastText" paddingBottom="0.75rem">
    Élément supérieur
  </Box>
  <Separator variant="fullWidth" />
  <Box color="primary.contrastText" paddingTop="0.75rem">
    Le trait déborde jusqu'aux bords du conteneur
  </Box>
</Box>`;

const insetCode = `<Box bgcolor="primary.main" padding="2rem" borderRadius="0.75rem" width="100%">
  <Box color="primary.contrastText" paddingBottom="0.75rem">
    Élément supérieur
  </Box>
  <Separator variant="fullWidth" inset="2rem" />
  <Box color="primary.contrastText" paddingTop="0.75rem">
    inset aligné sur le padding du conteneur
  </Box>
</Box>`;

const fr = {
  intro:
    "Fin trait de séparation pensé pour les fonds colorés sombres (barre de navigation, panneaux sur fond primaire). Sa teinte dérive du contraste primaire et sa variante fullWidth permet de déborder du padding d'un conteneur.",
  sections: {
    basic: "Usage de base",
    fullWidth: "Pleine largeur",
    inset: "Retrait personnalisé",
    api: "API",
  },
  demos: {
    basic: {
      title: "Séparateur normal",
      description:
        "Le trait s'inscrit dans le flux du contenu, sur toute la largeur intérieure du conteneur.",
    },
    fullWidth: {
      title: "variant fullWidth",
      description:
        "Le trait déborde de l'inset pour rejoindre les bords du conteneur, utile pour séparer des sections d'un panneau.",
    },
    inset: {
      title: "inset",
      description:
        "Ajustez inset pour l'aligner sur le padding réel du conteneur en variant fullWidth.",
    },
  },
  props: {
    variant:
      "normal reste dans le flux du contenu, fullWidth déborde de l'inset pour atteindre les bords du conteneur.",
    inset:
      "Retrait latéral compensé en variant fullWidth ; à faire correspondre au padding du conteneur parent.",
  },
};

const en: typeof fr = {
  intro:
    "Thin separator line designed for dark colored backgrounds (navigation bar, panels on a primary background). Its tint derives from the primary contrast and its fullWidth variant lets it extend beyond a container's padding.",
  sections: {
    basic: "Basic usage",
    fullWidth: "Full width",
    inset: "Custom inset",
    api: "API",
  },
  demos: {
    basic: {
      title: "Normal separator",
      description:
        "The line sits within the content flow, across the full inner width of the container.",
    },
    fullWidth: {
      title: "variant fullWidth",
      description:
        "The line extends beyond the inset to reach the container edges, useful to separate the sections of a panel.",
    },
    inset: {
      title: "inset",
      description: "Adjust inset to match the container's actual padding in the fullWidth variant.",
    },
  },
  props: {
    variant:
      "normal stays within the content flow, fullWidth extends beyond the inset to reach the container edges.",
    inset:
      "Side inset compensated in the fullWidth variant; match it to the parent container's padding.",
  },
};

const texts = { fr, en };

export default function SeparatorDoc() {
  const t = texts[useDocLocale()];
  const propRows: PropRow[] = [
    {
      name: "variant",
      type: '"normal" | "fullWidth"',
      defaultValue: '"normal"',
      description: t.props.variant,
    },
    {
      name: "inset",
      type: "string",
      defaultValue: '"1rem"',
      description: t.props.inset,
    },
  ];

  return (
    <DocPage title="Separator" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.basic}>
        <DemoCard
          title={t.demos.basic.title}
          description={t.demos.basic.description}
          code={normalCode}
          align="stretch"
        >
          <Box
            sx={[
              {
                bgcolor: "primary.main",
                padding: "1rem",
                width: "100%",
              },
              squircleClip(tokens.radius.sm),
            ]}
          >
            <Box
              sx={{
                color: "primary.contrastText",
                paddingBottom: "0.75rem",
              }}
            >
              Élément supérieur
            </Box>
            <Separator />
            <Box
              sx={{
                color: "primary.contrastText",
                paddingTop: "0.75rem",
              }}
            >
              Élément inférieur
            </Box>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.fullWidth}>
        <DemoCard
          title={t.demos.fullWidth.title}
          description={t.demos.fullWidth.description}
          code={fullWidthCode}
          align="stretch"
        >
          <Box
            sx={[
              {
                bgcolor: "primary.main",
                padding: "1rem",
                width: "100%",
              },
              squircleClip(tokens.radius.sm),
            ]}
          >
            <Box
              sx={{
                color: "primary.contrastText",
                paddingBottom: "0.75rem",
              }}
            >
              Élément supérieur
            </Box>
            <Separator variant="fullWidth" />
            <Box
              sx={{
                color: "primary.contrastText",
                paddingTop: "0.75rem",
              }}
            >
              Le trait déborde jusqu'aux bords du conteneur
            </Box>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.inset}>
        <DemoCard
          title={t.demos.inset.title}
          description={t.demos.inset.description}
          code={insetCode}
          align="stretch"
        >
          <Box
            sx={[
              {
                bgcolor: "primary.main",
                padding: "2rem",
                width: "100%",
              },
              squircleClip(tokens.radius.sm),
            ]}
          >
            <Box
              sx={{
                color: "primary.contrastText",
                paddingBottom: "0.75rem",
              }}
            >
              Élément supérieur
            </Box>
            <Separator variant="fullWidth" inset="2rem" />
            <Box
              sx={{
                color: "primary.contrastText",
                paddingTop: "0.75rem",
              }}
            >
              inset aligné sur le padding du conteneur
            </Box>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
