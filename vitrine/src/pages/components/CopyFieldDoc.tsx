import { CopyField } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { CopyField } from "@canop/ui";`;

const demoCode = `<CopyField label="Code d'invitation" value="BEURRE-7K2Q" />`;

const fr = {
  intro:
    "Un code à transmettre, affiché en chasse fixe et en gros, avec son bouton copier. La copie se confirme sur place : l'icône passe à la coche d'un petit rebond et la confirmation est annoncée aux lecteurs d'écran. Si le presse-papier refuse, le champ le dit, et un toucher sur le code le sélectionne en entier pour le copier à la main.",
  sections: { invitation: "Code d'invitation", api: "API" },
  demos: {
    invitation: {
      title: "Copier en un geste",
      description:
        "Touchez le bouton : l'icône confirme la copie pendant un instant puis revient. Le libellé visible nomme aussi le groupe pour les technologies d'assistance.",
    },
  },
  props: {
    value: "Le texte affiché et copié.",
    label: "Libellé visible au-dessus du code, et nom accessible du groupe.",
    copyLabel: "Nom accessible du bouton. Par défaut « Copier ».",
    copiedLabel: "Annonce après une copie réussie.",
    failedLabel: "Message affiché et annoncé quand la copie échoue.",
  },
};

const en: typeof fr = {
  intro:
    "A code to pass on, shown large in a fixed-width face, with its copy button. The copy confirms itself in place: the icon turns into a check with a small bounce and the confirmation is announced to screen readers. If the clipboard refuses, the field says so, and a tap on the code selects all of it for a manual copy.",
  sections: { invitation: "Invitation code", api: "API" },
  demos: {
    invitation: {
      title: "Copy in one gesture",
      description:
        "Tap the button: the icon confirms the copy for a moment, then returns. The visible label also names the group for assistive technologies.",
    },
  },
  props: {
    value: "The text shown and copied.",
    label: "Visible label above the code, and accessible name of the group.",
    copyLabel: "Accessible name of the button. Defaults to “Copy”.",
    copiedLabel: "Announcement after a successful copy.",
    failedLabel: "Message shown and announced when the copy fails.",
  },
};

const texts = { fr, en };

export default function CopyFieldDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    { name: "value", type: "string", required: true, description: t.props.value },
    { name: "label", type: "string", description: t.props.label },
    { name: "copyLabel", type: "string", description: t.props.copyLabel },
    { name: "copiedLabel", type: "string", description: t.props.copiedLabel },
    { name: "failedLabel", type: "string", description: t.props.failedLabel },
  ];

  return (
    <DocPage title="CopyField" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.invitation}>
        <DemoCard
          title={t.demos.invitation.title}
          description={t.demos.invitation.description}
          code={demoCode}
        >
          <CopyField label="Code d'invitation" value="BEURRE-7K2Q" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
