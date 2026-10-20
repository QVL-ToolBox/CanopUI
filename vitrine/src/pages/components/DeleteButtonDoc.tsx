import Typography from "@mui/material/Typography";
import { useState } from "react";
import { DeleteButton, Stack } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { DeleteButton } from "@canop/ui";`;

const basicCode = `function DeleteDemo() {
  const [deleted, setDeleted] = useState(false);

  return deleted ? (
    <Typography>Élément supprimé.</Typography>
  ) : (
    <Stack direction="row" alignItems="center" gap="sm">
      <Typography>Rapport trimestriel</Typography>
      <DeleteButton ariaLabel="Supprimer" onConfirm={() => setDeleted(true)} />
    </Stack>
  );
}`;

const customCode = `<DeleteButton
  ariaLabel="Supprimer"
  confirmTitle="Supprimer cet utilisateur ?"
  confirmMessage="Cette action est irréversible (jean@test.fr)."
  confirmLabel="Oui, supprimer"
  cancelLabel="Annuler"
  onConfirm={() => {}}
/>`;

const disabledCode = `<DeleteButton ariaLabel="Supprimer" disabled onConfirm={() => {}} />`;

const sizeCode = `<DeleteButton ariaLabel="Supprimer" size="2.5rem" onConfirm={() => {}} />
<DeleteButton ariaLabel="Supprimer" size="3.25rem" onConfirm={() => {}} />
<DeleteButton ariaLabel="Supprimer" size="4rem" onConfirm={() => {}} />`;

const iconSizeCode = `<DeleteButton ariaLabel="Supprimer" iconSize="sm" onConfirm={() => {}} />
<DeleteButton ariaLabel="Supprimer" iconSize="md" onConfirm={() => {}} />
<DeleteButton ariaLabel="Supprimer" size="4rem" iconSize="lg" onConfirm={() => {}} />`;

const fr = {
  intro:
    "Bouton de suppression sécurisé. Un clic ouvre une boîte de dialogue de confirmation destructive avant d'exécuter l'action, avec gestion automatique de l'état de chargement pour les suppressions asynchrones.",
  sections: {
    usage: "Utilisation",
    customization: "Personnalisation",
    sizes: "Tailles",
    disabled: "Désactivé",
    api: "API",
  },
  demos: {
    basicTitle: "Suppression avec confirmation",
    basicDescription:
      "Le clic ouvre une confirmation. L'action onConfirm n'est exécutée qu'après validation de l'utilisateur.",
    customTitle: "Textes de la confirmation",
    customDescription:
      "Personnalisez le titre, le message et les libellés des boutons de la boîte de dialogue.",
    sizeTitle: "Prop size",
    sizeDescription:
      "La taille est une chaîne CSS exprimée en rem et pilote la largeur et la hauteur du bouton.",
    iconSizeTitle: "Prop iconSize",
    iconSizeDescription:
      "La taille de l'icône est choisie explicitement, indépendamment de celle du bouton.",
  },
  props: {
    onConfirm:
      "Action de suppression exécutée après confirmation. Un retour de promesse déclenche l'état de chargement de la boîte de dialogue.",
    ariaLabel: "Libellé accessible du bouton de suppression.",
    confirmTitle: "Titre de la boîte de dialogue de confirmation. Valeur traduite par défaut.",
    confirmMessage: "Message affiché dans la boîte de dialogue de confirmation.",
    confirmLabel: "Libellé du bouton de confirmation. Valeur traduite par défaut.",
    cancelLabel: "Libellé du bouton d'annulation. Valeur traduite par défaut.",
    disabled: "Désactive le bouton.",
    size: "Largeur et hauteur du bouton, en unités CSS relatives (rem).",
    iconSize: "Taille de l'icône affichée dans le bouton.",
  },
};

const en: typeof fr = {
  intro:
    "Secure delete button. A click opens a destructive confirmation dialog before running the action, with automatic loading state handling for asynchronous deletions.",
  sections: {
    usage: "Usage",
    customization: "Customization",
    sizes: "Sizes",
    disabled: "Disabled",
    api: "API",
  },
  demos: {
    basicTitle: "Delete with confirmation",
    basicDescription:
      "The click opens a confirmation. The onConfirm action only runs once the user has confirmed.",
    customTitle: "Confirmation texts",
    customDescription: "Customize the title, message and button labels of the dialog.",
    sizeTitle: "size prop",
    sizeDescription:
      "The size is a CSS string expressed in rem and drives the width and height of the button.",
    iconSizeTitle: "iconSize prop",
    iconSizeDescription:
      "The icon size is picked explicitly among the catalog sizes, independently from the button size.",
  },
  props: {
    onConfirm:
      "Delete action executed after confirmation. Returning a promise triggers the loading state of the dialog.",
    ariaLabel: "Accessible label of the delete button.",
    confirmTitle: "Title of the confirmation dialog. Translated value by default.",
    confirmMessage: "Message displayed in the confirmation dialog.",
    confirmLabel: "Label of the confirmation button. Translated value by default.",
    cancelLabel: "Label of the cancel button. Translated value by default.",
    disabled: "Disables the button.",
    size: "Button width and height, in relative CSS units (rem).",
    iconSize: "Size of the icon displayed inside the button.",
  },
};

const texts = { fr, en };

function DeleteDemo() {
  const [deleted, setDeleted] = useState(false);

  return deleted ? (
    <Typography>Élément supprimé.</Typography>
  ) : (
    <Stack direction="row" alignItems="center" gap="sm">
      <Typography>Rapport trimestriel</Typography>
      <DeleteButton ariaLabel="Supprimer" onConfirm={() => setDeleted(true)} />
    </Stack>
  );
}

export default function DeleteButtonDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "onConfirm",
      type: "() => void | Promise<void>",
      required: true,
      description: t.props.onConfirm,
    },
    {
      name: "ariaLabel",
      type: "string",
      required: true,
      description: t.props.ariaLabel,
    },
    {
      name: "confirmTitle",
      type: "string",
      description: t.props.confirmTitle,
    },
    {
      name: "confirmMessage",
      type: "ReactNode",
      description: t.props.confirmMessage,
    },
    {
      name: "confirmLabel",
      type: "string",
      description: t.props.confirmLabel,
    },
    {
      name: "cancelLabel",
      type: "string",
      description: t.props.cancelLabel,
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: t.props.disabled,
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
  ];

  return (
    <DocPage title="DeleteButton" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.basicTitle}
          description={t.demos.basicDescription}
          code={basicCode}
        >
          <DeleteDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.customization}>
        <DemoCard
          title={t.demos.customTitle}
          description={t.demos.customDescription}
          code={customCode}
        >
          <DeleteButton
            ariaLabel="Supprimer"
            confirmTitle="Supprimer cet utilisateur ?"
            confirmMessage="Cette action est irréversible (jean@test.fr)."
            confirmLabel="Oui, supprimer"
            cancelLabel="Annuler"
            onConfirm={() => {}}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.sizes}>
        <DemoCard title={t.demos.sizeTitle} description={t.demos.sizeDescription} code={sizeCode}>
          <DeleteButton ariaLabel="Supprimer" size="2.5rem" onConfirm={() => {}} />
          <DeleteButton ariaLabel="Supprimer" size="3.25rem" onConfirm={() => {}} />
          <DeleteButton ariaLabel="Supprimer" size="4rem" onConfirm={() => {}} />
        </DemoCard>
        <DemoCard
          title={t.demos.iconSizeTitle}
          description={t.demos.iconSizeDescription}
          code={iconSizeCode}
        >
          <DeleteButton ariaLabel="Supprimer" iconSize="sm" onConfirm={() => {}} />
          <DeleteButton ariaLabel="Supprimer" iconSize="md" onConfirm={() => {}} />
          <DeleteButton ariaLabel="Supprimer" size="4rem" iconSize="lg" onConfirm={() => {}} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.disabled}>
        <DemoCard title="disabled" code={disabledCode}>
          <DeleteButton ariaLabel="Supprimer" disabled onConfirm={() => {}} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
