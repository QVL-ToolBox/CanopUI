import { FileUploader, UploadDropZone } from "@canop/ui";
import { CodeBlock } from "../../kit/CodeBlock";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { FileUploader } from "@canop/ui";`;

const fileUploaderCode = `<FileUploader
  basePath="/api"
  getToken={() => localStorage.getItem("token")}
  onCompleted={(result) => console.log(result.node.id)}
  onError={(error) => console.error(error)}
/>`;

const dropZoneCode = `<UploadDropZone
  title="Glissez un fichier ou cliquez pour parcourir"
  hint="Fichiers jusqu'à 10 Gio"
  onFileSelected={(file) => console.log(file.name)}
/>`;

const hookCode = `import { useChunkedUpload } from "@canop/ui";

function CustomUploader() {
  const { progress, fileName, selectFile, start, pause, resume, abort } =
    useChunkedUpload({
      basePath: "/api",
      getToken: () => localStorage.getItem("token"),
      onCompleted: (result) => console.log(result.node.id),
    });

  return (
    <div>
      <input type="file" onChange={(e) => e.target.files && selectFile(e.target.files[0])} />
      {fileName ? <p>{fileName} — {progress.percentage}%</p> : null}
      <button onClick={start}>Téléverser</button>
      <button onClick={pause}>Pause</button>
      <button onClick={resume}>Reprendre</button>
      <button onClick={abort}>Annuler</button>
    </div>
  );
}`;

const strategyCode = `import { MEBIBYTE, DEFAULT_CHUNK_SIZE, SINGLE_SHOT_THRESHOLD, selectStrategy } from "@canop/ui";

MEBIBYTE;                 // 1 048 576 (1 Mio)
DEFAULT_CHUNK_SIZE;       // 16 * MEBIBYTE (16 Mio par fragment)
SINGLE_SHOT_THRESHOLD;    // 100 * MEBIBYTE (seuil de bascule)

selectStrategy(50 * MEBIBYTE);   // "single-shot"
selectStrategy(500 * MEBIBYTE);  // "chunked"`;

const labelsCode = `<CanopI18nProvider locale="en">
  <FileUploader basePath="/api" getToken={getToken} />
</CanopI18nProvider>

<FileUploader
  basePath="/api"
  getToken={getToken}
  labels={{ start: "Envoyer", dropZoneHint: "PDF uniquement" }}
/>`;

const createUploaderCode = `import { createUploader, fileUploadSource } from "@canop/ui";

const uploader = createUploader({
  basePath: "/api",
  getToken: () => localStorage.getItem("token"),
  chunkSize: 16 * 1024 * 1024,
  onProgress: (progress) => console.log(progress.percentage),
});

const result = await uploader.start({
  source: fileUploadSource(file),
  parentId: "folder-42",
});

uploader.pause();
await uploader.resume();
await uploader.abort();`;

