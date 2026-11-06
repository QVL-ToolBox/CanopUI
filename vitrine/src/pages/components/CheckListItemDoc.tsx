import { useState } from "react";
import {
  Button,
  CheckListItem,
  DeleteButton,
  EditButton,
  InlineInput,
  Presence,
  PresenceItem,
  Stack,
} from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { CheckListItem } from "@canop/ui";`;

const ACTION_SIZE = "2.25rem";

interface DemoArticle {
  id: number;
  label: string;
  done: boolean;
}

const FIRST_ARTICLES: DemoArticle[] = [
  { id: 1, label: "Beurre demi-sel", done: false },
  { id: 2, label: "Pain de campagne", done: true },
  { id: 3, label: "Lait demi-écrémé", done: false },
  { id: 4, label: "Six œufs plein air", done: false },
];

function useDemoArticles(initial: DemoArticle[]) {
  const [articles, setArticles] = useState(initial);
  const update = (id: number, change: Partial<DemoArticle>) =>
    setArticles((list) => list.map((item) => (item.id === id ? { ...item, ...change } : item)));
  const remove = (id: number) => setArticles((list) => list.filter((item) => item.id !== id));
  const checkout = () => setArticles((list) => list.filter((item) => !item.done));
  return { articles, update, remove, checkout, hasDone: articles.some((item) => item.done) };
}

interface ShoppingRowProps {
  article: DemoArticle;
  onUpdate: (id: number, change: Partial<DemoArticle>) => void;
  onRemove: (id: number) => void;
}

function useRenaming(article: DemoArticle, onUpdate: ShoppingRowProps["onUpdate"]) {
  const [draft, setDraft] = useState<string | null>(null);
  const commit = () => {
    const label = draft?.trim();
    if (label) onUpdate(article.id, { label });
    setDraft(null);
  };
  return {
    draft,
    setDraft,
    commit,
    start: () => setDraft(article.label),
    cancel: () => setDraft(null),
  };
}

function ShoppingRow({ article, onUpdate, onRemove }: ShoppingRowProps) {
  const renaming = useRenaming(article, onUpdate);

  return (
    <CheckListItem
      label={article.label}
      checked={article.done}
      onCheckedChange={(done) => onUpdate(article.id, { done })}
      editor={
        renaming.draft === null ? undefined : (
          <InlineInput
            value={renaming.draft}
            onChange={renaming.setDraft}
            onCommit={renaming.commit}
            onCancel={renaming.cancel}
            ariaLabel={`Nouveau nom de ${article.label}`}
          />
        )
      }
      actions={
        <>
          <EditButton
            ariaLabel={`Renommer ${article.label}`}
            size={ACTION_SIZE}
            iconSize="sm"
            onClick={renaming.start}
          />
          <DeleteButton
            ariaLabel={`Supprimer ${article.label}`}
            size={ACTION_SIZE}
            iconSize="sm"
            onConfirm={() => onRemove(article.id)}
          />
        </>
      }
    />
  );
}

function ShoppingList() {
  const { articles, update, remove, checkout, hasDone } = useDemoArticles(FIRST_ARTICLES);

  return (
    <Stack gap="md">
      <Stack gap="xs" role="list">
        <Presence>
          {articles.map((article) => (
            <PresenceItem key={article.id} role="listitem" layout>
              <ShoppingRow article={article} onUpdate={update} onRemove={remove} />
            </PresenceItem>
          ))}
        </Presence>
      </Stack>
      <Button variant="primary" onClick={checkout} disabled={!hasDone} fullWidth>
        Passer en caisse
      </Button>
    </Stack>
  );
}

function BulletShoppingList() {
  const { articles, update, checkout, hasDone } = useDemoArticles(FIRST_ARTICLES);

  return (
    <Stack gap="md">
      <Stack gap="xs" role="list">
        <Presence>
          {articles.map((article) => (
            <PresenceItem key={article.id} role="listitem" layout>
              <CheckListItem
                label={article.label}
                checked={article.done}
                onCheckedChange={(done) => update(article.id, { done })}
                marker="bullet"
                checkboxPlacement="end"
                checkboxSize="large"
              />
            </PresenceItem>
          ))}
        </Presence>
      </Stack>
      <Button variant="primary" onClick={checkout} disabled={!hasDone} fullWidth>
        Passer en caisse
      </Button>
    </Stack>
  );
}

const DRAWER_ARTICLES: DemoArticle[] = [
  { id: 1, label: "Riz basmati", done: false },
  { id: 2, label: "Huile d'olive", done: true },
  { id: 3, label: "Café moulu", done: false },
];

function Drawer() {
  const { articles, update } = useDemoArticles(DRAWER_ARTICLES);

  return (
    <Stack gap="xs" role="list">
      {articles.map((article) => (
        <Stack key={article.id} role="listitem">
          <CheckListItem
            label={article.label}
            muted={article.done}
            actions={
              <Button
                variant={article.done ? "primary" : "tonal"}
                size="small"
                onClick={() => update(article.id, { done: !article.done })}
              >
                {article.done ? "Remplir" : "Vider"}
              </Button>
            }
          />
        </Stack>
      ))}
    </Stack>
  );
}

const listCode = `<CheckListItem
  label={article.label}
  checked={article.done}
  onCheckedChange={(done) => update(article.id, { done })}
  editor={draft === null ? undefined : (
    <InlineInput value={draft} onChange={setDraft} onCommit={commit} onCancel={cancel} ariaLabel="Nouveau nom" />
  )}
  actions={
    <>
      <EditButton ariaLabel={\`Renommer \${article.label}\`} size="2.25rem" iconSize="sm" onClick={start} />
      <DeleteButton ariaLabel={\`Supprimer \${article.label}\`} size="2.25rem" iconSize="sm" onConfirm={remove} />
    </>
  }
/>`;

const bulletCode = `<CheckListItem
  label={article.label}
  checked={article.done}
  onCheckedChange={(done) => update(article.id, { done })}
  marker="bullet"
  checkboxPlacement="end"
  checkboxSize="large"
/>`;

const drawerCode = `<CheckListItem
  label={item.label}
  muted={item.empty}
  actions={
    <Button variant={item.empty ? "primary" : "tonal"} size="small" onClick={toggle}>
      {item.empty ? "Remplir" : "Vider"}
    </Button>
  }
/>`;

const fr = {
  intro:
    "Une ligne de liste à cocher : la case, un libellé qui se barre d'un trait tracé de gauche à droite quand la ligne est cochée, un état atténué pour ce qui est momentanément hors jeu, et une place pour les actions. Toute la largeur du libellé coche la ligne : au doigt, dans une allée de supermarché, la cible est la ligne entière.",
  sections: {
    liste: "Liste de courses",
    puces: "Liste à puces, case à droite",
    tiroir: "Sans case, atténuée",
    api: "API",
  },
  demos: {
    liste: {
      title: "Cocher, renommer, supprimer, passer en caisse",
      description:
        "Toucher le libellé coche l'article et le barre. Le crayon passe le libellé en édition en place via editor ; la case reste, son nom accessible aussi. « Passer en caisse » retire les articles cochés, qui sortent en glissant.",
    },
    puces: {
      title: "Une puce, le libellé, une grande case au bout",
      description:
        "La case passe à droite en grand (cible de 3rem) et seule elle coche : toucher le libellé ne fait rien, pour ne pas cocher par erreur en faisant défiler la liste. La puce rétrécit quand la ligne est barrée. Sans actions, la ligne se coche puis part avec « Passer en caisse ».",
    },
    tiroir: {
      title: "Vider, puis remplir",
      description:
        "Sans onCheckedChange, la ligne n'a pas de case. muted atténue le libellé, les actions gardent leur pleine opacité pour rester lisibles et atteignables.",
    },
  },
  props: {
    label: "Libellé de la ligne, et nom accessible de la case.",
    checked: "Coche la case et barre le libellé.",
    onCheckedChange:
      "Appelé avec le nouvel état. Sans lui, la ligne n'affiche pas de case à cocher.",
    muted: "Atténue la case et le libellé, pas les actions.",
    disabled: "Rend la case inerte.",
    editor:
      "Remplace le libellé visible, par exemple par un InlineInput pour renommer en place. Le libellé reste le nom accessible de la case.",
    actions: "Actions alignées à droite de la ligne : boutons d'icône, bouton texte.",
    marker: "Puce devant le libellé (bullet), qui rétrécit quand la ligne est cochée.",
    checkboxPlacement:
      "Case au début (le libellé coche aussi) ou au bout de la ligne (seule la case coche).",
    checkboxSize: "Taille de la case ; large porte la cible tactile à 3rem.",
  },
};

const en: typeof fr = {
  intro:
    "A checklist row: the checkbox, a label struck through by a line drawn left to right once the row is checked, a muted state for what is temporarily out of play, and a slot for actions. The whole label width toggles the row: thumb-first, in a supermarket aisle, the target is the full row.",
  sections: {
    liste: "Shopping list",
    puces: "Bulleted list, checkbox at the end",
    tiroir: "Without checkbox, muted",
    api: "API",
  },
  demos: {
    liste: {
      title: "Check, rename, delete, check out",
      description:
        "Tapping the label checks the item and strikes it. The pencil switches the label to in-place editing through editor; the checkbox stays, and so does its accessible name. “Check out” removes the checked items, which slide out.",
    },
    puces: {
      title: "A bullet, the label, a large checkbox at the end",
      description:
        "The checkbox moves to the end and grows (3rem target), and it alone toggles the row: tapping the label does nothing, so scrolling the list never checks an item by mistake. The bullet shrinks once the row is struck. Without actions, the row is checked, then leaves with “Check out”.",
    },
    tiroir: {
      title: "Empty, then refill",
      description:
        "Without onCheckedChange, the row has no checkbox. muted dims the label, while the actions keep full opacity to stay readable and reachable.",
    },
  },
  props: {
    label: "Row label, and accessible name of the checkbox.",
    checked: "Checks the box and strikes the label.",
    onCheckedChange: "Called with the new state. Without it, the row shows no checkbox.",
    muted: "Dims the checkbox and the label, not the actions.",
    disabled: "Makes the checkbox inert.",
    editor:
      "Replaces the visible label, for instance with an InlineInput to rename in place. The label stays the accessible name of the checkbox.",
    actions: "Actions aligned to the right of the row: icon buttons, text button.",
    marker: "Bullet before the label (bullet), shrinking once the row is checked.",
    checkboxPlacement:
      "Checkbox at the start (the label toggles too) or at the end of the row (only the checkbox toggles).",
    checkboxSize: "Checkbox size; large brings the touch target to 3rem.",
  },
};

const texts = { fr, en };

export default function CheckListItemDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    { name: "label", type: "string", required: true, description: t.props.label },
    { name: "checked", type: "boolean", defaultValue: "false", description: t.props.checked },
    {
      name: "onCheckedChange",
      type: "(checked: boolean) => void",
      description: t.props.onCheckedChange,
    },
    { name: "muted", type: "boolean", defaultValue: "false", description: t.props.muted },
    { name: "disabled", type: "boolean", defaultValue: "false", description: t.props.disabled },
    { name: "editor", type: "ReactNode", description: t.props.editor },
    { name: "actions", type: "ReactNode", description: t.props.actions },
    {
      name: "marker",
      type: '"none" | "bullet"',
      defaultValue: '"none"',
      description: t.props.marker,
    },
    {
      name: "checkboxPlacement",
      type: '"start" | "end"',
      defaultValue: '"start"',
      description: t.props.checkboxPlacement,
    },
    {
      name: "checkboxSize",
      type: '"medium" | "large"',
      defaultValue: '"medium"',
      description: t.props.checkboxSize,
    },
  ];

  return (
    <DocPage title="CheckListItem" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.liste}>
        <DemoCard
          title={t.demos.liste.title}
          description={t.demos.liste.description}
          code={listCode}
        >
          <ShoppingList />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.puces}>
        <DemoCard
          title={t.demos.puces.title}
          description={t.demos.puces.description}
          code={bulletCode}
        >
          <BulletShoppingList />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.tiroir}>
        <DemoCard
          title={t.demos.tiroir.title}
          description={t.demos.tiroir.description}
          code={drawerCode}
        >
          <Drawer />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
