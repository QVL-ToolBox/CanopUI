import { useState } from "react";
import { Button, DataTable, Stack, StatusChip, Text, type CanopColumn } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";
import { StickyHeaderBackdrops } from "./dataTable/StickyHeaderBackdrops";

const importCode = `import { DataTable, type CanopColumn } from "@canop/ui";`;

type DemoStatus = "active" | "pending" | "disabled";

interface DemoUser {
  id: string;
  email: string;
  role: string;
  status: DemoStatus;
  createdAt: string;
}

const rows: DemoUser[] = [
  {
    id: "1",
    email: "alice@custhome.fr",
    role: "Administratrice",
    status: "active",
    createdAt: "2026-01-12",
  },
  {
    id: "2",
    email: "bob@custhome.fr",
    role: "Éditeur",
    status: "pending",
    createdAt: "2026-03-04",
  },
  {
    id: "3",
    email: "carol@custhome.fr",
    role: "Lectrice",
    status: "disabled",
    createdAt: "2026-02-20",
  },
  {
    id: "4",
    email: "david@custhome.fr",
    role: "Éditeur",
    status: "active",
    createdAt: "2026-04-18",
  },
  {
    id: "5",
    email: "emma@custhome.fr",
    role: "Lectrice",
    status: "active",
    createdAt: "2026-05-02",
  },
  {
    id: "6",
    email: "farid@custhome.fr",
    role: "Administrateur",
    status: "pending",
    createdAt: "2026-05-27",
  },
  {
    id: "7",
    email: "gaelle@custhome.fr",
    role: "Éditrice",
    status: "disabled",
    createdAt: "2026-06-11",
  },
  {
    id: "8",
    email: "hugo@custhome.fr",
    role: "Lecteur",
    status: "active",
    createdAt: "2026-06-30",
  },
];

const toneByStatus = {
  active: "success",
  pending: "warning",
  disabled: "error",
} as const;

const columns: CanopColumn<DemoUser>[] = [
  { key: "email", header: "Email", sortable: true },
  { key: "role", header: "Rôle", hideOnMobile: true },
  {
    key: "status",
    header: "Statut",
    render: (row) => <StatusChip tone={toneByStatus[row.status]} label={row.status} />,
  },
  { key: "createdAt", header: "Créé le", sortable: true, align: "right" },
];

const setupCode = `type DemoStatus = "active" | "pending" | "disabled";

interface DemoUser {
  id: string;
  email: string;
  role: string;
  status: DemoStatus;
  createdAt: string;
}

const rows: DemoUser[] = [
  { id: "1", email: "alice@custhome.fr", role: "Administratrice", status: "active", createdAt: "2026-01-12" },
  { id: "2", email: "bob@custhome.fr", role: "Éditeur", status: "pending", createdAt: "2026-03-04" },
  { id: "3", email: "carol@custhome.fr", role: "Lectrice", status: "disabled", createdAt: "2026-02-20" },
];

const toneByStatus = {
  active: "success",
  pending: "warning",
  disabled: "error",
} as const;

const columns: CanopColumn<DemoUser>[] = [
  { key: "email", header: "Email", sortable: true },
  { key: "role", header: "Rôle", hideOnMobile: true },
  {
    key: "status",
    header: "Statut",
    render: (row) => <StatusChip tone={toneByStatus[row.status]} label={row.status} />,
  },
  { key: "createdAt", header: "Créé le", sortable: true, align: "right" },
];`;

const basicCode = `${setupCode}

<DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} />`;

const sortCode = `<DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} />`;

const actionsCode = `<DataTable
  columns={columns}
  rows={rows}
  getRowKey={(row) => row.id}
  actionsHeader="Actions"
  actions={() => (
    <Button size="small" variant="secondary" onClick={() => {}}>
      Voir
    </Button>
  )}
/>`;

