const fr = {
  home: "Accueil",
  onThisPage: "Sur cette page",
  showCode: "Afficher le code",
  hideCode: "Masquer le code",
  copy: "Copier",
  copied: "Copié",
  copyFailed: "Échec",
  codeRegion: "Exemple de code",
  props: {
    name: "Nom",
    type: "Type",
    defaultValue: "Défaut",
    description: "Description",
  },
};

const en: typeof fr = {
  home: "Home",
  onThisPage: "On this page",
  showCode: "Show code",
  hideCode: "Hide code",
  copy: "Copy",
  copied: "Copied",
  copyFailed: "Failed",
  codeRegion: "Code example",
  props: {
    name: "Name",
    type: "Type",
    defaultValue: "Default",
    description: "Description",
  },
};

export const docKitTexts = { fr, en };

export type DocKitTexts = typeof fr;
