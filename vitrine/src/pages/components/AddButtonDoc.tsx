import { AddButton } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { AddButton } from "@canop/ui";`;

const basicCode = `<AddButton ariaLabel="Ajouter" onClick={() => {}} />`;

const sizeCode = `<AddButton ariaLabel="Ajouter" size="2.5rem" onClick={() => {}} />
<AddButton ariaLabel="Ajouter" size="3.25rem" onClick={() => {}} />
<AddButton ariaLabel="Ajouter" size="4rem" onClick={() => {}} />`;

const iconSizeCode = `<AddButton ariaLabel="Ajouter" iconSize="sm" onClick={() => {}} />
<AddButton ariaLabel="Ajouter" iconSize="md" onClick={() => {}} />
<AddButton ariaLabel="Ajouter" size="4rem" iconSize="lg" onClick={() => {}} />`;

const disabledCode = `<AddButton ariaLabel="Ajouter" disabled />`;

const fr = {
  intro:
    "Bouton d'ajout centré sur toute la largeur disponible. Il porte l'icône plus et s'appuie sur IconActionButton pour proposer l'action d'ajout principale d'une liste ou d'une section.",
  sections: {
    usage: "Utilisation",
    sizes: "Tailles",
    disabled: "Désactivé",
    api: "API",
  },
  demos: {
    basicTitle: "Bouton d'ajout",
    basicDescription:
      "AddButton s'étire sur toute la largeur du conteneur et centre son icône, idéal en pied de liste.",
    sizeTitle: "Prop size",
    sizeDescription:
      "La taille est une chaîne CSS exprimée en rem et pilote la largeur et la hauteur du bouton.",
    iconSizeTitle: "Prop iconSize",
    iconSizeDescription:
      "La taille de l'icône est choisie explicitement, indépendamment de celle du bouton.",
  },
  props: {
    ariaLabel: "Libellé accessible décrivant l'action d'ajout.",
    onClick: "Handler appelé au clic.",
    size: "Largeur et hauteur du bouton, en unités CSS relatives (rem).",
    iconSize: "Taille de l'icône affichée dans le bouton.",
    disabled: "Désactive le bouton.",
  },
};

const en: typeof fr = {
  intro:
    "Full-width add button centered within the available space. It carries the plus icon and builds on IconActionButton to provide the primary add action of a list or a section.",
  sections: {
    usage: "Usage",
    sizes: "Sizes",
    disabled: "Disabled",
    api: "API",
  },
  demos: {
    basicTitle: "Add button",
    basicDescription:
      "AddButton stretches to the full width of its container and centers its icon, ideal at the bottom of a list.",
    sizeTitle: "size prop",
    sizeDescription:
      "The size is a CSS string expressed in rem and drives the width and height of the button.",
    iconSizeTitle: "iconSize prop",
    iconSizeDescription:
      "The icon size is picked explicitly among the catalog sizes, independently from the button size.",
  },
  props: {
    ariaLabel: "Accessible label describing the add action.",
    onClick: "Handler called on click.",
    size: "Button width and height, in relative CSS units (rem).",
    iconSize: "Size of the icon displayed inside the button.",
    disabled: "Disables the button.",
  },
};

const texts = { fr, en };

export default function AddButtonDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "ariaLabel",
      type: "string",
      required: true,
      description: t.props.ariaLabel,
    },
    {
      name: "onClick",
      type: "MouseEventHandler<HTMLButtonElement>",
      description: t.props.onClick,
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
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: t.props.disabled,
    },
  ];

  return (
    <DocPage title="AddButton" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.basicTitle}
          description={t.demos.basicDescription}
          code={basicCode}
          align="stretch"
        >
          <AddButton ariaLabel="Ajouter" onClick={() => {}} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.sizes}>
        <DemoCard title={t.demos.sizeTitle} description={t.demos.sizeDescription} code={sizeCode}>
          <AddButton ariaLabel="Ajouter" size="2.5rem" onClick={() => {}} />
          <AddButton ariaLabel="Ajouter" size="3.25rem" onClick={() => {}} />
          <AddButton ariaLabel="Ajouter" size="4rem" onClick={() => {}} />
        </DemoCard>
        <DemoCard
          title={t.demos.iconSizeTitle}
          description={t.demos.iconSizeDescription}
          code={iconSizeCode}
        >
          <AddButton ariaLabel="Ajouter" iconSize="sm" onClick={() => {}} />
          <AddButton ariaLabel="Ajouter" iconSize="md" onClick={() => {}} />
          <AddButton ariaLabel="Ajouter" size="4rem" iconSize="lg" onClick={() => {}} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.disabled}>
        <DemoCard title="disabled" code={disabledCode} align="stretch">
          <AddButton ariaLabel="Ajouter" disabled />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