const editableCode = `function EditableTable() {
  const [derniere, setDerniere] = useState<DemoUser | null>(null);

  return (
    <Stack gap="sm">
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        editable
        canEditRow={(row) => row.status !== "disabled"}
        onRowEdit={setDerniere}
      />
      <Text variant="caption" tone="muted">
        {derniere ? \`Dernière ligne modifiée : \${derniere.email}\` : "Aucune ligne modifiée"}
      </Text>
    </Stack>
  );
}`;

const dragCode = `function ReorderableTable() {
  const [ordre, setOrdre] = useState(rows);

  const deplacer = (cible: DemoUser, cleDeplacee: string) => {
    setOrdre((courant) => {
      const depart = courant.findIndex((row) => row.id === cleDeplacee);
      const arrivee = courant.findIndex((row) => row.id === cible.id);
      if (depart === -1 || arrivee === -1) return courant;
      const suivant = [...courant];
      const [deplacee] = suivant.splice(depart, 1);
      suivant.splice(arrivee, 0, deplacee);
      return suivant;
    });
  };

  return (
    <DataTable
      columns={columns}
      rows={ordre}
      getRowKey={(row) => row.id}
      draggableRow={() => true}
      canDropRow={(row) => row.status !== "disabled"}
      onRowDrop={deplacer}
    />
  );
}`;

const selectionCode = `function SelectableTable() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      selectable
      selectedKeys={selected}
      onSelectionChange={setSelected}
    />
  );
}`;

const loadingCode = `<DataTable
  columns={columns}
  rows={[]}
  getRowKey={(row) => row.id}
  loading
  fixedLayout
/>`;

const emptyCode = `<DataTable
  columns={columns}
  rows={[]}
  getRowKey={(row) => row.id}
  emptyMessage="Aucun utilisateur"
  fixedLayout
/>`;

const scrollCode = `<DataTable
  columns={columns}
  rows={rows}
  getRowKey={(row) => row.id}
  maxHeight="16rem"
  stickyHeader
  animated
  enableKeyboardNav
/>`;

const stickyBackdropsCode = `function StickyTable() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      maxHeight="16rem"
      stickyHeader
      selectable
      selectedKeys={selected}
      onSelectionChange={setSelected}
      actionsHeader="Actions"
      actions={() => (
        <Button size="small" variant="secondary" onClick={() => {}}>
          Voir
        </Button>
      )}
    />
  );
}

<Card>
  <StickyTable />
</Card>`;

function StickyTable() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      maxHeight="16rem"
      stickyHeader
      selectable
      selectedKeys={selected}
      onSelectionChange={setSelected}
      actionsHeader="Actions"
      actions={() => (
        <Button size="small" variant="secondary" onClick={() => {}}>
          Voir
        </Button>
      )}
    />
  );
}

function EditableTable() {
  const [derniere, setDerniere] = useState<DemoUser | null>(null);

  return (
    <Stack gap="sm">
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        editable
        canEditRow={(row) => row.status !== "disabled"}
        onRowEdit={setDerniere}
      />
      <Text variant="caption" tone="muted">
        {derniere ? `Dernière ligne modifiée : ${derniere.email}` : "Aucune ligne modifiée"}
      </Text>
    </Stack>
  );
}

function ReorderableTable() {
  const [ordre, setOrdre] = useState(rows);

  const deplacer = (cible: DemoUser, cleDeplacee: string) => {
    setOrdre((courant) => {
      const depart = courant.findIndex((row) => row.id === cleDeplacee);
      const arrivee = courant.findIndex((row) => row.id === cible.id);
      if (depart === -1 || arrivee === -1) return courant;
      const suivant = [...courant];
      const [deplacee] = suivant.splice(depart, 1);
      suivant.splice(arrivee, 0, deplacee);
      return suivant;
    });
  };

  return (
    <DataTable
      columns={columns}
      rows={ordre}
      getRowKey={(row) => row.id}
      draggableRow={() => true}
      canDropRow={(row) => row.status !== "disabled"}
      onRowDrop={deplacer}
    />
  );
}

function SelectableTable() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      selectable
      selectedKeys={selected}
      onSelectionChange={setSelected}
    />
  );
}

