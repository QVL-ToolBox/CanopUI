import { IconActionButton } from "@canop/ui";
import { useRef } from "react";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { IconActionButton } from "@canop/ui";`;

const variantsCode = `<IconActionButton icon="pencil" variant="default" ariaLabel="Éditer" />
<IconActionButton icon="settings" variant="secondary" ariaLabel="Réglages" />
<IconActionButton icon="trash" variant="danger" ariaLabel="Supprimer" />
<IconActionButton icon="download" variant="accent" ariaLabel="Télécharger" />`;

const accentStatesCode = `<IconActionButton icon="download" variant="accent" tooltip ariaLabel="Télécharger" />
<IconActionButton icon="download" variant="accent" loading ariaLabel="Télécharger" />
<IconActionButton icon="download" variant="accent" disabled ariaLabel="Télécharger" />`;

const iconsCode = `<IconActionButton icon="plus" ariaLabel="Ajouter" />
<IconActionButton icon="check" ariaLabel="Valider" />
<IconActionButton icon="download" ariaLabel="Télécharger" />
<IconActionButton icon="refresh" ariaLabel="Rafraîchir" />`;

const sizeCode = `<IconActionButton icon="pencil" size="2rem" ariaLabel="Éditer" />
<IconActionButton icon="pencil" size="2.5rem" ariaLabel="Éditer" />
<IconActionButton icon="pencil" size="3.25rem" ariaLabel="Éditer" />`;

const iconSizeCode = `<IconActionButton icon="pencil" iconSize="sm" ariaLabel="Éditer" />
<IconActionButton icon="pencil" iconSize="md" ariaLabel="Éditer" />
<IconActionButton icon="pencil" size="3.25rem" iconSize="lg" ariaLabel="Éditer" />`;

const disabledCode = `<IconActionButton icon="trash" variant="danger" disabled ariaLabel="Supprimer" />
<IconActionButton icon="pencil" disabled ariaLabel="Éditer" />`;

const loadingCode = `<IconActionButton icon="download" loading ariaLabel="Télécharger" />
<IconActionButton icon="trash" variant="danger" loading ariaLabel="Supprimer" />
<IconActionButton icon="settings" variant="secondary" loading ariaLabel="Réglages" />`;

const tooltipCode = `<IconActionButton icon="pencil" tooltip ariaLabel="Éditer" />
<IconActionButton icon="trash" variant="danger" tooltip="Supprimer définitivement" ariaLabel="Supprimer" />`;

const refCode = `const buttonRef = useRef<HTMLButtonElement>(null);

