import { useState } from "react";
import { CheckListItem, Presence, PresenceItem, QuickAdd, Stack, Text } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { QuickAdd } from "@canop/ui";`;

interface AddedArticle {
  id: number;
  label: string;
}

function useAddedArticles() {
  const [articles, setArticles] = useState<AddedArticle[]>([]);
  const add = (label: string) => setArticles((list) => [{ id: Date.now(), label }, ...list]);
  return { articles, add };
}

function QuickAddDemo() {
  const { articles, add } = useAddedArticles();

  return (
    <Stack gap="md">
      <QuickAdd label="Ajouter un article" placeholder="Beurre, pain, lait…" onAdd={add} />
      <Stack gap="xs" role="list">
        <Presence>
          {articles.map((article) => (
            <PresenceItem key={article.id} role="listitem" layout>
              <CheckListItem label={article.label} />
            </PresenceItem>
          ))}
        </Presence>
      </Stack>
    </Stack>
  );
}

const demoCode = `const [articles, setArticles] = useState<string[]>([]);

<QuickAdd
  label="Ajouter un article"
  placeholder="Beurre, pain, lait…"
  onAdd={(label) => setArticles((list) => [label, ...list])}
/>`;

const QUOTA = 2;
const SERVER_DELAY_MS = 900;

function wait(duration: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, duration));
}

function useQuotaArticles(quotaMessage: string) {
  const [articles, setArticles] = useState<AddedArticle[]>([]);
  const [refusal, setRefusal] = useState<string | null>(null);

  const add = async (label: string) => {
    await wait(SERVER_DELAY_MS);
    if (articles.length >= QUOTA) {
      setRefusal(quotaMessage);
      throw new Error(quotaMessage);
    }
    setRefusal(null);
    setArticles((list) => [{ id: Date.now(), label }, ...list]);
  };

  return { articles, refusal, add };
}

function QuotaQuickAddDemo({ quotaMessage }: { quotaMessage: string }) {
  const { articles, refusal, add } = useQuotaArticles(quotaMessage);

  return (
    <Stack gap="md">
      <QuickAdd label="Ajouter un article" placeholder="Beurre, pain, lait…" onAdd={add} />
      {refusal ? (
        <Text variant="body-sm" tone="error">
          {refusal}
        </Text>
      ) : null}
      <Stack gap="xs" role="list">
        <Presence>
          {articles.map((article) => (
            <PresenceItem key={article.id} role="listitem" layout>
              <CheckListItem label={article.label} />
            </PresenceItem>
          ))}
        </Presence>
      </Stack>
    </Stack>
  );
}

const asyncDemoCode = `const createArticle = useCreateArticle();

<QuickAdd
  label="Ajouter un article"
  onAdd={(label) => createArticle(label)}
/>`;

const fr = {
  intro:
    "Le champ d'ajout rapide : on tape, on valide par Entrée ou par le bouton, l'entrée est remise sans les espaces de bord, le champ se vide et garde le focus, prêt pour la suivante. Au téléphone, toucher le bouton ne ferme pas le clavier. Une saisie vide n'ajoute rien et laisse le bouton inactif.",
  sections: { ajout: "Ajouter à la chaîne", echec: "Quand le serveur refuse", api: "API" },
  demos: {
    ajout: {
      title: "Entrée, et on enchaîne",
      description:
        "Tapez un article puis Entrée, plusieurs fois de suite : le curseur ne quitte jamais le champ. Les articles ajoutés entrent en tête de liste.",
    },
    echec: {
      title: "Un ajout asynchrone qui échoue",
      description:
        "onAdd renvoie une promesse : le bouton tourne pendant l'attente. Les deux premiers articles passent ; au troisième, le quota est atteint, la promesse est rejetée et la saisie reste dans le champ, prête à être corrigée ou renvoyée.",
      quota: "Quota atteint : deux articles au plus dans cette démo.",
    },
  },
  props: {
    label: "Libellé flottant du champ, et son nom accessible.",
    onAdd:
      "Appelé avec la saisie sans ses espaces de bord, jamais vide. Renvoyer false garde la saisie. Une promesse met le bouton en chargement : résolue, le champ se vide ; rejetée ou résolue à false, la saisie est conservée. Le focus reste dans le champ dans tous les cas.",
    placeholder: "Texte d'exemple affiché quand le champ est vide.",
    submitLabel: "Nom accessible du bouton d'ajout. Par défaut « Ajouter ».",
    disabled: "Rend le champ et le bouton inertes.",
    autoFocus: "Place le curseur dans le champ dès son apparition.",
    maxLength:
      "Nombre maximal de caractères de la saisie : au-delà, la frappe ou le collage est tronqué. Sans limite par défaut.",
  },
};

const en: typeof fr = {
  intro:
    "The quick-add field: type, confirm with Enter or the button, the entry is handed over trimmed, the field clears and keeps focus, ready for the next one. On a phone, tapping the button does not close the keyboard. An empty entry adds nothing and leaves the button inactive.",
  sections: { ajout: "Adding in a row", echec: "When the server refuses", api: "API" },
  demos: {
    ajout: {
      title: "Enter, and keep going",
      description:
        "Type an item then Enter, several times in a row: the caret never leaves the field. Added items enter at the top of the list.",
    },
    echec: {
      title: "An asynchronous add that fails",
      description:
        "onAdd returns a promise: the button spins while waiting. The first two items go through; on the third, the quota is reached, the promise rejects and the entry stays in the field, ready to be fixed or sent again.",
      quota: "Quota reached: two items at most in this demo.",
    },
  },
  props: {
    label: "Floating label of the field, and its accessible name.",
    onAdd:
      "Called with the trimmed entry, never empty. Returning false keeps the entry. A promise puts the button in a loading state: resolved, the field clears; rejected or resolved to false, the entry is kept. Focus stays in the field in every case.",
    placeholder: "Example text shown while the field is empty.",
    submitLabel: "Accessible name of the add button. Defaults to “Add”.",
    disabled: "Makes the field and the button inert.",
    autoFocus: "Places the caret in the field as soon as it appears.",
    maxLength:
      "Maximum number of characters in the entry: beyond it, typing or pasting is truncated. Unlimited by default.",
  },
};

const texts = { fr, en };

export default function QuickAddDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    { name: "label", type: "string", required: true, description: t.props.label },
    {
      name: "onAdd",
      type: "(value: string) => void | boolean | Promise<void | boolean>",
      required: true,
      description: t.props.onAdd,
    },
    { name: "placeholder", type: "string", description: t.props.placeholder },
    { name: "submitLabel", type: "string", description: t.props.submitLabel },
    { name: "disabled", type: "boolean", defaultValue: "false", description: t.props.disabled },
    { name: "autoFocus", type: "boolean", defaultValue: "false", description: t.props.autoFocus },
    { name: "maxLength", type: "number", description: t.props.maxLength },
  ];

  return (
    <DocPage title="QuickAdd" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.ajout}>
        <DemoCard
          title={t.demos.ajout.title}
          description={t.demos.ajout.description}
          code={demoCode}
        >
          <QuickAddDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.echec}>
        <DemoCard
          title={t.demos.echec.title}
          description={t.demos.echec.description}
          code={asyncDemoCode}
        >
          <QuotaQuickAddDemo quotaMessage={t.demos.echec.quota} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
