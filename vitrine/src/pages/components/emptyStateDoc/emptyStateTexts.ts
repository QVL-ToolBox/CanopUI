const fr = {
  intro:
    "État vide pour signaler l'absence de contenu et guider vers l'action suivante. L'illustration repose dans une pastille squircle teintée primary, entourée d'un halo qui respire ; elle éclot, puis le titre, la description et l'action montent en cascade, et l'illustration flotte lentement. En thème sombre, la pastille s'allume comme un tube néon. Deux surfaces : ambient, par défaut, pose le contenu dans une Card en verre liquide pour un état vide seul sur sa page ; plain n'a aucune surface et se fond dans une carte, un tableau ou une carte géographique. Mouvement réduit : tout est immobile.",
  sections: {
    usage: "Usage",
    context: "En contexte",
    modes: "Clair et sombre",
    plain: "Surface plate",
    minimal: "Minimal",
    api: "API",
  },
  demos: {
    usage: {
      title: "Icône, description et action",
      description:
        "Par défaut (ambient), le contenu repose dans une Card frosted : verre liquide, squircle et réfraction du fond, ici la canopée.",
    },
    card: {
      title: "Dans une carte",
      description:
        'size="sm" et surface="plain" : l\'état vide se pose directement sur la carte, sans seconde surface.',
      cardTitle: "Documents récents",
    },
    table: {
      title: "Dans un DataTable vide",
      description:
        "Passé en emptyMessage, l'état vide compact occupe la ligne unique du tableau sans casser son rythme.",
    },
    page: {
      title: "En pleine page",
      description:
        'size="lg" agrandit la pastille, son halo et le titre ; le verre flotte sur le fond de la page.',
    },
    modes: {
      title: "Le même état vide, thème clair puis sombre",
      description:
        "Les teintes se lisent dans les variables du thème. En sombre, la pastille porte un halo néon qui grésille à l'apparition.",
    },
    plain: {
      title: "surface plain",
      description:
        'surface="plain" retire la carte de verre : seul le contenu et son halo restent, posés sur le conteneur.',
    },
    minimal: {
      title: "Titre et description seuls",
      description: "Sans icône ni action, l'état vide se réduit à son message.",
    },
  },
  samples: {
    documentsTitle: "Aucun document",
    documentsDescription: "Importez votre premier fichier pour le retrouver ici.",
    importLabel: "Importer",
    searchTitle: "Aucun résultat",
    searchDescription: "Aucun élément ne correspond à votre recherche.",
    recentTitle: "Rien de récent",
    recentDescription: "Les documents ouverts cette semaine apparaîtront ici.",
    tableTitle: "Aucune opération",
    tableDescription: "Les opérations du compte s'afficheront dès la première synchronisation.",
    syncLabel: "Synchroniser",
    pageTitle: "Votre espace est prêt",
    pageDescription:
      "Créez un premier projet pour inviter votre équipe, partager des fichiers et suivre l'avancement.",
    createLabel: "Créer un projet",
    inboxTitle: "Boîte de réception vide",
    inboxDescription: "Vous êtes à jour.",
    columns: { label: "Libellé", date: "Date", amount: "Montant" },
  },
  props: {
    title: "Titre principal de l'état vide.",
    description:
      "Texte sous le titre, centré en couleur secondaire, ou tout nœud (bandeau d'alerte, liste de pistes).",
    icon: "Illustration ou icône, posée dans une pastille squircle teintée primary avec halo.",
    action: "Action principale, typiquement un bouton, affichée sous la description.",
    headingLevel: "Niveau sémantique du titre (h1 à h4).",
    minHeight:
      "Hauteur minimale de la zone (valeur CSS). Par défaut 12rem, 22rem ou 32rem selon size.",
    animated:
      "Active l'éclosion en cascade, le flottement de la pastille et la respiration du halo. Tout est coupé en mouvement réduit.",
    surface:
      "ambient : Card frosted (verre liquide), pour un état vide seul sur sa page. plain : aucune surface, à utiliser dans une carte, un tableau ou une zone déjà peinte.",
    size: "sm pour une carte ou un tableau, md par défaut, lg pour une page entière.",
  },
};

const en: typeof fr = {
  intro:
    "An empty state to signal missing content and guide towards the next action. The illustration rests in a primary-tinted squircle badge wrapped in a breathing halo; it blooms, then the title, description and action rise in a cascade, and the illustration slowly floats. In dark theme, the badge lights up like a neon tube. Two surfaces: ambient, the default, sets the content in a liquid glass Card for an empty state alone on its page; plain has no surface and melts into a card, a table or a map. Reduced motion: everything stays still.",
  sections: {
    usage: "Usage",
    context: "In context",
    modes: "Light and dark",
    plain: "Plain surface",
    minimal: "Minimal",
    api: "API",
  },
  demos: {
    usage: {
      title: "Icon, description and action",
      description:
        "By default (ambient), the content rests in a frosted Card: liquid glass, squircle and refraction of the background, here the canopy.",
    },
    card: {
      title: "Inside a card",
      description:
        'size="sm" and surface="plain": the empty state sits right on the card, with no second surface.',
      cardTitle: "Recent documents",
    },
    table: {
      title: "Inside an empty DataTable",
      description:
        "Passed as emptyMessage, the compact empty state fills the table's single row without breaking its rhythm.",
    },
    page: {
      title: "Full page",
      description:
        'size="lg" enlarges the badge, its halo and the title; the glass floats over the page background.',
    },
    modes: {
      title: "The same empty state, light then dark theme",
      description:
        "Tints are read from the theme variables. In dark theme, the badge wears a neon halo that flickers on appearance.",
    },
    plain: {
      title: "plain surface",
      description:
        'surface="plain" removes the glass card: only the content and its halo remain, set on the container.',
    },
    minimal: {
      title: "Title and description only",
      description: "Without an icon or action, the empty state boils down to its message.",
    },
  },
  samples: {
    documentsTitle: "No documents",
    documentsDescription: "Upload your first file to find it here.",
    importLabel: "Upload",
    searchTitle: "No results",
    searchDescription: "Nothing matches your search.",
    recentTitle: "Nothing recent",
    recentDescription: "Documents opened this week will show up here.",
    tableTitle: "No transactions",
    tableDescription: "Account transactions will show up after the first sync.",
    syncLabel: "Sync",
    pageTitle: "Your space is ready",
    pageDescription: "Create a first project to invite your team, share files and track progress.",
    createLabel: "Create a project",
    inboxTitle: "Inbox empty",
    inboxDescription: "You're all caught up.",
    columns: { label: "Label", date: "Date", amount: "Amount" },
  },
  props: {
    title: "Main title of the empty state.",
    description:
      "Text below the title, centred in secondary colour, or any node (alert banner, list of hints).",
    icon: "Illustration or icon, set in a primary-tinted squircle badge with a halo.",
    action: "Primary action, typically a button, displayed below the description.",
    headingLevel: "Semantic level of the title (h1 to h4).",
    minHeight: "Minimum height of the area (CSS value). Defaults to 12rem, 22rem or 32rem by size.",
    animated:
      "Enables the cascading bloom, the floating badge and the breathing halo. All of it stops under reduced motion.",
    surface:
      "ambient: frosted Card (liquid glass), for an empty state alone on its page. plain: no surface, to use inside a card, a table or an already painted area.",
    size: "sm for a card or a table, md by default, lg for a whole page.",
  },
};

export const emptyStateTexts = { fr, en };

export type EmptyStateTexts = typeof fr;
