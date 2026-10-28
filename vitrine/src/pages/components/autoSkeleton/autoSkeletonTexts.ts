const fr = {
  title: "Squelettes automatiques",
  intro:
    "Les composants CanopUI affichent d'eux-mêmes un squelette à la forme de leur contenu pendant un chargement, sans rien changer dans les portails. Un Spinner posé dans une PageContent ou une Card devient un squelette de liste, de page ou de carte ; un DataTable en loading dessine des lignes fantômes ; PageScaffold attrape les routes lazy dans une frontière Suspense. Le squelette n'apparaît qu'après 180 ms, et reste au moins 400 ms une fois visible quand le composant le pilote.",
  sections: {
    simulation: "Simulation",
    page: "Liste dans une page",
    card: "Dans une carte",
    table: "Tableau",
    fullPage: "Page entière",
    overlay: "Overlays",
    optOut: "Désactiver",
    api: "API",
  },
  controls: {
    title: "Durée du chargement",
    description:
      "Choisis une durée puis recharge : 100 ms vérifie qu'aucun squelette ne clignote, 4 s laisse le temps d'observer la pulsation.",
    durationLabel: "Durée du chargement simulé",
    reload: "Recharger",
    loading: "Chargement…",
    loaded: "Chargé",
  },
  demos: {
    pageTitle: "Spinner dans une PageContent",
    pageDescription:
      "Le code d'un portail, inchangé : un Spinner centré pendant le chargement. Dans une PageContent, il devient trois lignes squircle qui apparaissent en cascade.",
    cardTitle: "Spinner dans une Card",
    cardDescription:
      "Dans une Card, le même Spinner devient trois lignes de texte, sans surface supplémentaire : la carte en est déjà une. Une barre de titre fantôme les précède quand la carte n'a pas de titre.",
    tableTitle: "DataTable loading",
    tableDescription:
      "La prop loading dessine des lignes fantômes alignées sur les colonnes, autant que de lignes déjà connues. Le tableau garde le squelette au moins 400 ms une fois visible.",
    fullPageTitle: 'Spinner size="large"',
    fullPageDescription:
      "Un grand Spinner dans une PageContent annonce une page entière : un titre et une grille de cartes. C'est aussi le repli de la frontière Suspense de PageScaffold.",
    overlayTitle: "SkeletonScope surface={null}",
    overlayDescription:
      "Un overlay ouvert depuis une page hérite de sa portée à travers le portal. SidePanel, ConfirmDialog, CommandPalette, Menu, SettingsMenu et les popups de Map la coupent d'eux-mêmes : un Spinner y reste un Spinner. Une Card dans l'overlay rouvre sa propre portée. surface={null} fait de même pour un overlay maison.",
    optOutTitle: "skeleton={false}",
    optOutDescription:
      "Sur Spinner, DataTable, PageContent ou PageScaffold, skeleton={false} rend l'ancien comportement. Sur PageContent, il vaut pour tout ce qu'elle contient, lignes fantômes des DataTable comprises.",
  },
  props: {
    shape:
      "Forme du squelette : card pour un corps de carte, list pour des lignes, page pour un titre et des tuiles.",
    ariaLabel: "Libellé du progressbar annoncé ; par défaut la traduction canop.spinner.loading.",
    surface:
      "Surface que les Spinner du sous-arbre remplacent. Absente, elle hérite de la portée parente ; null coupe toute portée, comme à la racine d'un overlay.",
    enabled:
      "Active la substitution dans le sous-arbre. false la coupe pour tous les descendants, jusqu'au prochain surface={null}.",
    children: "Sous-arbre soumis à la portée.",
  },
  sample: {
    pageLoading: "Chargement des comptes",
    cardTitle: "Soldes consolidés",
    cardLoading: "Chargement des soldes",
    overlayLoading: "Chargement du panneau",
    overlayLoaded: "Panneau prêt",
    balance: "12 480,00 €",
    balanceHint: "Sur quatre comptes",
    accounts: [
      { id: "courant", name: "Compte courant", detail: "Banque Canopée · 2 140,12 €" },
      { id: "livret", name: "Livret A", detail: "Banque Canopée · 9 870,00 €" },
      { id: "joint", name: "Compte joint", detail: "Banque Lierre · 469,88 €" },
    ],
    columns: { label: "Libellé", date: "Date", amount: "Montant" },
    pageHeading: "Tableau de bord",
  },
};

