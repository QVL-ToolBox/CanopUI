import {
  Button,
  Icon,
  Stack,
  StatusChip,
  Text,
  useCopyToClipboard,
  useTransientState,
} from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { useCopyToClipboard, useTransientState } from "@canop/ui";`;

const copyCode = `const { copied, failed, copy } = useCopyToClipboard(texte);

<Button onClick={() => copy()}>{copied ? "Copié !" : "Copier"}</Button>`;

const transientCode = `const { value, show } = useTransientState<"ok" | "ko" | null>(null, { duration: 1200 });

show("ok");        // s'effacera après 1200 ms
show("ko", 3000);  // sauf si l'appel en décide autrement`;

const TEXTE = "@canop/ui —le presse-papier passe par la librairie";

function Copie({ labels }: { labels: { copy: string; copied: string; failed: string } }) {
  const { copied, failed, copy, outcome } = useCopyToClipboard(TEXTE, { duration: 1600 });

  return (
    <Stack gap="md" alignItems="start">
      <Text variant="code">{TEXTE}</Text>
      <Stack direction="row" gap="sm" alignItems="center">
        <Button
          variant={failed ? "secondary" : "primary"}
          size="small"
          onClick={() => copy()}
          startIcon={<Icon name={copied ? "check" : "clipboard"} size="sm" />}
        >
          {copied ? labels.copied : failed ? labels.failed : labels.copy}
        </Button>
        <StatusChip
          tone={outcome === "copied" ? "success" : outcome === "failed" ? "error" : "neutral"}
          label={outcome}
        />
      </Stack>
    </Stack>
  );
}

function Fugace({ labels }: { labels: { short: string; long: string; resting: string } }) {
  const { value, show, clear } = useTransientState<string | null>(null, { duration: 1200 });

  return (
    <Stack gap="md" alignItems="start">
      <StatusChip tone={value ? "info" : "neutral"} label={value ?? labels.resting} />
      <Stack direction="row" gap="sm">
        <Button size="small" onClick={() => show("1200 ms")}>
          {labels.short}
        </Button>
        <Button size="small" variant="secondary" onClick={() => show("3000 ms", 3000)}>
          {labels.long}
        </Button>
        <Button size="small" variant="danger" onClick={clear}>
          clear
        </Button>
      </Stack>
    </Stack>
  );
}

const fr = {
  intro:
    "Copier un texte, et le dire. Deux hooks : celui du presse-papier, et la valeur fugace sur laquelle il repose — un état qui revient de lui-même à son repos, ce qu'on écrit d'ordinaire à la main avec un setTimeout nu.",
  sections: { copy: "Le presse-papier", transient: "La valeur fugace", api: "API" },
  demos: {
    copyTitle: "Copiez, et regardez ce qui est retourné",
    copyDescription:
      "L'échec est exposé, pas avalé. La copie échoue pour des raisons ordinaires : origine non sécurisée où l'API n'existe simplement pas, document qui n'a pas le focus, permission refusée. Un bouton qui ne dit rien laisse alors croire que le texte est parti — et sans second gestionnaire sur la promesse, c'est en plus un rejet non traité dans la console. Cette page en profitait déjà sans le savoir : la vitrine avait sa propre copie de ce hook, sans gestion de l'échec, et c'est maintenant celui de la librairie qui sert ses boutons « Copier ».",
    copyCopy: "Copier",
    copyCopied: "Copié !",
    copyFailed: "Copie impossible",
    transientTitle: "Deux durées, une seule minuterie",
    transientDescription:
      "Cliquez le bouton court puis, avant la fin, le bouton long : la minuterie précédente est remplacée et non empilée. Sans ça la première remettrait au repos pendant que la seconde est censée être visible. La durée peut être donnée à l'appel, ce qui permet au même éclair de durer moins longtemps sur une réussite que sur une erreur.",
    transientShort: "Court",
    transientLong: "Long",
    transientResting: "au repos",
  },
  props: {
    text: "Texte copié par défaut. Peut être remplacé à l'appel de copy.",
    duration: "Durée de la confirmation, en millisecondes.",
    copied: "Vrai le temps de la confirmation.",
    failed: "Vrai quand le presse-papier a refusé, ou n'existe pas.",
    outcome: "idle, copied ou failed — l'issue brute, pour un affichage sur mesure.",
    copy: "Copie le texte donné à l'appel, sinon celui passé au hook.",
    resting: "Valeur de repos, celle vers laquelle on revient toujours.",
    show: "Pose une valeur, qui s'effacera d'elle-même. La durée peut être donnée ici.",
    clear: "Ramène au repos immédiatement.",
    value: "Valeur courante.",
  },
};

