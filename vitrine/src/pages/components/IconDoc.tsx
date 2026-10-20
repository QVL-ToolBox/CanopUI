import { Icon, Link, Stack } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Icon } from "@canop/ui";`;

const variantsCode = `<Icon name="sun" variant="outline" size="lg" />
<Icon name="sun" variant="solid" size="lg" />
<Icon name="moon" variant="outline" size="lg" />
<Icon name="moon" variant="solid" size="lg" />`;

const sizesCode = `<Icon name="home" size="xs" />
<Icon name="home" size="sm" />
<Icon name="home" size="md" />
<Icon name="home" size="lg" />
<Icon name="home" size="xl" />`;

const colorsCode = `<Icon name="shield" variant="solid" size="lg" color="primary" />
<Icon name="shield" variant="solid" size="lg" color="secondary" />
<Icon name="shield" variant="solid" size="lg" color="accent" />
<Icon name="shield" variant="solid" size="lg" color="error" />
<Icon name="shield" variant="solid" size="lg" color="warning" />
<Icon name="shield" variant="solid" size="lg" color="info" />
<Icon name="shield" variant="solid" size="lg" color="success" />
<Icon name="shield" variant="solid" size="lg" color="neutral" />
<Icon name="shield" variant="solid" size="lg" color="inherit" />`;

const titleCode = `<Icon name="settings" size="lg" title="Paramètres" />`;

const forgeIcons = ["gitBranch", "gitCommit", "pullRequest", "pipeline"] as const;

const forgeCode = `<Icon name="gitBranch" size="lg" />
<Icon name="gitCommit" size="lg" />
<Icon name="pullRequest" size="lg" />
<Icon name="pipeline" size="lg" />
<Icon name="gitBranch" variant="solid" size="lg" />
<Icon name="gitCommit" variant="solid" size="lg" />
<Icon name="pullRequest" variant="solid" size="lg" />
<Icon name="pipeline" variant="solid" size="lg" />`;

const fr = {
  intro:
    "Jeu d'icônes SVG CanopUI. Deux variantes de tracé, cinq tailles calées sur le rem et neuf couleurs sémantiques du thème, avec une gestion native de l'accessibilité.",
  sections: {
    variants: {
      title: "Variantes",
      demoTitle: "outline et solid",
      demoDescription:
        "La variante outline privilégie un tracé fin, solid un remplissage plein. Le rendu est identique pour les icônes qui ne déclinent qu'un seul dessin.",
    },
    sizes: {
      title: "Tailles",
      demoTitle: "Cinq tailles",
      demoDescription:
        "Les tailles s'échelonnent de xs (1rem) à xl (3rem), toutes exprimées en rem.",
    },
    colors: {
      title: "Couleurs",
      demoTitle: "Neuf couleurs du thème",
      demoDescription:
        "Chaque couleur est reliée à une variable du thème. neutral reprend le gris chaud text.disabled, inherit la couleur du texte environnant.",
    },
    a11y: {
      title: "Accessibilité",
      demoTitle: "Icône signifiante",
      demoDescription:
        "Renseignez title pour exposer un libellé aux technologies d'assistance. Sans title, l'icône est considérée décorative et masquée.",
    },
    forge: {
      title: "Forge logicielle",
      demoTitle: "Branche, commit, pull request, pipeline",
      demoDescription:
        "Quatre icônes pour les écrans de dépôts et d'intégration continue, dessinées sur la même grille de 24 et le même trait de 1,5 que le reste du jeu. La variante solid remplit les nœuds.",
    },
    gallery: {
      title: "Galerie complète",
      link: "Parcourir toutes les icônes disponibles",
    },
    api: "API",
  },
  props: {
    className:
      "Classe appliquée au SVG. Indispensable aux composants MUI qui acceptent une icône : ils la clonent pour y injecter leur propre classe — MuiChip-icon, Badge, Tab. Sans cette prop la classe est perdue, et l'icône avec elle les marges que le composant hôte lui destinait.",
    name: "Nom de l'icône à afficher, parmi le jeu d'icônes CanopUI.",
    variant: "Style de tracé. Certaines icônes partagent le même dessin pour les deux variantes.",
    size: "Taille de l'icône, de 1rem (xs) à 3rem (xl).",
    color:
      "Couleur de l'icône issue du thème. neutral mappe text.disabled, inherit reprend la couleur du texte parent.",
    title:
      "Intitulé de l'icône. S'il est fourni, l'icône expose un rôle image ; sinon elle est masquée aux lecteurs d'écran.",
    ariaLabel: "Nom accessible explicite. Prend le pas sur title.",
  },
};

const en: typeof fr = {
  intro:
    "CanopUI SVG icon set. Two stroke variants, five rem-based sizes and nine semantic theme colors, with built-in accessibility handling.",
  sections: {
    variants: {
      title: "Variants",
      demoTitle: "outline and solid",
      demoDescription:
        "The outline variant favors a thin stroke, solid a full fill. The rendering is identical for icons that ship a single drawing.",
    },
    sizes: {
      title: "Sizes",
      demoTitle: "Five sizes",
      demoDescription: "Sizes range from xs (1rem) to xl (3rem), all expressed in rem.",
    },
    colors: {
      title: "Colors",
      demoTitle: "Nine theme colors",
      demoDescription:
        "Each color is bound to a theme variable. neutral uses the warm gray text.disabled, inherit the color of the surrounding text.",
    },
    a11y: {
      title: "Accessibility",
      demoTitle: "Meaningful icon",
      demoDescription:
        "Set title to expose a label to assistive technologies. Without title, the icon is treated as decorative and hidden.",
    },
    forge: {
      title: "Software forge",
      demoTitle: "Branch, commit, pull request, pipeline",
      demoDescription:
        "Four icons for repository and continuous integration screens, drawn on the same 24 grid and the same 1.5 stroke as the rest of the set. The solid variant fills the nodes.",
    },
    gallery: {
      title: "Full gallery",
      link: "Browse all available icons",
    },
    api: "API",
  },
  props: {
    className:
      "Class applied to the SVG. Required by the MUI components that accept an icon: they clone it to inject their own class — MuiChip-icon, Badge, Tab. Without this prop the class is dropped, and with it the margins the host component meant for the icon.",
    name: "Name of the icon to display, from the CanopUI icon set.",
    variant: "Stroke style. Some icons share the same drawing for both variants.",
    size: "Size of the icon, from 1rem (xs) to 3rem (xl).",
    color:
      "Icon color from the theme. neutral maps to text.disabled, inherit uses the color of the parent text.",
    title:
      "Icon caption. When provided, the icon exposes an image role; otherwise it is hidden from screen readers.",
    ariaLabel: "Explicit accessible name. Takes precedence over title.",
  },
};

const texts = { fr, en };

export default function IconDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "name",
      type: "CanopIconName",
      required: true,
      description: t.props.name,
    },
    {
      name: "variant",
      type: '"outline" | "solid"',
      defaultValue: '"outline"',
      description: t.props.variant,
    },
    {
      name: "size",
      type: '"xs" | "sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description: t.props.size,
    },
    {
      name: "color",
      type: '"primary" | "secondary" | "accent" | "error" | "warning" | "info" | "success" | "neutral" | "inherit"',
      defaultValue: '"inherit"',
      description: t.props.color,
    },
    {
      name: "title",
      type: "string",
      description: t.props.title,
    },
    {
      name: "ariaLabel",
      type: "string",
      description: t.props.ariaLabel,
    },
    { name: "className", type: "string", description: t.props.className },
  ];

  return (
    <DocPage title="Icon" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.variants.title}>
        <DemoCard
          title={t.sections.variants.demoTitle}
          description={t.sections.variants.demoDescription}
          code={variantsCode}
        >
          <Icon name="sun" variant="outline" size="lg" />
          <Icon name="sun" variant="solid" size="lg" />
          <Icon name="moon" variant="outline" size="lg" />
          <Icon name="moon" variant="solid" size="lg" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.sizes.title}>
        <DemoCard
          title={t.sections.sizes.demoTitle}
          description={t.sections.sizes.demoDescription}
          code={sizesCode}
        >
          <Icon name="home" size="xs" />
          <Icon name="home" size="sm" />
          <Icon name="home" size="md" />
          <Icon name="home" size="lg" />
          <Icon name="home" size="xl" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.colors.title}>
        <DemoCard
          title={t.sections.colors.demoTitle}
          description={t.sections.colors.demoDescription}
          code={colorsCode}
        >
          <Icon name="shield" variant="solid" size="lg" color="primary" />
          <Icon name="shield" variant="solid" size="lg" color="secondary" />
          <Icon name="shield" variant="solid" size="lg" color="accent" />
          <Icon name="shield" variant="solid" size="lg" color="error" />
          <Icon name="shield" variant="solid" size="lg" color="warning" />
          <Icon name="shield" variant="solid" size="lg" color="info" />
          <Icon name="shield" variant="solid" size="lg" color="success" />
          <Icon name="shield" variant="solid" size="lg" color="neutral" />
          <Icon name="shield" variant="solid" size="lg" color="inherit" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.a11y.title}>
        <DemoCard
          title={t.sections.a11y.demoTitle}
          description={t.sections.a11y.demoDescription}
          code={titleCode}
        >
          <Icon name="settings" size="lg" title="Paramètres" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.forge.title}>
        <DemoCard
          title={t.sections.forge.demoTitle}
          description={t.sections.forge.demoDescription}
          code={forgeCode}
        >
          {forgeIcons.map((name) => (
            <Icon key={name} name={name} size="lg" />
          ))}
          {forgeIcons.map((name) => (
            <Icon key={`${name}-solid`} name={name} variant="solid" size="lg" />
          ))}
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.gallery.title}>
        <Stack gap="xs">
          <Link href="#/docs/icones">{t.sections.gallery.link}</Link>
        </Stack>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
