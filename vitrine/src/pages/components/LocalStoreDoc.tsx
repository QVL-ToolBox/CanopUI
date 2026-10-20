import {
  Button,
  Stack,
  Text,
  createLocalStore,
  useLocalStore,
  usePersistentState,
} from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { createLocalStore, useLocalStore, usePersistentState } from "@canop/ui";`;

const storeCode = `const progression = createLocalStore({
  key: "jeu:progression",
  version: 2,
  initial: { vues: 0, reussies: 0 },
  migrate: (stored, version) =>
    version === 1 ? { ...(stored as Ancien), reussies: 0 } : null,
});

const [etat, setEtat] = useLocalStore(progression);`;

const stateCode = `const [volume, setVolume] = usePersistentState("demo:volume", 1);`;

interface Progression {
  vues: number;
  reussies: number;
}

const progression = createLocalStore<Progression>({
  key: "canopui-demo:progression",
  version: 1,
  initial: { vues: 0, reussies: 0 },
});

function Lecteur({ nom }: { nom: string }) {
  const [etat] = useLocalStore(progression);
  return (
    <Text variant="body-sm" tabularNums>
      {nom} — {etat.vues} / {etat.reussies}
    </Text>
  );
}

function Compteur({ labels }: { labels: { seen: string; ok: string; reset: string } }) {
  const [, setEtat] = useLocalStore(progression);

  return (
    <Stack gap="md" alignItems="start">
      <Stack gap="xs">
        <Lecteur nom="hud" />
        <Lecteur nom="recap" />
      </Stack>
      <Stack direction="row" gap="sm" wrap>
        <Button
          size="small"
          onClick={() => setEtat((current) => ({ ...current, vues: current.vues + 1 }))}
        >
          {labels.seen}
        </Button>
        <Button
          size="small"
          variant="secondary"
          onClick={() =>
            setEtat((current) => ({
              vues: current.vues + 1,
              reussies: current.reussies + 1,
            }))
          }
        >
          {labels.ok}
        </Button>
        <Button size="small" variant="danger" onClick={() => progression.reset()}>
          {labels.reset}
        </Button>
      </Stack>
    </Stack>
  );
}

function Reglage({ label }: { label: string }) {
  const [volume, setVolume] = usePersistentState("canopui-demo:volume", 1);

  return (
    <Stack direction="row" gap="sm" alignItems="center" wrap>
      <Text variant="body-sm" tabularNums>
        {label} : {Math.round(volume * 100)} %
      </Text>
      <Button size="small" onClick={() => setVolume((current) => Math.max(0, current - 0.1))}>
        −
      </Button>
      <Button size="small" onClick={() => setVolume((current) => Math.min(1, current + 0.1))}>
        +
      </Button>
    </Stack>
  );
}

const fr = {
  intro:
    "Un état local typé, versionné, et gardé en mémoire. C'est ce dernier point qui compte : une fonction de lecture qui reparse le stockage à chaque appel se paie au centuple dès qu'elle passe dans une boucle. Le magasin lit une fois à sa création, sert l'état depuis la mémoire, et écrit au travers.",
  sections: { store: "Un magasin", state: "Une seule valeur", api: "API" },
  demos: {
    storeTitle: "Deux lecteurs, une vérité — et ça survit au rechargement",
    storeDescription:
      "Les deux lignes lisent le même magasin : elles bougent ensemble, sans qu'aucun parent les fasse se remonter. Rechargez la page, l'état est toujours là. Ouvrez cette page dans un second onglet et cliquez : le premier onglet suit, parce que le magasin écoute l'événement de stockage — qui ne se déclenche justement que dans les autres onglets.",
    storeSeen: "Vue",
    storeOk: "Réussie",
    storeReset: "Effacer",
    stateTitle: "usePersistentState",
    stateDescription:
      "Le raccourci, pour une valeur seule et sans migration. Deux appels sur la même clé partagent un unique magasin : sans ce registre, ils tiendraient chacun leur copie et divergeraient au premier écrit.",
    stateLabel: "Volume retenu",
  },
  props: {
    key: "Clé de stockage.",
    version: "Version du schéma. Un changement déclenche la migration.",
    initial: "Valeur servie quand rien n'est stocké, ou quand la reprise renonce.",
    migrate:
      "Reprend une sauvegarde antérieure. Reçoit la charge et la version dont elle vient — 0 pour une sauvegarde écrite avant toute numérotation. Retourner null repart de l'initial, ce qui vaut mieux qu'un écran nourri de données dont la forme a changé.",
    storage: "Support de persistance, ou null pour ne rien retenir.",
    get: "L'état courant, servi depuis la mémoire sans relire le stockage.",
    set: "Écrit une valeur, ou l'applique depuis la précédente.",
    reset: "Revient à l'initial et efface la sauvegarde.",
    subscribe: "Prévient à chaque changement, y compris ceux venus d'un autre onglet.",
    dispose: "Détache l'écoute inter-onglets.",
  },
};

const en = {
  intro:
    "Typed, versioned local state, kept in memory. That last point is the one that matters: a read function that reparses storage on every call costs a hundredfold as soon as it runs in a loop. The store reads once at creation, serves state from memory, and writes through.",
  sections: { store: "A store", state: "A single value", api: "API" },
  demos: {
    storeTitle: "Two readers, one truth — and it survives a reload",
    storeDescription:
      "Both lines read the same store: they move together, with no parent making them re-render. Reload the page, the state is still there. Open this page in a second tab and click: the first tab follows, because the store listens to the storage event — which only fires in the other tabs.",
    storeSeen: "Seen",
    storeOk: "Correct",
    storeReset: "Clear",
    stateTitle: "usePersistentState",
    stateDescription:
      "The shorthand, for a lone value with no migration. Two calls on the same key share a single store: without that registry they would each hold their own copy and diverge on the first write.",
    stateLabel: "Remembered volume",
  },
  props: {
    key: "Storage key.",
    version: "Schema version. A change triggers migration.",
    initial: "Value served when nothing is stored, or when migration gives up.",
    migrate:
      "Takes over an earlier save. Receives the payload and the version it came from — 0 for a save written before any numbering. Returning null starts from the initial value, which beats a screen fed data whose shape has changed.",
    storage: "Persistence backend, or null to remember nothing.",
    get: "Current state, served from memory without rereading storage.",
    set: "Writes a value, or derives it from the previous one.",
    reset: "Returns to the initial value and clears the save.",
    subscribe: "Notifies on every change, including those from another tab.",
    dispose: "Detaches the cross-tab listener.",
  },
};

const texts = { fr, en };

export default function LocalStoreDoc() {
  const t = texts[useDocLocale()];

  const optionRows: PropRow[] = [
    { name: "key", type: "string", required: true, description: t.props.key },
    { name: "version", type: "number", defaultValue: "1", description: t.props.version },
    { name: "initial", type: "T", required: true, description: t.props.initial },
    {
      name: "migrate",
      type: "(stored: unknown, version: number) => T | null",
      defaultValue: "—",
      description: t.props.migrate,
    },
    {
      name: "storage",
      type: "Storage | null",
      defaultValue: "localStorage",
      description: t.props.storage,
    },
  ];

  const storeRows: PropRow[] = [
    { name: "get", type: "() => T", description: t.props.get },
    { name: "set", type: "(next: T | ((current: T) => T)) => T", description: t.props.set },
    { name: "reset", type: "() => T", description: t.props.reset },
    {
      name: "subscribe",
      type: "(listener: () => void) => () => void",
      description: t.props.subscribe,
    },
    { name: "dispose", type: "() => void", description: t.props.dispose },
  ];

  return (
    <DocPage title="Local store" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.store}>
        <DemoCard
          title={t.demos.storeTitle}
          description={t.demos.storeDescription}
          code={storeCode}
          align="start"
        >
          <Compteur
            labels={{
              seen: t.demos.storeSeen,
              ok: t.demos.storeOk,
              reset: t.demos.storeReset,
            }}
          />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.state}>
        <DemoCard
          title={t.demos.stateTitle}
          description={t.demos.stateDescription}
          code={stateCode}
          align="start"
        >
          <Reglage label={t.demos.stateLabel} />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.api}>
        <PropsTable title="CanopLocalStoreOptions" rows={optionRows} />
        <PropsTable title="CanopLocalStore" rows={storeRows} />
      </DocSection>
    </DocPage>
  );
}
