import Box from "@mui/material/Box";
import { Divider } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Divider } from "@canop/ui";`;

const horizontalCode = `<Box width="100%">
  <Box>Premier bloc de contenu</Box>
  <Divider />
  <Box>Second bloc de contenu</Box>
</Box>`;

const verticalCode = `<Box display="flex" alignItems="stretch" height="3rem">
  <Box>Élément gauche</Box>
  <Divider orientation="vertical" flexItem />
  <Box>Élément droit</Box>
</Box>`;

const labelCode = `<Box width="100%">
  <Divider>ou</Divider>
</Box>`;

const spacingCode = `<Box width="100%">
  <Box>Contenu</Box>
  <Divider spacing="xs" />
  <Box>Séparateur resserré (xs)</Box>
  <Divider spacing="xl" />
  <Box>Séparateur aéré (xl)</Box>
</Box>`;

const fr = {
  intro:
    "Trait de séparation sémantique construit sur MUI. Il structure verticalement ou horizontalement un contenu, accepte un libellé central et propose une échelle d'espacement cohérente avec le reste de CanopUI.",
  sections: {
    horizontal: "Horizontal",
    vertical: "Vertical",
    label: "Avec libellé",
    spacing: "Espacement",
    api: "API",
  },
  demos: {
    horizontal: {
      title: "Séparer deux blocs",
      description: "Orientation par défaut, le trait s'étend sur toute la largeur disponible.",
    },
    vertical: {
      title: "Trait vertical",
      description:
        "Avec orientation vertical et flexItem, le séparateur s'aligne sur la hauteur d'un conteneur en ligne.",
    },
    label: {
      title: "Libellé central",
      description: "Un enfant textuel est centré sur le trait, utile pour séparer deux options.",
    },
    spacing: {
      title: "Échelle de spacing",
      description: "spacing règle la marge autour du trait, de none à xl.",
    },
  },
  props: {
    orientation: "Sens du trait de séparation.",
    spacing:
      "Marge appliquée de part et d'autre du trait, sur l'axe perpendiculaire à l'orientation.",
    flexItem:
      "Étire le séparateur pour s'adapter à la hauteur d'un conteneur flex, requis pour un trait vertical.",
    children: "Libellé optionnel affiché au centre du trait.",
  },
};

const en: typeof fr = {
  intro:
    "Semantic separator line built on MUI. It structures content vertically or horizontally, accepts a centered label and offers a spacing scale consistent with the rest of CanopUI.",
  sections: {
    horizontal: "Horizontal",
    vertical: "Vertical",
    label: "With label",
    spacing: "Spacing",
    api: "API",
  },
  demos: {
    horizontal: {
      title: "Separate two blocks",
      description: "Default orientation, the line spans the full available width.",
    },
    vertical: {
      title: "Vertical line",
      description:
        "With orientation vertical and flexItem, the separator matches the height of an inline container.",
    },
    label: {
      title: "Centered label",
      description: "A text child is centered on the line, useful to separate two options.",
    },
    spacing: {
      title: "Spacing scale",
      description: "spacing sets the margin around the line, from none to xl.",
    },
  },
  props: {
    orientation: "Direction of the separator line.",
    spacing:
      "Margin applied on either side of the line, along the axis perpendicular to its orientation.",
    flexItem:
      "Stretches the separator to fit the height of a flex container, required for a vertical line.",
    children: "Optional label shown at the center of the line.",
  },
};

const texts = { fr, en };

export default function DividerDoc() {
  const t = texts[useDocLocale()];
  const propRows: PropRow[] = [
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      defaultValue: '"horizontal"',
      description: t.props.orientation,
    },
    {
      name: "spacing",
      type: '"none" | "xs" | "sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description: t.props.spacing,
    },
    {
      name: "flexItem",
      type: "boolean",
      defaultValue: "false",
      description: t.props.flexItem,
    },
    {
      name: "children",
      type: "ReactNode",
      description: t.props.children,
    },
  ];

  return (
    <DocPage title="Divider" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.horizontal}>
        <DemoCard
          title={t.demos.horizontal.title}
          description={t.demos.horizontal.description}
          code={horizontalCode}
          align="stretch"
        >
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Box>Premier bloc de contenu</Box>
            <Divider />
            <Box>Second bloc de contenu</Box>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.vertical}>
        <DemoCard
          title={t.demos.vertical.title}
          description={t.demos.vertical.description}
          code={verticalCode}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "stretch",
              height: "3rem",
            }}
          >
            <Box>Élément gauche</Box>
            <Divider orientation="vertical" flexItem />
            <Box>Élément droit</Box>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.label}>
        <DemoCard
          title={t.demos.label.title}
          description={t.demos.label.description}
          code={labelCode}
          align="stretch"
        >
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Divider>ou</Divider>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.spacing}>
        <DemoCard
          title={t.demos.spacing.title}
          description={t.demos.spacing.description}
          code={spacingCode}
          align="stretch"
        >
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Box>Contenu</Box>
            <Divider spacing="xs" />
            <Box>Séparateur resserré (xs)</Box>
            <Divider spacing="xl" />
            <Box>Séparateur aéré (xl)</Box>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
