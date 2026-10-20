import type { LocalizedLabel } from "../i18n/useDocLocale";

export interface NavEntry {
  path: string;
  title: LocalizedLabel;
  description: LocalizedLabel;
}

export interface NavCategory {
  title: LocalizedLabel;
  entries: NavEntry[];
}

function same(label: string): LocalizedLabel {
  return { fr: label, en: label };
}

export const gettingStartedCategory: NavCategory = {
  title: { fr: "Prise en main", en: "Getting started" },
  entries: [
    {
      path: "/docs/installation",
      title: same("Installation"),
      description: {
        fr: "Installer @canop/ui depuis le registre npm QVL.",
        en: "Install @canop/ui from the QVL npm registry.",
      },
    },
    {
      path: "/docs/utilisation",
      title: { fr: "Utilisation", en: "Usage" },
      description: {
        fr: "Providers, premier composant et hooks du design system.",
        en: "Providers, first component and design system hooks.",
      },
    },
    {
      path: "/docs/theming",
      title: same("Theming"),
      description: {
        fr: "Tokens, palettes light/dark, typographie et CSS variables.",
        en: "Tokens, light/dark palettes, typography and CSS variables.",
      },
    },
    {
      path: "/docs/typographie",
      title: { fr: "Typographie", en: "Typography" },
      description: {
        fr: "Titan One et Chivo, échelle des titres et du corps, crénage optique et graisses.",
        en: "Variable Chivo, heading and body scales, optical tracking and weights.",
      },
    },
    {
      path: "/docs/icones",
      title: { fr: "Icônes", en: "Icons" },
      description: {
        fr: "Galerie interactive des icônes CanopUI.",
        en: "Interactive gallery of CanopUI icons.",
      },
    },
  ],
};

export const releasesEntry: NavEntry = {
  path: "/docs/versions",
  title: { fr: "Notes de version", en: "Release notes" },
  description: {
    fr: "Suivi des versions et notes de version, lues depuis le CHANGELOG.",
    en: "Release tracking and notes, read from the CHANGELOG.",
  },
};

export const releasesCategory: NavCategory = {
  title: { fr: "Versions", en: "Releases" },
  entries: [releasesEntry],
};