<IconActionButton ref={buttonRef} icon="refresh" ariaLabel="Rafraîchir" data-testid="refresh" />`;

const fr = {
  intro:
    "Bouton d'action carré à icône. Brique de base des boutons d'action métier (ajout, édition, suppression, approbation), il propose quatre intentions colorées, un dimensionnement libre en rem et une taille d'icône explicite.",
  sections: {
    variants: "Variantes",
    accent: "Accent",
    icons: "Icônes",
    sizes: "Tailles",
    disabled: "Désactivé",
    loading: "Chargement",
    tooltip: "Infobulle",
    ref: "Ref et attributs data-*",
    api: "API",
  },
  demos: {
    loadingTitle: "Prop loading",
    loadingDescription:
      "Le Spinner remplace l'icône sans changer la taille du bouton et prend la couleur de l'icône, donc le même contraste dans chaque variante et chaque thème. Le clic est ignoré, aria-busy est posé et le focus reste sur le bouton.",
    tooltipTitle: "Prop tooltip",
    tooltipDescription:
      "true reprend ariaLabel, un texte le remplace et décrit le bouton via aria-describedby. L'infobulle s'ouvre au survol et au focus clavier.",
    refTitle: "ref et data-*",
    refDescription:
      "ref atteint l'élément button natif et les attributs data-* y sont posés tels quels.",
    variantsTitle: "Quatre intentions",
    variantsDescription:
      "default pour l'action principale, secondary pour les actions de second plan, danger pour les actions destructives, accent pour détacher une action secondaire mais désirable.",
    accentTitle: "La variante accent et ses états",
    accentDescription:
      "Fond accent.main, glyphe accent.contrastText (8,85:1), survol accent.dark (5,91:1), identiques en clair et en sombre. Au focus clavier, le bouton prend son survol accent.dark, sans anneau, le Spinner de loading prend la couleur du glyphe et l'état désactivé est celui des autres variantes.",
    iconsTitle: "Prop icon",
    iconsDescription:
      "Utilisez n'importe quelle icône du catalogue CanopUI selon l'action représentée.",
    sizeTitle: "Prop size",
    sizeDescription:
      "La taille est une chaîne CSS exprimée en rem et pilote la largeur et la hauteur du bouton.",
    iconSizeTitle: "Prop iconSize",
    iconSizeDescription:
      "La taille de l'icône est choisie explicitement parmi les tailles du catalogue, indépendamment de celle du bouton.",
  },
  props: {
    icon: "Nom de l'icône CanopUI affichée, en variante pleine.",
    ariaLabel: "Libellé accessible décrivant l'action.",
    variant:
      "Intention visuelle : action principale, destructive, secondaire ou d'accent, pilotant les couleurs de fond, de survol et d'icône. En thème sombre, default et secondary portent une icône foncée pour tenir le contraste ; accent garde le même rendu dans les deux thèmes.",
    size: "Largeur et hauteur du bouton, en unités CSS relatives (rem).",
    iconSize: "Taille de l'icône affichée dans le bouton.",
    onClick: "Handler appelé au clic.",
    disabled: "Désactive le bouton.",
    loading:
      "Affiche un Spinner de la couleur de l'icône à sa place, pose aria-busy et ignore le clic tout en conservant le focus.",
    tooltip:
      "Infobulle au survol et au focus clavier : true reprend ariaLabel, un texte le remplace. Absente si la prop n'est pas fournie ou si le bouton est désactivé.",
    ref: "Référence vers l'élément button natif.",
    data: "Attributs data-* posés sur l'élément button.",
  },
};

const en: typeof fr = {
  intro:
    "Square icon action button. Base building block of the business action buttons (add, edit, delete, approve), it offers four colored intents, free sizing in rem and an explicit icon size.",
  sections: {
    variants: "Variants",
    accent: "Accent",
    icons: "Icons",
    sizes: "Sizes",
    disabled: "Disabled",
    loading: "Loading",
    tooltip: "Tooltip",
    ref: "Ref and data-* attributes",
    api: "API",
  },
  demos: {
    loadingTitle: "loading prop",
    loadingDescription:
      "The Spinner replaces the icon without changing the button size and takes the icon color, hence the same contrast in every variant and theme. Clicks are ignored, aria-busy is set and focus stays on the button.",
    tooltipTitle: "tooltip prop",
    tooltipDescription:
      "true reuses ariaLabel, a text replaces it and describes the button through aria-describedby. The tooltip opens on hover and on keyboard focus.",
    refTitle: "ref and data-*",
    refDescription:
      "ref reaches the native button element and data-* attributes are set on it as is.",
    variantsTitle: "Four intents",
    variantsDescription:
      "default for the primary action, secondary for background actions, danger for destructive actions, accent to make a secondary yet desirable action stand out.",
    accentTitle: "The accent variant and its states",
    accentDescription:
      "accent.main background, accent.contrastText glyph (8.85:1), accent.dark on hover (5.91:1), identical in light and dark themes. On keyboard focus the button takes its accent.dark hover, with no ring, the loading Spinner takes the glyph colour and the disabled state is the one of the other variants.",
    iconsTitle: "icon prop",
    iconsDescription: "Use any icon from the CanopUI catalog depending on the action represented.",
    sizeTitle: "size prop",
    sizeDescription:
      "The size is a CSS string expressed in rem and drives the width and height of the button.",
    iconSizeTitle: "iconSize prop",
    iconSizeDescription:
      "The icon size is picked explicitly among the catalog sizes, independently from the button size.",
  },
  props: {
    icon: "Name of the displayed CanopUI icon, in its filled variant.",
    ariaLabel: "Accessible label describing the action.",
    variant:
      "Visual intent: primary, destructive, secondary or accent action, driving the background, hover and icon colors. In dark theme, default and secondary carry a dark icon to keep the contrast; accent looks the same in both themes.",
    size: "Button width and height, in relative CSS units (rem).",
    iconSize: "Size of the icon displayed inside the button.",
    onClick: "Handler called on click.",
    disabled: "Disables the button.",
    loading:
      "Shows a Spinner in the icon color in its place, sets aria-busy and ignores clicks while keeping focus.",
    tooltip:
      "Tooltip on hover and keyboard focus: true reuses ariaLabel, a text replaces it. Absent when the prop is not provided or the button is disabled.",
    ref: "Reference to the native button element.",
    data: "data-* attributes set on the button element.",
  },
};

const texts = { fr, en };

export default function IconActionButtonDoc() {
  const t = texts[useDocLocale()];
  const buttonRef = useRef<HTMLButtonElement>(null);

  const propRows: PropRow[] = [
    {
      name: "icon",
      type: "CanopIconName",
      required: true,
      description: t.props.icon,
    },
    {
      name: "ariaLabel",
      type: "string",
      required: true,
      description: t.props.ariaLabel,
    },
    {
      name: "variant",
      type: '"default" | "danger" | "secondary" | "accent"',
      defaultValue: '"default"',
      description: t.props.variant,
    },
    {
      name: "size",
      type: "string",
      defaultValue: '"2.5rem"',
      description: t.props.size,
    },
    {
      name: "iconSize",
      type: '"xs" | "sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description: t.props.iconSize,
    },
    {
      name: "onClick",
      type: "MouseEventHandler<HTMLButtonElement>",
      description: t.props.onClick,
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: t.props.disabled,
    },
    {
      name: "loading",
      type: "boolean",
      defaultValue: "false",
      description: t.props.loading,
    },
    {
      name: "tooltip",
      type: "boolean | string",
      description: t.props.tooltip,
    },
    {
      name: "ref",
      type: "Ref<HTMLButtonElement>",
      description: t.props.ref,
    },
    {
      name: "data-*",
      type: "string | number | boolean",
      description: t.props.data,
    },
  ];

  return (
    <DocPage title="IconActionButton" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.variants}>
        <DemoCard
          title={t.demos.variantsTitle}
          description={t.demos.variantsDescription}
          code={variantsCode}
        >
          <IconActionButton icon="pencil" variant="default" ariaLabel="Éditer" />
          <IconActionButton icon="settings" variant="secondary" ariaLabel="Réglages" />
          <IconActionButton icon="trash" variant="danger" ariaLabel="Supprimer" />
          <IconActionButton icon="download" variant="accent" ariaLabel="Télécharger" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.accent}>
        <DemoCard
          title={t.demos.accentTitle}
          description={t.demos.accentDescription}
          code={accentStatesCode}
        >
          <IconActionButton icon="download" variant="accent" tooltip ariaLabel="Télécharger" />
          <IconActionButton icon="download" variant="accent" loading ariaLabel="Télécharger" />
          <IconActionButton icon="download" variant="accent" disabled ariaLabel="Télécharger" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.icons}>
        <DemoCard
          title={t.demos.iconsTitle}
          description={t.demos.iconsDescription}
          code={iconsCode}
        >
          <IconActionButton icon="plus" ariaLabel="Ajouter" />
          <IconActionButton icon="check" ariaLabel="Valider" />
          <IconActionButton icon="download" ariaLabel="Télécharger" />
          <IconActionButton icon="refresh" ariaLabel="Rafraîchir" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.sizes}>
        <DemoCard title={t.demos.sizeTitle} description={t.demos.sizeDescription} code={sizeCode}>
          <IconActionButton icon="pencil" size="2rem" ariaLabel="Éditer" />
          <IconActionButton icon="pencil" size="2.5rem" ariaLabel="Éditer" />
          <IconActionButton icon="pencil" size="3.25rem" ariaLabel="Éditer" />
        </DemoCard>
        <DemoCard
          title={t.demos.iconSizeTitle}
          description={t.demos.iconSizeDescription}
          code={iconSizeCode}
        >
          <IconActionButton icon="pencil" iconSize="sm" ariaLabel="Éditer" />
          <IconActionButton icon="pencil" iconSize="md" ariaLabel="Éditer" />
          <IconActionButton icon="pencil" size="3.25rem" iconSize="lg" ariaLabel="Éditer" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.disabled}>
        <DemoCard title="disabled" code={disabledCode}>
          <IconActionButton icon="trash" variant="danger" disabled ariaLabel="Supprimer" />
          <IconActionButton icon="pencil" disabled ariaLabel="Éditer" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.loading}>
        <DemoCard
          title={t.demos.loadingTitle}
          description={t.demos.loadingDescription}
          code={loadingCode}
        >
          <IconActionButton icon="download" loading ariaLabel="Télécharger" />
          <IconActionButton icon="trash" variant="danger" loading ariaLabel="Supprimer" />
          <IconActionButton icon="settings" variant="secondary" loading ariaLabel="Réglages" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.tooltip}>
        <DemoCard
          title={t.demos.tooltipTitle}
          description={t.demos.tooltipDescription}
          code={tooltipCode}
        >
          <IconActionButton icon="pencil" tooltip ariaLabel="Éditer" />
          <IconActionButton
            icon="trash"
            variant="danger"
            tooltip="Supprimer définitivement"
            ariaLabel="Supprimer"
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.ref}>
        <DemoCard title={t.demos.refTitle} description={t.demos.refDescription} code={refCode}>
          <IconActionButton
            ref={buttonRef}
            icon="refresh"
            ariaLabel="Rafraîchir"
            data-testid="refresh"
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
