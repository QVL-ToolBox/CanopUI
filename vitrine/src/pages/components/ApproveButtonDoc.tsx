import { ApproveButton } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { ApproveButton } from "@canop/ui";`;

const basicCode = `<ApproveButton ariaLabel="Approuver" onClick={() => {}} />`;

const sizeCode = `<ApproveButton ariaLabel="Approuver" size="2.5rem" onClick={() => {}} />
<ApproveButton ariaLabel="Approuver" size="3.25rem" onClick={() => {}} />
<ApproveButton ariaLabel="Approuver" size="4rem" onClick={() => {}} />`;

const iconSizeCode = `<ApproveButton ariaLabel="Approuver" iconSize="sm" onClick={() => {}} />
<ApproveButton ariaLabel="Approuver" iconSize="md" onClick={() => {}} />
<ApproveButton ariaLabel="Approuver" size="4rem" iconSize="lg" onClick={() => {}} />`;

const disabledCode = `<ApproveButton ariaLabel="Approuver" disabled />`;

const fr = {
  intro:
    "Bouton d'approbation compact portant l'icône de validation. Construit sur IconActionButton, il matérialise l'acceptation d'un élément dans une liste ou un tableau.",
  sections: {
    usage: "Utilisation",
    sizes: "Tailles",
    disabled: "Désactivé",
    api: "API",
  },
  demos: {
    basicTitle: "Bouton d'approbation",
    basicDescription: "ApproveButton affiche l'icône check sur la couleur d'action principale.",
    sizeTitle: "Prop size",
    sizeDescription:
      "La taille est une chaîne CSS exprimée en rem et pilote la largeur et la hauteur du bouton.",
    iconSizeTitle: "Prop iconSize",
    iconSizeDescription:
      "La taille de l'icône est choisie explicitement, indépendamment de celle du bouton.",
  },
  props: {
    ariaLabel: "Libellé accessible décrivant l'action d'approbation.",
    onClick: "Handler appelé au clic.",
    size: "Largeur et hauteur du bouton, en unités CSS relatives (rem).",
    iconSize: "Taille de l'icône affichée dans le bouton.",
    disabled: "Désactive le bouton.",
  },
};

const en: typeof fr = {
  intro:
    "Compact approve button carrying the confirmation icon. Built on IconActionButton, it embodies the acceptance of an item in a list or a table.",
  sections: {
    usage: "Usage",
    sizes: "Sizes",
    disabled: "Disabled",
    api: "API",
  },
  demos: {
    basicTitle: "Approve button",
    basicDescription: "ApproveButton displays the check icon on the primary action color.",
    sizeTitle: "size prop",
    sizeDescription:
      "The size is a CSS string expressed in rem and drives the width and height of the button.",
    iconSizeTitle: "iconSize prop",
    iconSizeDescription:
      "The icon size is picked explicitly among the catalog sizes, independently from the button size.",
  },
  props: {
    ariaLabel: "Accessible label describing the approve action.",
    onClick: "Handler called on click.",
    size: "Button width and height, in relative CSS units (rem).",
    iconSize: "Size of the icon displayed inside the button.",
    disabled: "Disables the button.",
  },
};

const texts = { fr, en };

export default function ApproveButtonDoc() {
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
    <DocPage title="ApproveButton" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.basicTitle}
          description={t.demos.basicDescription}
          code={basicCode}
        >
          <ApproveButton ariaLabel="Approuver" onClick={() => {}} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.sizes}>
        <DemoCard title={t.demos.sizeTitle} description={t.demos.sizeDescription} code={sizeCode}>
          <ApproveButton ariaLabel="Approuver" size="2.5rem" onClick={() => {}} />
          <ApproveButton ariaLabel="Approuver" size="3.25rem" onClick={() => {}} />
          <ApproveButton ariaLabel="Approuver" size="4rem" onClick={() => {}} />
        </DemoCard>
        <DemoCard
          title={t.demos.iconSizeTitle}
          description={t.demos.iconSizeDescription}
          code={iconSizeCode}
        >
          <ApproveButton ariaLabel="Approuver" iconSize="sm" onClick={() => {}} />
          <ApproveButton ariaLabel="Approuver" iconSize="md" onClick={() => {}} />
          <ApproveButton ariaLabel="Approuver" size="4rem" iconSize="lg" onClick={() => {}} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.disabled}>
        <DemoCard title="disabled" code={disabledCode}>
          <ApproveButton ariaLabel="Approuver" disabled />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