const fr = {
  intro:
    "Module de téléversement de fichiers volumineux. Il combine une zone de dépôt accessible, une stratégie de fragmentation automatique (single-shot ou chunked), la reprise après pause et un suivi de progression, du composant clé en main jusqu'au moteur bas niveau.",
  sections: {
    turnkey: {
      title: "Composant clé en main",
      description:
        "FileUploader assemble la zone de dépôt, la barre de progression et les commandes dans une carte prête à l'emploi. Il pilote tout le cycle de vie via le hook useChunkedUpload.",
    },
    dropZone: {
      title: "Zone de dépôt",
      description:
        "UploadDropZone est la surface de sélection utilisée par FileUploader. Elle gère le clic, le glisser-déposer et la navigation clavier, et peut être réutilisée seule.",
    },
    hook: {
      title: "Hook useChunkedUpload",
      description:
        "Pour une interface sur mesure, useChunkedUpload expose l'état de progression, le nom du fichier, les erreurs et les commandes selectFile, start, pause, resume, abort et reset.",
    },
    labels: {
      title: "Libellés et internationalisation",
      description:
        "Les libellés par défaut proviennent de l'i18n de la librairie via les clés canop.upload.*, et suivent donc la locale active de CanopI18nProvider. La prop labels reste disponible et prend le pas, clé par clé, sur la traduction.",
    },
    strategy: {
      title: "Stratégie de fragmentation",
      description:
        "selectStrategy choisit single-shot en dessous de SINGLE_SHOT_THRESHOLD (100 Mio) et chunked au-delà. En mode chunked, le fichier est découpé en fragments de DEFAULT_CHUNK_SIZE (16 Mio), téléversés séquentiellement avec reprise possible.",
    },
    engine: {
      title: "Moteur createUploader",
      description:
        "createUploader est le cœur agnostique de la plateforme. Il orchestre l'ouverture de session, l'envoi des fragments avec réessais, la pause, la reprise et l'annulation, indépendamment de React.",
    },
  },
  demos: {
    full: {
      title: "Téléversement complet",
      description:
        "La démonstration rend l'interface réelle ; sans serveur d'upload configuré, le lancement échouera après la sélection d'un fichier.",
    },
  },
  props: {
    uploader: {
      basePath: "Racine des routes d'upload côté serveur (ouverture, fragments, finalisation).",
      getToken: "Fournisseur de jeton d'authentification appelé avant chaque requête.",
      parentId: "Identifiant du dossier de destination transmis à l'ouverture de session.",
      filesPath: "Chemin des fichiers finalisés, relatif à basePath.",
      chunkSize: "Taille d'un fragment en octets pour la stratégie chunked.",
      title: "Titre affiché en en-tête de la carte.",
      labels:
        "Surcharge des libellés de la zone de dépôt, des boutons et des états. Prend le pas sur les traductions canop.upload.*.",
      onCompleted: "Appelé une fois le téléversement finalisé avec le nœud créé.",
      onError: "Appelé en cas d'échec, hors pause et annulation.",
    },
    dropZone: {
      title: "Libellé principal de la zone de dépôt, et nom accessible par défaut.",
      ariaLabel: "Nom accessible explicite de la zone. Prend le pas sur title.",
      hint: "Texte secondaire précisant les contraintes de fichier.",
      onFileSelected: "Appelé au dépôt ou à la sélection d'un fichier.",
      disabled: "Neutralise le clic, le glisser-déposer et la navigation clavier.",
    },
  },
};

const en: typeof fr = {
  intro:
    "Large file upload module. It combines an accessible drop zone, an automatic chunking strategy (single-shot or chunked), resume after pause and progress tracking, from the turnkey component down to the low-level engine.",
  sections: {
    turnkey: {
      title: "Turnkey component",
      description:
        "FileUploader assembles the drop zone, the progress bar and the controls into a ready-to-use card. It drives the whole lifecycle through the useChunkedUpload hook.",
    },
    dropZone: {
      title: "Drop zone",
      description:
        "UploadDropZone is the selection surface used by FileUploader. It handles click, drag-and-drop and keyboard navigation, and can be reused on its own.",
    },
    hook: {
      title: "useChunkedUpload hook",
      description:
        "For a custom interface, useChunkedUpload exposes the progress state, the file name, errors and the selectFile, start, pause, resume, abort and reset commands.",
    },
    labels: {
      title: "Labels and internationalisation",
      description:
        "Default labels come from the library i18n through the canop.upload.* keys, and therefore follow the active locale of CanopI18nProvider. The labels prop is still available and takes precedence, key by key, over the translation.",
    },
    strategy: {
      title: "Chunking strategy",
      description:
        "selectStrategy picks single-shot below SINGLE_SHOT_THRESHOLD (100 MiB) and chunked above it. In chunked mode, the file is split into DEFAULT_CHUNK_SIZE chunks (16 MiB), uploaded sequentially with resume support.",
    },
    engine: {
      title: "createUploader engine",
      description:
        "createUploader is the platform-agnostic core. It orchestrates session opening, chunk sending with retries, pause, resume and abort, independently of React.",
    },
  },
  demos: {
    full: {
      title: "Full upload",
      description:
        "The demo renders the real interface; without a configured upload server, starting will fail after a file is selected.",
    },
  },
  props: {
    uploader: {
      basePath: "Root of the server-side upload routes (open, chunks, completion).",
      getToken: "Authentication token provider called before each request.",
      parentId: "Identifier of the destination folder passed when the session is opened.",
      filesPath: "Path of completed files, relative to basePath.",
      chunkSize: "Chunk size in bytes for the chunked strategy.",
      title: "Title displayed in the card header.",
      labels:
        "Override for the labels of the drop zone, buttons and states. Takes precedence over the canop.upload.* translations.",
      onCompleted: "Called once the upload is completed, with the created node.",
      onError: "Called on failure, excluding pause and abort.",
    },
    dropZone: {
      title: "Main label of the drop zone, and default accessible name.",
      ariaLabel: "Explicit accessible name of the zone. Takes precedence over title.",
      hint: "Secondary text specifying the file constraints.",
      onFileSelected: "Called when a file is dropped or selected.",
      disabled: "Disables click, drag-and-drop and keyboard navigation.",
    },
  },
};