const fr = {
  intro:
    "Le tableau de données CanopUI. Générique et typé, il combine tri intégré, sélection multiple, actions par ligne, édition, glisser-déposer, navigation clavier, en-tête figée et animations d'apparition.",
  sections: {
    usage: "Utilisation",
    sort: "Tri",
    rowActions: "Actions par ligne",
    editing: "Édition",
    drag: "Glisser-déposer",
    selection: "Sélection",
    states: "États",
    scroll: "Défilement et animations",
    api: "API",
    column: "CanopColumn<T>",
    inViewHook: "Hook useInView",
    inViewResult: "Valeur retournée par useInView",
  },
  demos: {
    basic: {
      title: "Tableau basique",
      description:
        "Fournissez columns, rows et getRowKey. Chaque colonne lit par défaut le champ correspondant à sa clé. Trop large pour l'écran, le tableau défile horizontalement dans son propre conteneur, accessible au clavier, sans faire déborder la page.",
    },
    sort: {
      title: "Colonnes triables",
      description:
        "Marquez une colonne sortable : le clic sur son en-tête alterne tri ascendant, descendant, puis désactivé.",
    },
    actions: {
      title: "Colonne d'actions",
      description:
        "actions rend une cellule en fin de ligne ; actionsHeader nomme la colonne correspondante. Pour une action de modification, préférez editable ci-dessous : le tableau la place, la nomme et la traduit lui-même.",
    },
    editing: {
      title: "editable, onRowEdit et canEditRow",
      description:
        "editable ajoute une action de modification au bout de chaque ligne, après les actions du portail. Elle ouvre sa colonne même sans actions, sinon l'en-tête compterait une cellule de moins que les lignes. canEditRow la rend inactive ligne par ligne — ici sur les comptes désactivés — et son nom accessible vient de la traduction, ou de editLabel.",
    },
    drag: {
      title: "draggableRow, canDropRow et onRowDrop",
      description:
        "Une ligne se saisit et se dépose sur une autre ; le tableau ne réordonne rien lui-même, il signale la cible et la clé déplacée, et c'est le portail qui décide. canDropRow refuse certaines cibles — ici les comptes désactivés — et la ligne survolée se teinte pour l'annoncer.",
    },
    selection: {
      title: "Sélection contrôlée",
      description:
        "selectable active le clic, le Ctrl/Maj+clic, le cadre de sélection et la sélection au clavier (Tab pour entrer dans le tableau, flèches pour naviguer, Espace pour cocher, Maj+flèches pour étendre) ; pilotez l'état avec selectedKeys et onSelectionChange.",
    },
    loading: {
      title: "Chargement",
      description: "loading remplace le corps du tableau par un indicateur de progression.",
    },
    empty: {
      title: "Vide",
      description:
        "En l'absence de données, emptyMessage occupe l'ensemble de la largeur du tableau.",
    },
    scroll: {
      title: "En-tête figée et apparition",
      description:
        "Avec maxHeight, le corps défile en interne ; stickyHeader fige l'en-tête et lui donne sa propre surface, animated anime l'apparition et enableKeyboardNav autorise les flèches haut/bas.",
    },
    stickyBackdrops: {
      title: "En-tête figée sur tous les fonds",
      description:
        "L'en-tête figée est une barre squircle opaque, du même rayon et de la même ombre que les lignes. Pendant le défilement interne, les lignes qui passent dessous sont découpées hors de ses coins arrondis : aucun rectangle de la couleur du thème n'apparaît autour, que le tableau repose sur le fond du thème, une carte, une image ou un verre liquide sur vidéo. Faites défiler chaque tableau pour le vérifier. Ce découpage exige une hauteur bornée (maxHeight ou fillHeight) : en défilement de page, la barre reste squircle mais ses coins ne découpent pas les lignes.",
      backgrounds: {
        theme: "Fond du thème",
        card: "Carte",
        image: "Image (affiche de la canopée)",
        frosted: "Verre liquide sur vidéo de la canopée",
      },
    },
  },
  columnDescription:
    "Chaque entrée de columns décrit une colonne du tableau, de la clé d'accès au rendu personnalisé.",
  inViewDescription:
    "DataTable anime l'apparition des lignes grâce à useInView, qui observe l'entrée d'un élément dans le viewport via IntersectionObserver. Réutilisez-le pour déclencher vos propres animations au défilement.",
  props: {
    columns: "Définition des colonnes : clé, en-tête, alignement, tri et rendu personnalisé.",
    rows: "Données à afficher, une entrée par ligne.",
    getRowKey: "Retourne une clé stable et unique pour chaque ligne.",
    loading: "Affiche un indicateur de chargement à la place des lignes.",
    emptyMessage: "Contenu affiché lorsque rows est vide et loading est faux.",
    actions: "Rend une cellule d'actions en fin de ligne pour la ligne donnée.",
    actionsHeader: "En-tête de la colonne d'actions.",
    actionsWidth: "Largeur figée de la colonne d'actions.",
    editable:
      "Ajoute une action d'édition au bout de chaque ligne, après les actions du portail. Le tableau fournit le bouton, son nom accessible et sa place ; ce que l'édition déclenche reste au portail.",
    onRowEdit: "Appelé avec la ligne au clic sur l'action d'édition.",
    canEditRow: "Rend l'action inactive sur les lignes qui ne sont pas modifiables.",
    editLabel: "Nom accessible de l'action ; par défaut la traduction canop.dataTable.edit.",
    fixedLayout: "Applique table-layout: fixed pour figer la largeur des colonnes.",
    rowSx: "Styles conditionnels appliqués à une ligne selon ses données.",
    stickyHeader:
      "Fige l'en-tête en haut lors du défilement. En défilement de page (sans maxHeight ni fillHeight), la barre reste squircle mais les lignes ne sont pas découpées sous ses coins, et le défilement horizontal intégré est coupé pour que l'en-tête colle à la page : pour un rendu parfait, bornez la hauteur.",
    fillHeight:
      "Étire le tableau pour occuper la hauteur de son conteneur flex et défiler en interne.",
    maxHeight: "Hauteur maximale ; au-delà, le corps du tableau défile en interne.",
    draggableRow: "Rend la ligne déplaçable en glisser-déposer lorsqu'elle retourne vrai.",
    canDropRow: "Indique si la ligne peut recevoir un élément déposé.",
    onRowDrop: "Appelé au dépôt, avec la ligne cible et la clé de la ligne déposée.",
    onRowDoubleClick: "Appelé au double-clic sur une ligne, typiquement pour naviguer.",
    selectable:
      "Active la sélection : clic, Ctrl/Maj+clic, cadre de sélection et colonne de cases à cocher.",
    selectedKeys: "Clés sélectionnées en mode contrôlé.",
    onSelectionChange: "Appelé à chaque évolution de la sélection.",
    onRowContextMenu: "Appelé au clic droit sur une ligne, pour un menu contextuel.",
    animated: "Anime l'apparition des lignes à leur entrée dans le viewport.",
    enableKeyboardNav:
      "Active la navigation clavier (flèches haut/bas, Entrée) avec scroll automatique.",
    displayScrollbar: "Affiche la barre de défilement du conteneur scrollable, masquée si faux.",
    onRowActivate: "Appelé à l'activation d'une ligne au clavier (touche Entrée).",
    mobileBreakpoint:
      "Breakpoint sous lequel les colonnes hideOnMobile sont masquées et la mise en page passe en mode compact.",
    ariaLabel:
      "Nom accessible de la zone de défilement, annoncé quand le tableau déborde ; par défaut la traduction canop.dataTable.scrollRegion.",
  },
  columnProps: {
    key: "Identifiant de la colonne ; sert d'accesseur par défaut sur la ligne.",
    header: "Contenu de l'en-tête de colonne.",
    align: "Alignement horizontal du contenu des cellules.",
    width: "Largeur figée de la colonne.",
    sortable: "Active le tri au clic sur l'en-tête (ascendant, descendant, aucun).",
    hideOnMobile: "Masque la colonne sous le breakpoint défini par mobileBreakpoint.",
    render: "Rendu personnalisé de la cellule ; à défaut, la valeur du champ key est affichée.",
    sortValue: "Valeur utilisée pour le tri lorsqu'elle diffère de la valeur affichée.",
  },
  inViewOptions: {
    root: "Élément racine d'observation ; le viewport par défaut si null.",
    rootMargin: "Marge appliquée autour de la racine pour anticiper l'entrée en vue.",
    amount: "Fraction de l'élément devant être visible pour déclencher l'état inView.",
    once: "Ne déclenche l'état inView qu'une seule fois puis cesse d'observer.",
  },
  inViewResult: {
    ref: "Callback ref à poser sur l'élément à observer.",
    inView: "Vrai lorsque l'élément est visible selon les options fournies.",
  },
};

