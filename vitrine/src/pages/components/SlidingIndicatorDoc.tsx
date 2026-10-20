import Box from "@mui/material/Box";
import { useState } from "react";
import { SlidingIndicator } from "@canop/ui";
import { squircleClip } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { SlidingIndicator } from "@canop/ui";`;

const usageCode = `function Tabs({ labels }: { labels: string[] }) {
  const [active, setActive] = useState(0);

  return (
    <Box display="flex" gap="0.25rem" padding="0.25rem" bgcolor="surface.sunken">
      {labels.map((label, index) => (
        <Box
          key={label}
          component="button"
          onClick={() => setActive(index)}
          position="relative"
          sx={{ color: active === index ? "text.primary" : "text.secondary" }}
        >
          {active === index && <SlidingIndicator layoutId="tabs" />}
          <Box component="span" position="relative" zIndex={1}>
            {label}
          </Box>
        </Box>
      ))}
    </Box>
  );
}`;

const tabs = ["Aperçu", "Activité", "Réglages"];

function SlidingTabsDemo() {
  const [active, setActive] = useState(0);

  return (
    <Box
      sx={[
        {
          display: "inline-flex",
          gap: "0.25rem",
          padding: "0.25rem",
          bgcolor: "surface.sunken",
        },
        squircleClip("var(--canop-radius-lg)"),
      ]}
    >
      {tabs.map((label, index) => (
        <Box
          key={label}
          component="button"
          type="button"
          onClick={() => setActive(index)}
          sx={{
            position: "relative",
            border: "none",
            paddingX: "1rem",
            paddingY: "0.5rem",
            borderRadius: "var(--canop-radius-md)",
            bgcolor: "transparent",
            cursor: "pointer",
            color: active === index ? "text.primary" : "text.secondary",
            font: "inherit",
          }}
        >
          {active === index && (
            <SlidingIndicator
              layoutId="canop-vitrine-sliding-tabs"
              radius="var(--canop-radius-md)"
            />
          )}
          <Box
            component="span"
            sx={{
              position: "relative",
              zIndex: 1,
            }}
          >
            {label}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

const fr = {
  intro:
    "Primitive d'animation partagée : un cartouche qui glisse d'un élément à l'autre grâce aux animations de layout de Framer Motion. Placez-le dans l'élément actif — quand l'actif change, l'indicateur se déplace en douceur. C'est le mécanisme derrière SegmentedControl et ThemeToggle.",
  sections: {
    usage: "Utilisation",
    integration: "Intégration",
    api: "API",
  },
  demos: {
    usageTitle: "Onglets coulissants",
    usageDescription:
      "Ne montez SlidingIndicator que dans l'élément actif, avec un layoutId commun. Le parent doit être en position relative pour l'accueillir. Cliquez sur un onglet pour voir le cartouche glisser.",
  },
  integrationDescription:
    "Tous les indicateurs partageant le même layoutId sont reliés par Motion : au changement d'actif, l'indicateur démonté d'un élément se remonte dans le nouveau et anime sa position. Isolez chaque groupe avec un layoutId unique. L'animation respecte prefers-reduced-motion : elle devient instantanée pour les utilisateurs concernés.",
  props: {
    layoutId: "Identifiant de layout partagé qui relie les instances entre lesquelles glisser.",
    radius: "Rayon d'arrondi du cartouche (valeur CSS).",
    shadow: "Ombre portée du cartouche (valeur CSS).",
    background: "Couleur de fond du cartouche (valeur CSS).",
    transition:
      "Transition Framer Motion personnalisée ; à défaut, une transition organique du thème.",
  },
};

const en: typeof fr = {
  intro:
    "A shared animation primitive: a pill that slides from one element to another thanks to Framer Motion layout animations. Place it inside the active element — when the active one changes, the indicator moves smoothly. It is the mechanism behind SegmentedControl and ThemeToggle.",
  sections: {
    usage: "Usage",
    integration: "Integration",
    api: "API",
  },
  demos: {
    usageTitle: "Sliding tabs",
    usageDescription:
      "Mount SlidingIndicator only inside the active element, with a shared layoutId. The parent must be relatively positioned to host it. Click a tab to see the pill slide.",
  },
  integrationDescription:
    "All indicators sharing the same layoutId are linked by Motion: when the active one changes, the indicator unmounted from one element remounts in the new one and animates its position. Isolate each group with a unique layoutId. The animation respects prefers-reduced-motion: it becomes instant for the users concerned.",
  props: {
    layoutId: "Shared layout id that links the instances to slide between.",
    radius: "Corner radius of the pill (CSS value).",
    shadow: "Drop shadow of the pill (CSS value).",
    background: "Background color of the pill (CSS value).",
    transition: "Custom Framer Motion transition; otherwise an organic theme transition.",
  },
};

const texts = { fr, en };

export default function SlidingIndicatorDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "layoutId",
      type: "string",
      defaultValue: '"canop-sliding-indicator"',
      description: t.props.layoutId,
    },
    {
      name: "radius",
      type: "string",
      defaultValue: '"var(--canop-radius-md)"',
      description: t.props.radius,
    },
    {
      name: "shadow",
      type: "string",
      defaultValue: '"var(--canop-shadow-e1)"',
      description: t.props.shadow,
    },
    {
      name: "background",
      type: "string",
      defaultValue: '"var(--canop-palette-background-paper)"',
      description: t.props.background,
    },
    { name: "transition", type: "Transition", description: t.props.transition },
  ];

  return (
    <DocPage title="SlidingIndicator" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.usageTitle}
          description={t.demos.usageDescription}
          code={usageCode}
        >
          <SlidingTabsDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.integration} description={t.integrationDescription} />
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
