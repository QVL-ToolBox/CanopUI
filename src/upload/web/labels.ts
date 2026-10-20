export interface CanopFileUploaderLabels {
  dropZoneTitle: string;
  dropZoneHint: string;
  start: string;
  pause: string;
  resume: string;
  abort: string;
  change: string;
  opening: string;
  uploading: string;
  completing: string;
  completed: string;
  paused: string;
  aborted: string;
}

export const defaultFileUploaderLabels: CanopFileUploaderLabels = {
  dropZoneTitle: "Glissez un fichier ou cliquez pour parcourir",
  dropZoneHint: "Fichiers jusqu'à 10 Gio",
  start: "Téléverser",
  pause: "Mettre en pause",
  resume: "Reprendre",
  abort: "Annuler",
  change: "Changer de fichier",
  opening: "Initialisation",
  uploading: "Téléversement en cours",
  completing: "Finalisation",
  completed: "Téléversement terminé",
  paused: "Téléversement en pause",
  aborted: "Téléversement annulé",
};

export const FILE_UPLOADER_LABEL_KEYS = Object.keys(
  defaultFileUploaderLabels,
) as (keyof CanopFileUploaderLabels)[];

export const FILE_UPLOADER_MESSAGE_PREFIX = "canop.upload.";

export const UPLOAD_ERROR_FALLBACK_MESSAGE_KEY = `${FILE_UPLOADER_MESSAGE_PREFIX}errorFallback`;

export const defaultUploadErrorFallback = "Échec du téléversement";