const texts = { fr, en };

export default function FileUploaderDoc() {
  const t = texts[useDocLocale()];

  const fileUploaderProps: PropRow[] = [
    {
      name: "basePath",
      type: "string",
      required: true,
      description: t.props.uploader.basePath,
    },
    {
      name: "getToken",
      type: "() => string | null | Promise<string | null>",
      required: true,
      description: t.props.uploader.getToken,
    },
    {
      name: "parentId",
      type: "string",
      description: t.props.uploader.parentId,
    },
    {
      name: "filesPath",
      type: "string",
      description: t.props.uploader.filesPath,
    },
    {
      name: "chunkSize",
      type: "number",
      defaultValue: "16 * MEBIBYTE",
      description: t.props.uploader.chunkSize,
    },
    {
      name: "title",
      type: "string",
      description: t.props.uploader.title,
    },
    {
      name: "labels",
      type: "Partial<CanopFileUploaderLabels>",
      description: t.props.uploader.labels,
    },
    {
      name: "onCompleted",
      type: "(result: CanopUploadResult) => void",
      description: t.props.uploader.onCompleted,
    },
    {
      name: "onError",
      type: "(error: unknown) => void",
      description: t.props.uploader.onError,
    },
  ];

  const dropZoneProps: PropRow[] = [
    {
      name: "title",
      type: "string",
      required: true,
      description: t.props.dropZone.title,
    },
    {
      name: "ariaLabel",
      type: "string",
      description: t.props.dropZone.ariaLabel,
    },
    {
      name: "hint",
      type: "string",
      required: true,
      description: t.props.dropZone.hint,
    },
    {
      name: "onFileSelected",
      type: "(file: File) => void",
      required: true,
      description: t.props.dropZone.onFileSelected,
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: t.props.dropZone.disabled,
    },
  ];

  return (
    <DocPage title="FileUploader" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.turnkey.title} description={t.sections.turnkey.description}>
        <DemoCard
          title={t.demos.full.title}
          description={t.demos.full.description}
          code={fileUploaderCode}
          align="stretch"
        >
          <FileUploader
            basePath="/api"
            getToken={() => localStorage.getItem("token")}
            onCompleted={(result) => console.log(result.node.id)}
            onError={(error) => console.error(error)}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.dropZone.title} description={t.sections.dropZone.description}>
        <DemoCard title="UploadDropZone" code={dropZoneCode} align="stretch">
          <UploadDropZone
            title="Glissez un fichier ou cliquez pour parcourir"
            hint="Fichiers jusqu'à 10 Gio"
            onFileSelected={(file) => console.log(file.name)}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.hook.title} description={t.sections.hook.description}>
        <CodeBlock code={hookCode} />
      </DocSection>
      <DocSection title={t.sections.labels.title} description={t.sections.labels.description}>
        <CodeBlock code={labelsCode} />
      </DocSection>
      <DocSection title={t.sections.strategy.title} description={t.sections.strategy.description}>
        <CodeBlock code={strategyCode} />
      </DocSection>
      <DocSection title={t.sections.engine.title} description={t.sections.engine.description}>
        <CodeBlock code={createUploaderCode} />
      </DocSection>
      <DocSection title="API — CanopFileUploaderProps">
        <PropsTable rows={fileUploaderProps} />
      </DocSection>
      <DocSection title="API — CanopUploadDropZoneProps">
        <PropsTable rows={dropZoneProps} />
      </DocSection>
    </DocPage>
  );
}
