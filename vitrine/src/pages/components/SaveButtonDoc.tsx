import { SaveButton } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { SaveButton } from "@canop/ui";`;

const basicCode = `<SaveButton onSave={() => enregistrerLeFormulaire()} />`;

const asyncCode = `<SaveButton
  onSave={async () => {
    await api.put("/devis/42", devis);
  }}
/>`;

const savingCode = `<SaveButton
  onSave={() => new Promise((resolve) => setTimeout(resolve, 4000))}
/>`;

const messageCode = `<SaveButton
  onSave={enregistrer}
  successMessage="Devis sauvegardé"
  errorMessage="Le devis n'a pas pu être sauvegardé"
/>`;

const attendre = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const fr = {
  intro:
    "Bouton d'enregistrement unique pour toute la flotte. Construit sur IconActionButton, il porte lui-même le retour utilisateur : un toast de confirmation quand l'enregistrement aboutit, un toast d'erreur quand il échoue. Le portail n'a plus qu'à fournir l'action.",
  sections: {
    usage: "Utilisation",
    async: "Enregistrement asynchrone",
    messages: "Messages",
    api: "API",
  },
  demos: {
    basicTitle: "Enregistrer",
    basicDescription:
      "Un clic déclenche onSave. Le toast de confirmation part dès que l'action est terminée.",
    asyncTitle: "Promesse",
    asyncDescription:
      "Si onSave renvoie une promesse, un Spinner remplace l'icône jusqu'à sa résolution et un nouveau clic est ignoré : impossible d'envoyer deux fois. Un rejet déclenche le toast d'erreur.",
    savingTitle: "Sauvegarde en cours",
    savingDescription:
      "Une sauvegarde lente laisse le temps d'observer l'état : le bouton garde sa pastille et le focus, porte aria-busy, et ignore le clic comme Entrée et Espace. Il n'est pas désactivé, donc un lecteur d'écran le retrouve là où l'utilisateur l'a laissé.",
    errorTitle: "Échec",
    errorDescription: "Une promesse rejetée ne doit jamais passer pour un succès.",
    messagesTitle: "Messages du portail",
    messagesDescription:
      "Les libellés par défaut sont traduits par la librairie. Un portail peut les remplacer quand le métier le demande.",
  },
  props: {
    onSave: "Action d'enregistrement. Peut renvoyer une promesse : le bouton en suit l'issue.",
    successMessage: "Message du toast de confirmation. Par défaut, le libellé traduit de la lib.",
    errorMessage: "Message du toast d'erreur. Par défaut, le libellé traduit de la lib.",
    disabled: "Désactive le bouton.",
    size: "Largeur et hauteur du bouton, en unités CSS relatives (rem).",
    iconSize: "Taille de l'icône affichée dans le bouton.",
    ariaLabel: "Libellé accessible. Par défaut, « Enregistrer » traduit.",
  },
};

const en: typeof fr = {
  intro:
    "A single save button for the whole fleet. Built on IconActionButton, it carries its own feedback: a confirmation toast when the save succeeds, an error toast when it fails. The portal only supplies the action.",
  sections: {
    usage: "Usage",
    async: "Asynchronous save",
    messages: "Messages",
    api: "API",
  },
  demos: {
    basicTitle: "Save",
    basicDescription:
      "A click triggers onSave. The confirmation toast fires as soon as the action completes.",
    asyncTitle: "Promise",
    asyncDescription:
      "If onSave returns a promise, a Spinner replaces the icon until it settles and further clicks are ignored: no double submit. A rejection triggers the error toast.",
    savingTitle: "Saving",
    savingDescription:
      "A slow save leaves time to observe the state: the button keeps its badge and focus, carries aria-busy, and ignores clicks as well as Enter and Space. It is not disabled, so a screen reader finds it where the user left it.",
    errorTitle: "Failure",
    errorDescription: "A rejected promise must never read as a success.",
    messagesTitle: "Portal messages",
    messagesDescription:
      "Default labels are translated by the library. A portal can replace them when the domain calls for it.",
  },
  props: {
    onSave: "Save action. May return a promise: the button follows its outcome.",
    successMessage: "Confirmation toast message. Defaults to the library's translated label.",
    errorMessage: "Error toast message. Defaults to the library's translated label.",
    disabled: "Disables the button.",
    size: "Button width and height, in relative CSS units (rem).",
    iconSize: "Size of the icon displayed inside the button.",
    ariaLabel: "Accessible label. Defaults to the translated “Save”.",
  },
};

const texts = { fr, en };

export default function SaveButtonDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "onSave",
      type: "() => void | Promise<void>",
      required: true,
      description: t.props.onSave,
    },
    { name: "successMessage", type: "string", description: t.props.successMessage },
    { name: "errorMessage", type: "string", description: t.props.errorMessage },
    { name: "disabled", type: "boolean", defaultValue: "false", description: t.props.disabled },
    { name: "size", type: "string", defaultValue: '"2.5rem"', description: t.props.size },
    {
      name: "iconSize",
      type: '"xs" | "sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description: t.props.iconSize,
    },
    { name: "ariaLabel", type: "string", description: t.props.ariaLabel },
  ];

  return (
    <DocPage title="SaveButton" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.basicTitle}
          description={t.demos.basicDescription}
          code={basicCode}
        >
          <SaveButton onSave={() => {}} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.async}>
        <DemoCard
          title={t.demos.asyncTitle}
          description={t.demos.asyncDescription}
          code={asyncCode}
        >
          <SaveButton onSave={() => attendre(1200)} />
        </DemoCard>
        <DemoCard
          title={t.demos.savingTitle}
          description={t.demos.savingDescription}
          code={savingCode}
        >
          <SaveButton onSave={() => attendre(4000)} />
        </DemoCard>
        <DemoCard
          title={t.demos.errorTitle}
          description={t.demos.errorDescription}
          code={asyncCode}
        >
          <SaveButton
            onSave={async () => {
              await attendre(600);
              throw new Error("indisponible");
            }}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.messages}>
        <DemoCard
          title={t.demos.messagesTitle}
          description={t.demos.messagesDescription}
          code={messageCode}
        >
          <SaveButton
            onSave={() => attendre(400)}
            successMessage="Devis sauvegardé"
            errorMessage="Le devis n'a pas pu être sauvegardé"
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