const en: typeof fr = {
  intro:
    "The CanopUI data table. Generic and typed, it combines built-in sorting, multiple selection, per-row actions, editing, drag and drop, keyboard navigation, sticky header and entrance animations.",
  sections: {
    usage: "Usage",
    sort: "Sorting",
    rowActions: "Per-row actions",
    editing: "Editing",
    drag: "Drag and drop",
    selection: "Selection",
    states: "States",
    scroll: "Scrolling and animations",
    api: "API",
    column: "CanopColumn<T>",
    inViewHook: "useInView hook",
    inViewResult: "Value returned by useInView",
  },
  demos: {
    basic: {
      title: "Basic table",
      description:
        "Provide columns, rows and getRowKey. By default, each column reads the field matching its key. When too wide for the screen, the table scrolls horizontally inside its own container, reachable by keyboard, without overflowing the page.",
    },
    sort: {
      title: "Sortable columns",
      description:
        "Mark a column as sortable: clicking its header cycles through ascending, descending, then disabled.",
    },
    actions: {
      title: "Actions column",
      description:
        "actions renders a cell at the end of each row; actionsHeader names the matching column. For an edit action, prefer editable below: the table places it, names it and translates it on its own.",
    },
    editing: {
      title: "editable, onRowEdit and canEditRow",
      description:
        "editable adds an edit action at the end of every row, after the portal's own actions. It opens its column even without actions, otherwise the header would count one cell fewer than the rows. canEditRow disables it row by row — here on disabled accounts — and its accessible name comes from the translation, or from editLabel.",
    },
    drag: {
      title: "draggableRow, canDropRow and onRowDrop",
      description:
        "A row is grabbed and dropped onto another; the table reorders nothing by itself, it reports the target and the dragged key, and the portal decides. canDropRow refuses some targets — here disabled accounts — and the hovered row tints to say so.",
    },
    selection: {
      title: "Controlled selection",
      description:
        "selectable enables click, Ctrl/Shift+click, the selection box and keyboard selection (Tab to enter the table, arrows to move, Space to check, Shift+arrows to extend); drive the state with selectedKeys and onSelectionChange.",
    },
    loading: {
      title: "Loading",
      description: "loading replaces the table body with a progress indicator.",
    },
    empty: {
      title: "Empty",
      description: "When there is no data, emptyMessage spans the entire width of the table.",
    },
    scroll: {
      title: "Sticky header and entrance",
      description:
        "With maxHeight, the body scrolls internally; stickyHeader pins the header and gives it its own surface, animated animates the entrance and enableKeyboardNav enables the up/down arrows.",
    },
    stickyBackdrops: {
      title: "Sticky header on every background",
      description:
        "The sticky header is an opaque squircle bar, with the same radius and shadow as the rows. During internal scrolling, the rows passing beneath it are cut out of its rounded corners: no rectangle of the theme color shows around it, whether the table sits on the theme background, a card, an image or liquid glass over video. Scroll each table to check. This cut-out requires a bounded height (maxHeight or fillHeight): with page scrolling, the bar stays squircle but its corners do not cut the rows.",
      backgrounds: {
        theme: "Theme background",
        card: "Card",
        image: "Image (canopy poster)",
        frosted: "Liquid glass over the canopy video",
      },
    },
  },
  columnDescription:
    "Each entry in columns describes a table column, from the access key to custom rendering.",
  inViewDescription:
    "DataTable animates the entrance of rows through useInView, which observes an element entering the viewport via IntersectionObserver. Reuse it to trigger your own animations on scroll.",
  props: {
    columns: "Column definition: key, header, alignment, sorting and custom rendering.",
    rows: "Data to display, one entry per row.",
    getRowKey: "Returns a stable, unique key for each row.",
    loading: "Displays a loading indicator instead of the rows.",
    emptyMessage: "Content shown when rows is empty and loading is false.",
    actions: "Renders an actions cell at the end of the row for the given row.",
    actionsHeader: "Header of the actions column.",
    actionsWidth: "Fixed width of the actions column.",
    editable:
      "Adds an edit action at the end of every row, after the portal actions. The table provides the button, its accessible name and its place; what editing triggers stays with the portal.",
    onRowEdit: "Called with the row when the edit action is clicked.",
    canEditRow: "Disables the action on rows that are not editable.",
    editLabel: "Accessible name of the action; defaults to the canop.dataTable.edit translation.",
    fixedLayout: "Applies table-layout: fixed to freeze the column widths.",
    rowSx: "Conditional styles applied to a row based on its data.",
    stickyHeader:
      "Pins the header to the top while scrolling. With page scrolling (no maxHeight or fillHeight), the bar stays squircle but the rows are not cut out beneath its corners, and the built-in horizontal scroll is turned off so the header sticks to the page: for a flawless result, bound the height.",
    fillHeight:
      "Stretches the table to fill the height of its flex container and scroll internally.",
    maxHeight: "Maximum height; beyond it, the table body scrolls internally.",
    draggableRow: "Makes the row draggable when it returns true.",
    canDropRow: "Indicates whether the row can receive a dropped item.",
    onRowDrop: "Called on drop, with the target row and the key of the dropped row.",
    onRowDoubleClick: "Called on double-click of a row, typically to navigate.",
    selectable: "Enables selection: click, Ctrl/Shift+click, selection box and a checkbox column.",
    selectedKeys: "Selected keys in controlled mode.",
    onSelectionChange: "Called on every change of the selection.",
    onRowContextMenu: "Called on right-click of a row, for a context menu.",
    animated: "Animates the entrance of rows as they enter the viewport.",
    enableKeyboardNav: "Enables keyboard navigation (up/down arrows, Enter) with automatic scroll.",
    displayScrollbar: "Displays the scrollbar of the scrollable container, hidden when false.",
    onRowActivate: "Called on keyboard activation of a row (Enter key).",
    mobileBreakpoint:
      "Breakpoint below which hideOnMobile columns are hidden and the layout switches to compact.",
    ariaLabel:
      "Accessible name of the scroll region, announced when the table overflows; defaults to the canop.dataTable.scrollRegion translation.",
  },
  columnProps: {
    key: "Column identifier; used as the default accessor on the row.",
    header: "Content of the column header.",
    align: "Horizontal alignment of the cell content.",
    width: "Fixed width of the column.",
    sortable: "Enables sorting on header click (ascending, descending, none).",
    hideOnMobile: "Hides the column below the breakpoint set by mobileBreakpoint.",
    render: "Custom rendering of the cell; otherwise the value of the key field is displayed.",
    sortValue: "Value used for sorting when it differs from the displayed value.",
  },
  inViewOptions: {
    root: "Root element to observe against; the viewport by default when null.",
    rootMargin: "Margin applied around the root to anticipate entering the view.",
    amount: "Fraction of the element that must be visible to trigger the inView state.",
    once: "Triggers the inView state only once, then stops observing.",
  },
  inViewResult: {
    ref: "Callback ref to attach to the element to observe.",
    inView: "True when the element is visible according to the provided options.",
  },
};