export const componentCategories: NavCategory[] = [
  {
    title: same("Inputs"),
    entries: [
      {
        path: "/components/button",
        title: same("Button"),
        description: {
          fr: "Bouton d'action avec variantes, tailles et état de chargement.",
          en: "Action button with variants, sizes and loading state.",
        },
      },
      {
        path: "/components/pressable",
        title: same("Pressable"),
        description: {
          fr: "Surface cliquable sans apparence : forme, focus et sélection.",
          en: "A clickable surface with no look of its own: shape, focus and selection.",
        },
      },
      {
        path: "/components/inline-input",
        title: same("InlineInput"),
        description: {
          fr: "Champ d'édition en place : Entrée valide, Échap abandonne.",
          en: "In-place editing field: Enter commits, Escape cancels.",
        },
      },
      {
        path: "/components/input",
        title: same("Input"),
        description: {
          fr: "Champ de saisie avec validation, icône et types spécialisés.",
          en: "Text field with validation, icon and specialized types.",
        },
      },
      {
        path: "/components/checkbox",
        title: same("Checkbox"),
        description: {
          fr: "Case à cocher avec label, sous-label et état indéterminé.",
          en: "Checkbox with label, sublabel and indeterminate state.",
        },
      },
      {
        path: "/components/toggle",
        title: same("Toggle"),
        description: {
          fr: "Interrupteur animé pour les états binaires.",
          en: "Animated switch for binary states.",
        },
      },
      {
        path: "/components/slider",
        title: same("Slider"),
        description: {
          fr: "Curseur contrôlé avec libellé, valeur et graduations.",
          en: "Controlled slider with label, value and marks.",
        },
      },
      {
        path: "/components/multi-select",
        title: same("MultiSelect"),
        description: {
          fr: "Sélection multiple avec chips et liste déroulante.",
          en: "Multiple selection with chips and dropdown list.",
        },
      },
      {
        path: "/components/select",
        title: same("Select"),
        description: {
          fr: "Sélecteur mono-valeur avec libellé accessible et options illustrées.",
          en: "Single-value selector with accessible label and illustrated options.",
        },
      },
      {
        path: "/components/autocomplete",
        title: same("Autocomplete"),
        description: {
          fr: "Champ à suggestions : filtrage sans accents, suggestion présélectionnée.",
          en: "Field with suggestions: accent-insensitive filtering, preselected suggestion.",
        },
      },
      {
        path: "/components/form",
        title: same("Form"),
        description: {
          fr: "Formulaire orchestré par le hook useForm.",
          en: "Form orchestrated by the useForm hook.",
        },
      },
      {
        path: "/components/language-selector",
        title: same("LanguageSelector"),
        description: {
          fr: "Sélecteur de langue branché sur l'i18n CanopUI.",
          en: "Language selector wired to CanopUI i18n.",
        },
      },
      {
        path: "/components/segmented-control",
        title: same("SegmentedControl"),
        description: {
          fr: "Sélecteur segmenté animé pour choisir une option parmi plusieurs.",
          en: "Animated segmented control to pick one option among several.",
        },
      },
      {
        path: "/components/theme-toggle",
        title: same("ThemeToggle"),
        description: {
          fr: "Bascule thème clair / sombre branchée sur le thème CanopUI.",
          en: "Light / dark theme toggle wired to the CanopUI theme.",
        },
      },
    ],
  },
  {
    title: { fr: "Boutons spécialisés", en: "Specialized buttons" },
    entries: [
      {
        path: "/components/add-button",
        title: same("AddButton"),
        description: {
          fr: "Bouton d'ajout avec icône plus intégrée.",
          en: "Add button with built-in plus icon.",
        },
      },
      {
        path: "/components/save-button",
        title: same("SaveButton"),
        description: {
          fr: "Bouton d’enregistrement unique, avec son toast de confirmation.",
          en: "Single save button, with its confirmation toast.",
        },
      },
      {
        path: "/components/approve-button",
        title: same("ApproveButton"),
        description: {
          fr: "Bouton de validation avec icône check.",
          en: "Approval button with check icon.",
        },
      },
      {
        path: "/components/edit-button",
        title: same("EditButton"),
        description: {
          fr: "Bouton d'édition avec icône crayon.",
          en: "Edit button with pencil icon.",
        },
      },
      {
        path: "/components/delete-button",
        title: same("DeleteButton"),
        description: {
          fr: "Bouton de suppression avec confirmation intégrée.",
          en: "Delete button with built-in confirmation.",
        },
      },
      {
        path: "/components/icon-action-button",
        title: same("IconActionButton"),
        description: {
          fr: "Bouton d'action carré à icône, en quatre variantes.",
          en: "Square icon action button, in four variants.",
        },
      },
    ],
  },
  {
    title: { fr: "Affichage de données", en: "Data display" },
    entries: [
      {
        path: "/components/bento-grid",
        title: same("BentoGrid"),
        description: {
          fr: "Grille bento : tuiles à étendue variable, entrée en cascade.",
          en: "Bento grid: variable-extent tiles with a staggered entrance.",
        },
      },
      {
        path: "/components/card",
        title: same("Card"),
        description: {
          fr: "Carte avec titre, sous-titre, actions, élévations et verre dépoli.",
          en: "Card with title, subtitle, actions, elevations and frosted glass.",
        },
      },
      {
        path: "/components/card-grid",
        title: same("CardGrid"),
        description: {
          fr: "Grille responsive auto-adaptative pour cartes.",
          en: "Auto-fit responsive grid for cards.",
        },
      },
      {
        path: "/components/carousel",
        title: same("Carousel"),
        description: {
          fr: "Carrousel une carte à la fois, flèches ou barres, et hook useCarousel.",
          en: "One-card-at-a-time carousel, arrows or bars, and the useCarousel hook.",
        },
      },
      {
        path: "/components/data-table",
        title: same("DataTable"),
        description: {
          fr: "Table riche : tri, sélection, drag & drop, clavier, animations.",
          en: "Rich table: sorting, selection, drag & drop, keyboard, animations.",
        },
      },
      {
        path: "/components/description-list",
        title: same("DescriptionList"),
        description: {
          fr: "Liste de paires libellé / valeur.",
          en: "List of label / value pairs.",
        },
      },
      {
        path: "/components/bullet-list",
        title: same("BulletList"),
        description: {
          fr: "Liste à puces avec icônes personnalisables.",
          en: "Bullet list with customizable icons.",
        },
      },
      {
        path: "/components/status-chip",
        title: same("StatusChip"),
        description: {
          fr: "Pastille de statut en cinq tonalités.",
          en: "Status chip in five tones.",
        },
      },
      {
        path: "/components/badge",
        title: same("Badge"),
        description: {
          fr: "Pastille de compteur ou point de notification, seule ou ancrée à un élément.",
          en: "Count or notification dot badge, standalone or anchored to an element.",
        },
      },
      {
        path: "/components/avatar",
        title: same("Avatar"),
        description: {
          fr: "Initiales d'un nom sur une teinte du thème, stable d'un écran à l'autre.",
          en: "Initials of a name on a theme tint, stable from one screen to the next.",
        },
      },
      {
        path: "/components/rating",
        title: same("Rating"),
        description: {
          fr: "Note moyenne en étoiles, lecture seule, remplissage fractionnaire.",
          en: "Average star rating, read-only, with fractional filling.",
        },
      },
      {
        path: "/components/stat-card",
        title: same("StatCard"),
        description: {
          fr: "Carte de métrique avec valeur, variation et icône.",
          en: "Metric card with value, variation and icon.",
        },
      },
      {
        path: "/components/donut",
        title: same("Donut"),
        description: {
          fr: "Graphique en anneau segmenté avec légende et contenu central.",
          en: "Segmented donut chart with legend and center content.",
        },
      },
      {
        path: "/components/legal-links",
        title: same("LegalLinks"),
        description: {
          fr: "Pied de page légal : conditions d'utilisation et mentions légales.",
          en: "Legal footer: terms of use and legal notice.",
        },
      },
      {
        path: "/components/legend",
        title: same("Legend"),
        description: {
          fr: "Légende de statuts pour tableaux et graphiques.",
          en: "Status legend for tables and charts.",
        },
      },
      {
        path: "/components/heading",
        title: same("Heading"),
        description: {
          fr: "Titres hiérarchisés h1 à h4 avec échelle typographique.",
          en: "Hierarchical h1 to h4 headings with a typographic scale.",
        },
      },
      {
        path: "/components/text",
        title: same("Text"),
        description: {
          fr: "Corps de texte, libellés, légendes, surtitres et métriques.",
          en: "Body text, labels, captions, overlines and metrics.",
        },
      },
      {
        path: "/components/icon",
        title: same("Icon"),
        description: {
          fr: "Icône du set CanopUI en deux variantes et cinq tailles.",
          en: "CanopUI icon set in two variants and five sizes.",
        },
      },
    ],
  },
  {
    title: same("Feedback"),
    entries: [
      {
        path: "/components/feedback",
        title: same("Feedback"),
        description: {
          fr: "Encart de message contextuel en quatre sévérités.",
          en: "Contextual message block in four severities.",
        },
      },
      {
        path: "/components/toast",
        title: same("Toast"),
        description: {
          fr: "Notification éphémère avec fermeture automatique.",
          en: "Ephemeral notification with auto-close.",
        },
      },
      {
        path: "/components/spinner",
        title: same("Spinner"),
        description: {
          fr: "Indicateur de chargement circulaire.",
          en: "Circular loading indicator.",
        },
      },
      {
        path: "/components/skeleton",
        title: same("Skeleton"),
        description: {
          fr: "Gabarit de chargement en bloc ou en lignes, figé en mouvement réduit.",
          en: "Loading placeholder as a block or lines, frozen under reduced motion.",
        },
      },
      {
        path: "/components/live-region",
        title: same("LiveRegion"),
        description: {
          fr: "Annonces aux lecteurs d'écran, polies ou assertives, même répétées.",
          en: "Screen reader announcements, polite or assertive, even when repeated.",
        },
      },
      {
        path: "/components/progress-bar",
        title: same("ProgressBar"),
        description: {
          fr: "Barre de progression déterminée, simple ou segmentée.",
          en: "Determinate progress bar, single or segmented.",
        },
      },
      {
        path: "/components/confirm-dialog",
        title: same("ConfirmDialog"),
        description: {
          fr: "Boîte de dialogue de confirmation d'action.",
          en: "Action confirmation dialog.",
        },
      },
      {
        path: "/components/empty-state",
        title: same("EmptyState"),
        description: {
          fr: "État vide illustré avec titre, description et action.",
          en: "Illustrated empty state with title, description and action.",
        },
      },
    ],
  },
  {
    title: same("Navigation"),
    entries: [
      {
        path: "/components/navbar",
        title: same("Navbar"),
        description: {
          fr: "Barre de navigation latérale responsive avec sous-menus.",
          en: "Responsive side navigation bar with submenus.",
        },
      },
      {
        path: "/components/menu",
        title: same("Menu"),
        description: {
          fr: "Menu contextuel positionnable avec items.",
          en: "Positionable contextual menu with items.",
        },
      },
      {
        path: "/components/link",
        title: same("Link"),
        description: {
          fr: "Lien stylé compatible avec les routeurs externes.",
          en: "Styled link compatible with external routers.",
        },
      },
      {
        path: "/components/side-panel",
        title: same("SidePanel"),
        description: {
          fr: "Panneau latéral coulissant avec titre et footer.",
          en: "Sliding side panel with title and footer.",
        },
      },
      {
        path: "/components/settings-menu",
        title: same("SettingsMenu"),
        description: {
          fr: "Menu de réglages : thème, langue, déconnexion.",
          en: "Settings menu: theme, language, logout.",
        },
      },
      {
        path: "/components/command-palette",
        title: same("CommandPalette"),
        description: {
          fr: "Palette de commandes ⌘K avec recherche floue et navigation clavier.",
          en: "⌘K command palette with fuzzy search and keyboard navigation.",
        },
      },
      {
        path: "/components/breadcrumb",
        title: same("Breadcrumb"),
        description: {
          fr: "Fil d'Ariane avec repli automatique des niveaux intermédiaires.",
          en: "Breadcrumb trail with automatic collapsing of middle levels.",
        },
      },
      {
        path: "/components/toolbar",
        title: same("Toolbar"),
        description: {
          fr: "Barre d'outils : recherche, tri, bascule de vue et actions.",
          en: "Toolbar: search, sort, view toggle and actions.",
        },
      },
      {
        path: "/components/cookie-banner",
        title: same("CookieBanner"),
        description: {
          fr: "Bandeau de consentement aux cookies, avec mémorisation du choix.",
          en: "Cookie consent banner, with the choice remembered.",
        },
      },
      {
        path: "/components/scrollbar",
        title: same("Scrollbar"),
        description: {
          fr: "Barre de défilement du design system, appliquée par le thème.",
          en: "Design system scrollbar, applied by the theme.",
        },
      },
      {
        path: "/components/selection-bar",
        title: same("SelectionBar"),
        description: {
          fr: "Barre d'actions groupées sur une sélection multiple.",
          en: "Bulk action bar for a multiple selection.",
        },
      },
    ],
  },
  {
    title: { fr: "Mise en page", en: "Layout" },
    entries: [
      {
        path: "/components/stack",
        title: same("Stack"),
        description: {
          fr: "Empilement flexbox avec gaps issus des tokens.",
          en: "Flexbox stack with token-based gaps.",
        },
      },
      {
        path: "/components/layout",
        title: same("Layout"),
        description: {
          fr: "Gabarit de page avec navbar et zone de contenu.",
          en: "Page template with navbar and content area.",
        },
      },
      {
        path: "/components/page-scaffold",
        title: same("PageScaffold"),
        description: {
          fr: "Squelette de page complet : navigation, contenu, footer.",
          en: "Complete page skeleton: navigation, content, footer.",
        },
      },
      {
        path: "/components/page-content",
        title: same("PageContent"),
        description: {
          fr: "Conteneur de contenu avec en-tête et footer de page.",
          en: "Content container with page header and footer.",
        },
      },
      {
        path: "/components/divider",
        title: same("Divider"),
        description: {
          fr: "Séparateur horizontal ou vertical avec espacement.",
          en: "Horizontal or vertical divider with spacing.",
        },
      },
      {
        path: "/components/separator",
        title: same("Separator"),
        description: {
          fr: "Séparateur décoratif léger.",
          en: "Light decorative separator.",
        },
      },
      {
        path: "/components/canopy-background",
        title: same("CanopyBackground"),
        description: {
          fr: "Fond animé de canopée, une scène par thème.",
          en: "Animated canopy background, one scene per theme.",
        },
      },
      {
        path: "/components/shape-background",
        title: same("ShapeBackground"),
        description: {
          fr: "Arrière-plan décoratif à formes organiques.",
          en: "Decorative background with organic shapes.",
        },
      },
      {
        path: "/components/halloween-decor",
        title: same("HalloweenDecor"),
        description: {
          fr: "Décor saisonnier : chauves-souris, fantômes, brume, lucioles et citrouilles.",
          en: "Seasonal decor: bats, ghosts, mist, fireflies and pumpkins.",
        },
      },
      {
        path: "/components/sliding-indicator",
        title: same("SlidingIndicator"),
        description: {
          fr: "Indicateur coulissant animé partagé entre plusieurs éléments.",
          en: "Animated sliding indicator shared across several elements.",
        },
      },
      {
        path: "/components/visually-hidden",
        title: same("VisuallyHidden"),
        description: {
          fr: "Contenu masqué à l'écran mais lu par les technologies d'assistance.",
          en: "Content hidden from the screen but read by assistive technologies.",
        },
      },
    ],
  },
  {
    title: same("Modules"),
    entries: [
      {
        path: "/components/file-uploader",
        title: same("Upload"),
        description: {
          fr: "Upload de fichiers par chunks : FileUploader et UploadDropZone.",
          en: "Chunked file upload: FileUploader and UploadDropZone.",
        },
      },
      {
        path: "/components/file-card",
        title: same("FileCard"),
        description: {
          fr: "Carte de fichier ou dossier avec aperçu, sélection et menu.",
          en: "File or folder card with preview, selection and menu.",
        },
      },
      {
        path: "/components/dropzone",
        title: same("Dropzone"),
        description: {
          fr: "Zone de dépôt de fichiers par glisser-déposer ou sélection.",
          en: "File drop zone via drag-and-drop or picker.",
        },
      },
      {
        path: "/components/lightbox",
        title: same("Lightbox"),
        description: {
          fr: "Visionneuse plein écran d'images et documents avec navigation.",
          en: "Full-screen viewer for images and documents with navigation.",
        },
      },
      {
        path: "/components/map",
        title: same("Map"),
        description: {
          fr: "Carte OpenStreetMap avec marqueurs, bulles et clic — sous-chemin @canop/ui/map.",
          en: "OpenStreetMap map with markers, popups and click — @canop/ui/map subpath.",
        },
      },
      {
        path: "/components/route-guard",
        title: same("Auth"),
        description: {
          fr: "Garde de routes, utilisateur courant et redirections.",
          en: "Route guard, current user and redirects.",
        },
      },
      {
        path: "/components/i18n",
        title: same("i18n"),
        description: {
          fr: "Internationalisation : provider, hook et messages.",
          en: "Internationalization: provider, hook and messages.",
        },
      },
      {
        path: "/components/http",
        title: same("HTTP"),
        description: {
          fr: "Client API typé avec gestion d'erreurs normalisée.",
          en: "Typed API client with normalized error handling.",
        },
      },
      {
        path: "/components/validation",
        title: same("Validation"),
        description: {
          fr: "Règles de validation : email, nom, force du mot de passe.",
          en: "Validation rules: email, name, password strength.",
        },
      },
      {
        path: "/components/sound",
        title: same("Sound"),
        description: {
          fr: "Sons du design system : provider, catalogue sémantique, coupure et volume.",
          en: "Design system sounds: provider, semantic catalogue, mute and volume.",
        },
      },
      {
        path: "/components/local-store",
        title: same("Local store"),
        description: {
          fr: "État local typé, versionné, gardé en mémoire et synchronisé entre onglets.",
          en: "Typed, versioned local state, kept in memory and synced across tabs.",
        },
      },
      {
        path: "/components/countdown",
        title: same("Countdown"),
        description: {
          fr: "Compte à rebours calé sur une échéance absolue, donc sans dérive.",
          en: "Countdown anchored on an absolute deadline, therefore drift-free.",
        },
      },
      {
        path: "/components/game",
        title: same("Game"),
        description: {
          fr: "Pièces de partie : vies, série avec multiplicateur, éclair et grille partageable.",
          en: "Round pieces: lives, streak with multiplier, flash and shareable grid.",
        },
      },
      {
        path: "/components/clipboard",
        title: same("Clipboard"),
        description: {
          fr: "Copie dans le presse-papier et valeur fugace, échec exposé plutôt qu'avalé.",
          en: "Clipboard copy and transient value, with failure exposed rather than swallowed.",
        },
      },
      {
        path: "/components/svg-map",
        title: same("SVG map"),
        description: {
          fr: "Carte SVG gestuelle : pincement, glissement, sélection au doigt et au clavier.",
          en: "Gesture-driven SVG map: pinch, drag, selection by finger and by keyboard.",
        },
      },
    ],
  },
];

export const navCategories: NavCategory[] = [
  gettingStartedCategory,
  releasesCategory,
  ...componentCategories,
];

export const allComponentEntries: NavEntry[] = componentCategories.flatMap(
  (category) => category.entries,
);
