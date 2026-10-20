import { EditButton } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { EditButton } from "@canop/ui";`;

const basicCode = `<EditButton ariaLabel="Éditer" onClick={() => {}} />`;

const sizeCode = `<EditButton ariaLabel="Éditer" size="2.5rem" onClick={() => {}} />
<EditButton ariaLabel="Éditer" size="3.25rem" onClick={() => {}} />
<EditButton ariaLabel="Éditer" size="4rem" onClick={() => {}} />`;

const iconSizeCode = `<EditButton ariaLabel="Éditer" iconSize="sm" onClick={() => {}} />
<EditButton ariaLabel="Éditer" iconSize="md" onClick={() => {}} />
<EditButton ariaLabel="Éditer" size="4rem" iconSize="lg" onClick={() => {}} />`;

const disabledCode = `<EditButton ariaLabel="Éditer" disabled />`;

const fr = {
  intro:
    "Bouton d'édition portant l'icône crayon. Basé sur IconActionButton, il déclenche la modification d'un élément dans une liste ou une fiche.",
  sections: {
    usage: "Utilisation",
    sizes: "Tailles",
    disabled: "Désactivé",
    api: "API",
  },
  demos: {
    basicTitle: "Bouton d'édition",
    basicDescription: "EditButton affiche l'icône pencil sur la couleur d'action principale.",
    sizeTitle: "Prop size",
    sizeDescription:
      "La taille est une chaîne CSS exprimée en rem et pilote la largeur et la hauteur du bouton.",
    iconSizeTitle: "Prop iconSize",
    iconSizeDescription:
      "La taille de l'icône est choisie explicitement, indépendamment de celle du bouton.",
  },
  props: {
    ariaLabel: "Libellé accessible décrivant l'action d'édition.",
    onClick: "Handler appelé au clic.",
    size: "Largeur et hauteur du bouton, en unités CSS relatives (rem).",
    iconSize: "Taille de l'icône affichée dans le bouton.",
    disabled: "Désactive le bouton.",
  },
};

const en: typeof fr = {
  intro:
    "Edit button carrying the pencil icon. Based on IconActionButton, it triggers the modification of an item in a list or a record.",
  sections: {
    usage: "Usage",
    sizes: "Sizes",
    disabled: "Disabled",
    api: "API",
  },
  demos: {
    basicTitle: "Edit button",
    basicDescription: "EditButton displays the pencil icon on the primary action color.",
    sizeTitle: "size prop",
    sizeDescription:
      "The size is a CSS string expressed in rem and drives the width and height of the button.",
    iconSizeTitle: "iconSize prop",
    iconSizeDescription:
      "The icon size is picked explicitly among the catalog sizes, independently from the button size.",
  },
  props: {
    ariaLabel: "Accessible label describing the edit action.",
    onClick: "Handler called on click.",
    size: "Button width and height, in relative CSS units (rem).",
    iconSize: "Size of the icon displayed inside the button.",
    disabled: "Disables the button.",
  },
};

const texts = { fr, en };

export default function EditButtonDoc() {
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
    <DocPage title="EditButton" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.basicTitle}
          description={t.demos.basicDescription}
          code={basicCode}
        >
          <EditButton ariaLabel="Éditer" onClick={() => {}} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.sizes}>
        <DemoCard title={t.demos.sizeTitle} description={t.demos.sizeDescription} code={sizeCode}>
          <EditButton ariaLabel="Éditer" size="2.5rem" onClick={() => {}} />
          <EditButton ariaLabel="Éditer" size="3.25rem" onClick={() => {}} />
          <EditButton ariaLabel="Éditer" size="4rem" onClick={() => {}} />
        </DemoCard>
        <DemoCard
          title={t.demos.iconSizeTitle}
          description={t.demos.iconSizeDescription}
          code={iconSizeCode}
        >
          <EditButton ariaLabel="Éditer" iconSize="sm" onClick={() => {}} />
          <EditButton ariaLabel="Éditer" iconSize="md" onClick={() => {}} />
          <EditButton ariaLabel="Éditer" size="4rem" iconSize="lg" onClick={() => {}} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.disabled}>
        <DemoCard title="disabled" code={disabledCode}>
          <EditButton ariaLabel="Éditer" disabled />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