const texts = { fr, en };

export default function DataTableDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    { name: "columns", type: "CanopColumn<T>[]", required: true, description: t.props.columns },
    { name: "rows", type: "T[]", required: true, description: t.props.rows },
    {
      name: "getRowKey",
      type: "(row: T) => string",
      required: true,
      description: t.props.getRowKey,
    },
    { name: "loading", type: "boolean", defaultValue: "false", description: t.props.loading },
    {
      name: "emptyMessage",
      type: "ReactNode",
      defaultValue: 't("canop.dataTable.empty")',
      description: t.props.emptyMessage,
    },
    { name: "actions", type: "(row: T) => ReactNode", description: t.props.actions },
    {
      name: "actionsHeader",
      type: "ReactNode",
      defaultValue: '""',
      description: t.props.actionsHeader,
    },
    { name: "actionsWidth", type: "string | number", description: t.props.actionsWidth },
    { name: "editable", type: "boolean", defaultValue: "false", description: t.props.editable },
    { name: "onRowEdit", type: "(row: T) => void", description: t.props.onRowEdit },
    { name: "canEditRow", type: "(row: T) => boolean", description: t.props.canEditRow },
    { name: "editLabel", type: "string", description: t.props.editLabel },
    {
      name: "fixedLayout",
      type: "boolean",
      defaultValue: "false",
      description: t.props.fixedLayout,
    },
    {
      name: "rowSx",
      type: "(row: T) => Record<string, unknown>",
      description: t.props.rowSx,
    },
    {
      name: "stickyHeader",
      type: "boolean",
      defaultValue: "false",
      description: t.props.stickyHeader,
    },
    {
      name: "fillHeight",
      type: "boolean",
      defaultValue: "false",
      description: t.props.fillHeight,
    },
    { name: "maxHeight", type: "string | number", description: t.props.maxHeight },
    { name: "draggableRow", type: "(row: T) => boolean", description: t.props.draggableRow },
    { name: "canDropRow", type: "(row: T) => boolean", description: t.props.canDropRow },
    {
      name: "onRowDrop",
      type: "(target: T, draggedKey: string) => void",
      description: t.props.onRowDrop,
    },
    {
      name: "onRowDoubleClick",
      type: "(row: T) => void",
      description: t.props.onRowDoubleClick,
    },
    {
      name: "selectable",
      type: "boolean",
      defaultValue: "false",
      description: t.props.selectable,
    },
    { name: "selectedKeys", type: "string[]", description: t.props.selectedKeys },
    {
      name: "onSelectionChange",
      type: "(keys: string[]) => void",
      description: t.props.onSelectionChange,
    },
    {
      name: "onRowContextMenu",
      type: "(row: T, event: React.MouseEvent) => void",
      description: t.props.onRowContextMenu,
    },
    {
      name: "animated",
      type: "boolean",
      defaultValue: "false",
      description: t.props.animated,
    },
    {
      name: "enableKeyboardNav",
      type: "boolean",
      defaultValue: "false",
      description: t.props.enableKeyboardNav,
    },
    {
      name: "displayScrollbar",
      type: "boolean",
      defaultValue: "true",
      description: t.props.displayScrollbar,
    },
    { name: "onRowActivate", type: "(row: T) => void", description: t.props.onRowActivate },
    {
      name: "mobileBreakpoint",
      type: '"xs" | "sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: t.props.mobileBreakpoint,
    },
    { name: "ariaLabel", type: "string", description: t.props.ariaLabel },
  ];

  const columnRows: PropRow[] = [
    { name: "key", type: "string", required: true, description: t.columnProps.key },
    { name: "header", type: "ReactNode", required: true, description: t.columnProps.header },
    {
      name: "align",
      type: '"left" | "center" | "right"',
      defaultValue: '"left"',
      description: t.columnProps.align,
    },
    { name: "width", type: "string | number", description: t.columnProps.width },
    {
      name: "sortable",
      type: "boolean",
      defaultValue: "false",
      description: t.columnProps.sortable,
    },
    {
      name: "hideOnMobile",
      type: "boolean",
      defaultValue: "false",
      description: t.columnProps.hideOnMobile,
    },
    { name: "render", type: "(row: T) => ReactNode", description: t.columnProps.render },
    {
      name: "sortValue",
      type: "(row: T) => string | number",
      description: t.columnProps.sortValue,
    },
  ];

  const inViewOptionRows: PropRow[] = [
    {
      name: "root",
      type: "Element | null",
      defaultValue: "null",
      description: t.inViewOptions.root,
    },
    {
      name: "rootMargin",
      type: "string",
      defaultValue: '"0px"',
      description: t.inViewOptions.rootMargin,
    },
    {
      name: "amount",
      type: "number",
      defaultValue: "0.1",
      description: t.inViewOptions.amount,
    },
    {
      name: "once",
      type: "boolean",
      defaultValue: "true",
      description: t.inViewOptions.once,
    },
  ];

  const inViewResultRows: PropRow[] = [
    { name: "ref", type: "(node: T | null) => void", description: t.inViewResult.ref },
    { name: "inView", type: "boolean", description: t.inViewResult.inView },
  ];

  return (
    <DocPage title="DataTable" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.basic.title}
          description={t.demos.basic.description}
          code={basicCode}
          align="stretch"
        >
          <DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.sort}>
        <DemoCard
          title={t.demos.sort.title}
          description={t.demos.sort.description}
          code={sortCode}
          align="stretch"
        >
          <DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.rowActions}>
        <DemoCard
          title={t.demos.actions.title}
          description={t.demos.actions.description}
          code={actionsCode}
          align="stretch"
        >
          <DataTable
            columns={columns}
            rows={rows}
            getRowKey={(row) => row.id}
            actionsHeader="Actions"
            actions={() => (
              <Button size="small" variant="secondary" onClick={() => {}}>
                Voir
              </Button>
            )}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.editing}>
        <DemoCard
          title={t.demos.editing.title}
          description={t.demos.editing.description}
          code={editableCode}
          align="stretch"
        >
          <EditableTable />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.drag}>
        <DemoCard
          title={t.demos.drag.title}
          description={t.demos.drag.description}
          code={dragCode}
          align="stretch"
        >
          <ReorderableTable />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.selection}>
        <DemoCard
          title={t.demos.selection.title}
          description={t.demos.selection.description}
          code={selectionCode}
          align="stretch"
        >
          <SelectableTable />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.states}>
        <DemoCard
          title={t.demos.loading.title}
          description={t.demos.loading.description}
          code={loadingCode}
          align="stretch"
        >
          <DataTable columns={columns} rows={[]} getRowKey={(row) => row.id} loading fixedLayout />
        </DemoCard>
        <DemoCard
          title={t.demos.empty.title}
          description={t.demos.empty.description}
          code={emptyCode}
          align="stretch"
        >
          <DataTable
            columns={columns}
            rows={[]}
            getRowKey={(row) => row.id}
            emptyMessage="Aucun utilisateur"
            fixedLayout
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.scroll}>
        <DemoCard
          title={t.demos.scroll.title}
          description={t.demos.scroll.description}
          code={scrollCode}
          align="stretch"
        >
          <DataTable
            columns={columns}
            rows={rows}
            getRowKey={(row) => row.id}
            maxHeight="16rem"
            stickyHeader
            animated
            enableKeyboardNav
          />
        </DemoCard>
        <DemoCard
          title={t.demos.stickyBackdrops.title}
          description={t.demos.stickyBackdrops.description}
          code={stickyBackdropsCode}
          align="stretch"
        >
          <StickyHeaderBackdrops
            labels={t.demos.stickyBackdrops.backgrounds}
            table={<StickyTable />}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
      <DocSection title={t.sections.column} description={t.columnDescription}>
        <PropsTable rows={columnRows} />
      </DocSection>
      <DocSection title={t.sections.inViewHook} description={t.inViewDescription}>
        <PropsTable rows={inViewOptionRows} />
      </DocSection>
      <DocSection title={t.sections.inViewResult}>
        <PropsTable rows={inViewResultRows} />
      </DocSection>
    </DocPage>
  );
}