const en = {
  intro:
    "Copy a text, and say so. Two hooks: the clipboard one, and the transient value it rests on — a state that returns to rest on its own, which is normally hand-written with a bare setTimeout.",
  sections: { copy: "The clipboard", transient: "Transient value", api: "API" },
  demos: {
    copyTitle: "Copy, and watch what comes back",
    copyDescription:
      'Failure is exposed, not swallowed. Copying fails for ordinary reasons: an insecure origin where the API simply does not exist, an unfocused document, a denied permission. A silent button then lets you believe the text went through — and with no second handler on the promise, it is also an unhandled rejection in the console. This very page already benefited without knowing: the showcase had its own copy of this hook with no failure handling, and it is now the library\'s that powers its "Copy" buttons.',
    copyCopy: "Copy",
    copyCopied: "Copied!",
    copyFailed: "Copy failed",
    transientTitle: "Two durations, a single timer",
    transientDescription:
      "Click the short button then, before it ends, the long one: the pending timer is replaced, not stacked. Otherwise the first would return to rest while the second was meant to be visible. The duration can be given at call time, which lets the same flash last shorter on a success than on an error.",
    transientShort: "Short",
    transientLong: "Long",
    transientResting: "at rest",
  },
  props: {
    text: "Text copied by default. Can be overridden when calling copy.",
    duration: "Confirmation duration, in milliseconds.",
    copied: "True for the duration of the confirmation.",
    failed: "True when the clipboard refused, or does not exist.",
    outcome: "idle, copied or failed — the raw outcome, for a custom display.",
    copy: "Copies the text given at call time, otherwise the one passed to the hook.",
    resting: "Resting value, the one always returned to.",
    show: "Sets a value that will clear itself. The duration can be given here.",
    clear: "Returns to rest immediately.",
    value: "Current value.",
  },
};

const texts = { fr, en };

export default function ClipboardDoc() {
  const t = texts[useDocLocale()];

  const copyRows: PropRow[] = [
    { name: "text", type: "string", defaultValue: "—", description: t.props.text },
    {
      name: "options.duration",
      type: "number",
      defaultValue: "1600",
      description: t.props.duration,
    },
    { name: "copied", type: "boolean", description: t.props.copied },
    { name: "failed", type: "boolean", description: t.props.failed },
    { name: "outcome", type: '"idle" | "copied" | "failed"', description: t.props.outcome },
    { name: "copy", type: "(text?: string) => void", description: t.props.copy },
  ];

  const transientRows: PropRow[] = [
    { name: "resting", type: "T", required: true, description: t.props.resting },
    {
      name: "options.duration",
      type: "number",
      defaultValue: "1600",
      description: t.props.duration,
    },
    { name: "value", type: "T", description: t.props.value },
    { name: "show", type: "(value: T, duration?: number) => void", description: t.props.show },
    { name: "clear", type: "() => void", description: t.props.clear },
  ];

  return (
    <DocPage title="Clipboard" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.copy}>
        <DemoCard
          title={t.demos.copyTitle}
          description={t.demos.copyDescription}
          code={copyCode}
          align="start"
        >
          <Copie
            labels={{
              copy: t.demos.copyCopy,
              copied: t.demos.copyCopied,
              failed: t.demos.copyFailed,
            }}
          />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.transient}>
        <DemoCard
          title={t.demos.transientTitle}
          description={t.demos.transientDescription}
          code={transientCode}
          align="start"
        >
          <Fugace
            labels={{
              short: t.demos.transientShort,
              long: t.demos.transientLong,
              resting: t.demos.transientResting,
            }}
          />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.api}>
        <PropsTable title="useCopyToClipboard()" rows={copyRows} />
        <PropsTable title="useTransientState()" rows={transientRows} />
      </DocSection>
    </DocPage>
  );
}
