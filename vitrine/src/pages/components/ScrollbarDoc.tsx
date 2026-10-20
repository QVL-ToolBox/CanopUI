import Box from "@mui/material/Box";
import { Text, scrollbarSx } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { scrollbarSx } from "@canop/ui";`;

const defaultCode = `<Box sx={{ maxHeight: "12rem", overflowY: "auto" }}>{contenu}</Box>`;

const variantCode = `<Box sx={{ maxHeight: "12rem", overflowY: "auto", ...scrollbarSx("thin") }}>
  {contenu}
</Box>`;

const filler = Array.from({ length: 14 }, (_, index) => index + 1);

function Scroller({ sx, label }: { sx?: object; label: string }) {
  return (
    <Box
      sx={{
        maxHeight: "10rem",
        overflowY: "auto",
        width: "100%",
        padding: "0.75rem 1rem",
        backgroundColor: "var(--canop-palette-background-paper)",
        ...sx,
      }}
    >
      {filler.map((line) => (
        <Text key={line} variant="body-sm" tone={line === 1 ? "default" : "muted"}>
          {line === 1 ? label : `Ligne ${line}`}
        </Text>
      ))}
    </Box>
  );
}

const fr = {
  intro:
    "La barre de défilement fait partie du design system. Le thème l'applique à toute la page, sans qu'aucun composant ait à la demander. scrollbarSx n'est là que pour les cas particuliers : amincir la barre, ou l'effacer.",
  sections: {
    usage: "Par défaut",
    variants: "Variantes",
    api: "API",
  },
  demos: {
    defaultTitle: "Aucune intervention",
    defaultDescription:
      "Cette zone ne déclare que son débordement. La barre vient du thème, comme celle de la page.",
    defaultLabel: "Barre par défaut",
    variantTitle: "thin et hidden",
    variantDescription:
      "thin conserve la forme et la couleur en réduisant la largeur. hidden efface la barre des deux moteurs à la fois, sans supprimer le défilement.",
    thinLabel: "Barre fine",
    hiddenLabel: "Barre effacée",
  },
  props: {
    variant:
      "default reprend la barre du thème, thin la réduit, hidden la masque sans empêcher le défilement.",
  },
};

const en = {
  intro:
    "The scrollbar is part of the design system. The theme applies it to the whole page, with no component having to ask. scrollbarSx only exists for the exceptions: a thinner bar, or no bar at all.",
  sections: { usage: "By default", variants: "Variants", api: "API" },
  demos: {
    defaultTitle: "No intervention",
    defaultDescription:
      "This area only declares its overflow. The bar comes from the theme, like the page's own.",
    defaultLabel: "Default bar",
    variantTitle: "thin and hidden",
    variantDescription:
      "thin keeps the shape and colour while narrowing the bar. hidden removes it from both engines at once, without disabling scrolling.",
    thinLabel: "Thin bar",
    hiddenLabel: "Hidden bar",
  },
  props: {
    variant:
      "default reuses the theme bar, thin narrows it, hidden hides it without preventing scrolling.",
  },
};

const texts = { fr, en };

export default function ScrollbarDoc() {
  const t = texts[useDocLocale()];
  const propRows: PropRow[] = [
    {
      name: "variant",
      type: '"default" | "thin" | "hidden"',
      defaultValue: '"default"',
      description: t.props.variant,
    },
  ];

  return (
    <DocPage title="Scrollbar" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.defaultTitle}
          description={t.demos.defaultDescription}
          code={defaultCode}
          align="stretch"
        >
          <Scroller label={t.demos.defaultLabel} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.variants}>
        <DemoCard
          title={t.demos.variantTitle}
          description={t.demos.variantDescription}
          code={variantCode}
          align="stretch"
        >
          <Scroller sx={scrollbarSx("thin")} label={t.demos.thinLabel} />
          <Scroller sx={scrollbarSx("hidden")} label={t.demos.hiddenLabel} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
