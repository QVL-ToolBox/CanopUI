import { useState } from "react";
import { Dropzone, Toast } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Dropzone } from "@canop/ui";`;

const promptCode = `function UploadZone() {
  const handleFiles = (files: File[]) => {
    // envoyez les fichiers à votre transport d'upload
  };

  return (
    <Dropzone
      title="Déposez vos fichiers ici"
      hint="ou cliquez pour parcourir — 20 Mo max par fichier"
      onFiles={handleFiles}
    />
  );
}`;

const constraintsCode = `<Dropzone
  title="Déposez une image"
  hint="PNG ou JPEG, un seul fichier"
  accept="image/png,image/jpeg"
  multiple={false}
  onFiles={handleFiles}
/>`;

const disabledCode = `<Dropzone title="Import désactivé" hint="Quota atteint" disabled onFiles={handleFiles} />`;

function formatFiles(files: File[]): string {
  if (files.length === 1) return files[0].name;
  return `${files.length}`;
}

function DropzoneDemo({
  title,
  hint,
  accept,
  multiple,
  feedbackLabel,
}: {
  title: string;
  hint: string;
  accept?: string;
  multiple?: boolean;
  feedbackLabel: string;
}) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <>
      <Dropzone
        title={title}
        hint={hint}
        accept={accept}
        multiple={multiple}
        onFiles={(files) => setMessage(formatFiles(files))}
      />
      <Toast
        open={message !== null}
        message={message ? `${feedbackLabel} ${message}` : ""}
        onClose={() => setMessage(null)}
      />
    </>
  );
}

const fr = {
  intro:
    "Zone de dépôt de fichiers par glisser-déposer ou sélection. En mode invite, elle affiche un appel à l'action ; en mode enveloppe, elle superpose un voile de dépôt au-dessus d'un contenu existant. La liste des fichiers est remontée telle quelle via onFiles, sans logique d'upload imposée.",
  sections: {
    prompt: "Mode invite",
    constraints: "Contraintes de fichiers",
    disabled: "Désactivé",
    wrap: "Mode enveloppe",
    api: "API",
  },
  demos: {
    promptTitle: "Invite cliquable et déposable",
    promptDescription:
      "Sans children, la zone affiche title et hint. Cliquez pour ouvrir le sélecteur ou déposez des fichiers : onFiles reçoit la liste.",
    promptZoneTitle: "Déposez vos fichiers ici",
    promptZoneHint: "ou cliquez pour parcourir — 20 Mo max par fichier",
    constraintsTitle: "accept et multiple",
    constraintsDescription:
      "accept restreint les types acceptés par le sélecteur ; multiple={false} limite à un seul fichier.",
    constraintsZoneTitle: "Déposez une image",
    constraintsZoneHint: "PNG ou JPEG, un seul fichier",
    disabledTitle: "disabled",
    disabledDescription: "La zone grise son contenu et ignore clics comme dépôts.",
    disabledZoneTitle: "Import désactivé",
    disabledZoneHint: "Quota atteint",
    feedbackLabel: "Fichiers reçus :",
  },
  wrapDescription:
    "Avec des children, la Dropzone devient un simple conteneur : elle laisse passer les interactions et n'affiche un voile — dont le texte est overlayLabel — que pendant un glisser au-dessus. Idéal pour rendre déposable une grille de fichiers existante.",
  props: {
    onFiles: "Handler appelé avec la liste des fichiers déposés ou sélectionnés.",
    title: "Titre de l'invite et nom accessible par défaut de la zone.",
    ariaLabel: "Nom accessible explicite de la zone. Prend le pas sur title.",
    hint: "Texte secondaire d'aide sous le titre, en mode invite.",
    overlayLabel: "Texte du voile de dépôt en mode enveloppe. À défaut, title est réutilisé.",
    accept: "Types de fichiers acceptés par le sélecteur (attribut accept natif).",
    multiple: "Autorise la sélection ou le dépôt de plusieurs fichiers.",
    disabled: "Désactive clics et dépôts et grise la zone.",
    children: "Contenu enveloppé ; passe la zone en mode enveloppe avec voile de dépôt.",
  },
};

const en: typeof fr = {
  intro:
    "A file drop zone via drag-and-drop or picker. In prompt mode it shows a call to action; in wrap mode it overlays a drop veil on top of existing content. The file list is surfaced as-is through onFiles, with no imposed upload logic.",
  sections: {
    prompt: "Prompt mode",
    constraints: "File constraints",
    disabled: "Disabled",
    wrap: "Wrap mode",
    api: "API",
  },
  demos: {
    promptTitle: "Clickable and droppable prompt",
    promptDescription:
      "Without children, the zone shows title and hint. Click to open the picker or drop files: onFiles receives the list.",
    promptZoneTitle: "Drop your files here",
    promptZoneHint: "or click to browse — 20 MB max per file",
    constraintsTitle: "accept and multiple",
    constraintsDescription:
      "accept restricts the types accepted by the picker; multiple={false} limits to a single file.",
    constraintsZoneTitle: "Drop an image",
    constraintsZoneHint: "PNG or JPEG, a single file",
    disabledTitle: "disabled",
    disabledDescription: "The zone greys its content and ignores both clicks and drops.",
    disabledZoneTitle: "Upload disabled",
    disabledZoneHint: "Quota reached",
    feedbackLabel: "Files received:",
  },
  wrapDescription:
    "With children, the Dropzone becomes a plain container: it lets interactions through and only shows a veil — whose text is overlayLabel — while dragging over it. Ideal to make an existing file grid droppable.",
  props: {
    onFiles: "Handler called with the list of dropped or selected files.",
    title: "Prompt title and default accessible name of the zone.",
    ariaLabel: "Explicit accessible name of the zone. Takes precedence over title.",
    hint: "Secondary helper text below the title, in prompt mode.",
    overlayLabel: "Text of the drop veil in wrap mode. Falls back to title.",
    accept: "File types accepted by the picker (native accept attribute).",
    multiple: "Allows selecting or dropping several files.",
    disabled: "Disables clicks and drops and greys the zone.",
    children: "Wrapped content; switches the zone to wrap mode with a drop veil.",
  },
};

const texts = { fr, en };

export default function DropzoneDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "onFiles",
      type: "(files: File[]) => void",
      required: true,
      description: t.props.onFiles,
    },
    { name: "title", type: "string", required: true, description: t.props.title },
    { name: "ariaLabel", type: "string", description: t.props.ariaLabel },
    { name: "hint", type: "string", description: t.props.hint },
    { name: "overlayLabel", type: "string", description: t.props.overlayLabel },
    { name: "accept", type: "string", description: t.props.accept },
    { name: "multiple", type: "boolean", defaultValue: "true", description: t.props.multiple },
    { name: "disabled", type: "boolean", defaultValue: "false", description: t.props.disabled },
    { name: "children", type: "ReactNode", description: t.props.children },
  ];

  return (
    <DocPage title="Dropzone" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.prompt}>
        <DemoCard
          title={t.demos.promptTitle}
          description={t.demos.promptDescription}
          code={promptCode}
          align="stretch"
        >
          <DropzoneDemo
            title={t.demos.promptZoneTitle}
            hint={t.demos.promptZoneHint}
            feedbackLabel={t.demos.feedbackLabel}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.constraints}>
        <DemoCard
          title={t.demos.constraintsTitle}
          description={t.demos.constraintsDescription}
          code={constraintsCode}
          align="stretch"
        >
          <DropzoneDemo
            title={t.demos.constraintsZoneTitle}
            hint={t.demos.constraintsZoneHint}
            accept="image/png,image/jpeg"
            multiple={false}
            feedbackLabel={t.demos.feedbackLabel}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.disabled}>
        <DemoCard
          title={t.demos.disabledTitle}
          description={t.demos.disabledDescription}
          code={disabledCode}
          align="stretch"
        >
          <Dropzone
            title={t.demos.disabledZoneTitle}
            hint={t.demos.disabledZoneHint}
            disabled
            onFiles={() => undefined}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.wrap} description={t.wrapDescription} />
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