const en: typeof fr = {
  title: "Automatic skeletons",
  intro:
    "CanopUI components show a skeleton shaped like their content on their own while loading, with no change in the portals. A Spinner placed in a PageContent or a Card becomes a list, page or card skeleton; a loading DataTable draws ghost rows; PageScaffold catches lazy routes in a Suspense boundary. The skeleton only appears after 180 ms, and stays at least 400 ms once visible when the component drives it.",
  sections: {
    simulation: "Simulation",
    page: "List in a page",
    card: "In a card",
    table: "Table",
    fullPage: "Whole page",
    overlay: "Overlays",
    optOut: "Opting out",
    api: "API",
  },
  controls: {
    title: "Loading duration",
    description:
      "Pick a duration then reload: 100 ms checks that no skeleton flashes, 4 s leaves time to watch the pulse.",
    durationLabel: "Simulated loading duration",
    reload: "Reload",
    loading: "Loading…",
    loaded: "Loaded",
  },
  demos: {
    pageTitle: "Spinner in a PageContent",
    pageDescription:
      "A portal's code, unchanged: a centred Spinner while loading. Inside a PageContent, it becomes three squircle rows revealed in a cascade.",
    cardTitle: "Spinner in a Card",
    cardDescription:
      "Inside a Card, the same Spinner becomes three lines of text, with no extra surface: the card already is one. A ghost title bar precedes them when the card has no title.",
    tableTitle: "DataTable loading",
    tableDescription:
      "The loading prop draws ghost rows aligned on the columns, as many as the rows already known. The table keeps the skeleton at least 400 ms once visible.",
    fullPageTitle: 'Spinner size="large"',
    fullPageDescription:
      "A large Spinner in a PageContent stands for a whole page: a title and a grid of cards. It is also the fallback of PageScaffold's Suspense boundary.",
    overlayTitle: "SkeletonScope surface={null}",
    overlayDescription:
      "An overlay opened from a page inherits its scope through the portal. SidePanel, ConfirmDialog, CommandPalette, Menu, SettingsMenu and Map popups cut it on their own: a Spinner stays a Spinner there. A Card inside the overlay opens its own scope. surface={null} does the same for a custom overlay.",
    optOutTitle: "skeleton={false}",
    optOutDescription:
      "On Spinner, DataTable, PageContent or PageScaffold, skeleton={false} restores the former behaviour. On PageContent, it applies to everything inside, DataTable ghost rows included.",
  },
  props: {
    shape:
      "Shape of the skeleton: card for a card body, list for rows, page for a title and tiles.",
    ariaLabel:
      "Label of the announced progressbar; defaults to the canop.spinner.loading translation.",
    surface:
      "Surface the Spinners of the subtree stand for. When absent, it inherits the parent scope; null cuts any scope, as at the root of an overlay.",
    enabled:
      "Enables the substitution in the subtree. false turns it off for every descendant, down to the next surface={null}.",
    children: "Subtree the scope applies to.",
  },
  sample: {
    pageLoading: "Loading accounts",
    cardTitle: "Consolidated balances",
    cardLoading: "Loading balances",
    overlayLoading: "Loading the panel",
    overlayLoaded: "Panel ready",
    balance: "€12,480.00",
    balanceHint: "Across four accounts",
    accounts: [
      { id: "courant", name: "Current account", detail: "Canopy Bank · €2,140.12" },
      { id: "livret", name: "Savings account", detail: "Canopy Bank · €9,870.00" },
      { id: "joint", name: "Joint account", detail: "Ivy Bank · €469.88" },
    ],
    columns: { label: "Label", date: "Date", amount: "Amount" },
    pageHeading: "Dashboard",
  },
};

export const autoSkeletonTexts = { fr, en };

export type AutoSkeletonTexts = typeof fr;
