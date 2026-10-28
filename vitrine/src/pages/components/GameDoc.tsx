import { useState } from "react";
import {
  Button,
  Card,
  Choice,
  Countdown,
  Lives,
  ShareResult,
  Stack,
  Streak,
  Text,
  useTransientState,
  type CanopCardFlash,
  type CanopChoiceState,
  type CanopShareTone,
} from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Lives, Streak, Countdown, ShareResult } from "@canop/ui";`;

const livesCode = `<Lives value={3} max={10} />`;

const streakCode = `<Streak value={6} multiplier={3} />`;

const flashCode = `const { value: flash, show } = useTransientState<CanopCardFlash | undefined>(undefined, {
  // L'éclair fini, on enchaîne : plus besoin d'un setTimeout jumeau à côté.
  onSettle: () => setQuestion(suivante),
});

<Card flash={flash}>{question}</Card>

// Une réussite s'efface vite, une erreur laisse le temps de lire la réponse.
show("success", 350);
show("error", 1100);`;

const choiceCode = `<Choice
  state={verdict ? (option === bonne ? "correct" : option === choisie ? "incorrect" : "neutral") : "neutral"}
  disabled={Boolean(verdict)}
  onClick={() => repondre(option)}
>
  {option}
</Choice>`;

const countdownCode = `// La key remonte le composant : c'est ainsi qu'on repart sur une durée identique.
<Countdown
  key={question.id}
  duration={20_000}
  urgentBelow={10}
  onEnd={() => trancher(null)}
/>`;

const shareCode = `<ShareResult
  rows={[["miss", "near"], ["near", "near"], ["hit", "hit"]]}
  text={\`DéparteMental \${date} — \${essais}/6\\n\${grille}\`}
/>`;

const GRILLE: CanopShareTone[][] = [
  ["miss", "near"],
  ["near", "near"],
  ["near", "miss"],
  ["hit", "hit"],
];

const TEXTE_PARTAGE = "DéparteMental 2026-09-07 — 4/6\n⬛🟨\n🟨🟨\n🟨⬛\n🟩🟩";

function Vies({ labels }: { labels: { lose: string; refill: string } }) {
  const [restantes, setRestantes] = useState(10);

  return (
    <Stack gap="md" alignItems="start">
      <Lives value={restantes} max={10} />
      <Stack direction="row" gap="sm" wrap>
        <Button size="small" onClick={() => setRestantes((value) => Math.max(0, value - 1))}>
          {labels.lose}
        </Button>
        <Button size="small" variant="secondary" onClick={() => setRestantes(10)}>
          {labels.refill}
        </Button>
      </Stack>
    </Stack>
  );
}

function Serie({ labels }: { labels: { good: string; miss: string } }) {
  const [serie, setSerie] = useState(0);
  const multiplicateur = 1 + Math.floor(serie / 3);

  return (
    <Stack gap="md" alignItems="start">
      <Streak value={serie} multiplier={multiplicateur} />
      <Stack direction="row" gap="sm" wrap>
        <Button size="small" onClick={() => setSerie((value) => value + 1)}>
          {labels.good}
        </Button>
        <Button size="small" variant="secondary" onClick={() => setSerie(0)}>
          {labels.miss}
        </Button>
      </Stack>
    </Stack>
  );
}

const REPONSES = ["Finistère", "Morbihan", "Côtes-d'Armor", "Ille-et-Vilaine"];
const BONNE = "Finistère";

function Questionnaire({ labels }: { labels: { prompt: string; again: string } }) {
  const [choisie, setChoisie] = useState<string | null>(null);

  function etatDe(option: string): CanopChoiceState {
    if (!choisie) return "neutral";
    if (option === BONNE) return "correct";
    if (option === choisie) return "incorrect";
    return "neutral";
  }

  return (
    <Stack gap="md" alignItems="stretch">
      <Text variant="body-md">{labels.prompt}</Text>
      <Stack gap="sm" alignItems="stretch">
        {REPONSES.map((option) => (
          <Choice
            key={option}
            state={etatDe(option)}
            disabled={choisie !== null}
            onClick={() => setChoisie(option)}
          >
            <Text variant="body-md">{option}</Text>
          </Choice>
        ))}
      </Stack>
      {choisie && (
        <Stack direction="row" gap="sm">
          <Button size="small" variant="secondary" onClick={() => setChoisie(null)}>
            {labels.again}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}

function Chrono({ labels }: { labels: { restart: string; over: string } }) {
  const [manche, setManche] = useState(0);
  const [ecoule, setEcoule] = useState(false);

  function relancer() {
    setManche((value) => value + 1);
    setEcoule(false);
  }

  return (
    <Stack gap="md" alignItems="stretch">
      <Countdown key={manche} duration={20_000} urgentBelow={10} onEnd={() => setEcoule(true)} />
      <Stack direction="row" gap="sm" alignItems="center" wrap>
        <Button size="small" variant="secondary" onClick={relancer}>
          {labels.restart}
        </Button>
        {ecoule && (
          <Text variant="body-sm" tone="error">
            {labels.over}
          </Text>
        )}
      </Stack>
    </Stack>
  );
}

function Eclair({ labels }: { labels: { good: string; bad: string; prompt: string } }) {
  const { value: flash, show } = useTransientState<CanopCardFlash | undefined>(undefined);

  return (
    <Stack gap="md" alignItems="stretch">
      <Card flash={flash}>
        <Text variant="body-md">{labels.prompt}</Text>
      </Card>
      <Stack direction="row" gap="sm" wrap>
        <Button size="small" onClick={() => show("success", 350)}>
          {labels.good}
        </Button>
        <Button size="small" variant="danger" onClick={() => show("error", 1100)}>
          {labels.bad}
        </Button>
      </Stack>
    </Stack>
  );
}

const fr = {
  intro:
    "Les pièces d'une partie : les vies, la série avec son multiplicateur, les réponses, le chrono, l'éclair de retour immédiat sur une carte, et la grille de résultat partageable. Ce sont les premiers composants de la librairie qui ne servent aucun portail — ils servent les jeux.",
  sections: {
    lives: "Les vies",
    streak: "La série",
    choice: "Les réponses",
    countdown: "Le chrono",
    flash: "L'éclair",
    share: "Le partage",
    api: "API",
  },
  demos: {
    livesTitle: "Perdez-en une",
    livesDescription:
      "Le dessin est décoratif, le texte ne l'est pas : le compte est annoncé en toutes lettres aux lecteurs d'écran, parce qu'une rangée de cœurs ne dit rien à qui ne la voit pas. Les icônes sont donc masquées de l'arbre d'accessibilité, et c'est le conteneur qui porte l'information.",
    livesLose: "Perdre une vie",
    livesRefill: "Refaire le plein",
    streakTitle: "Enchaînez trois bonnes réponses",
    streakDescription:
      "Le multiplicateur monte d'un cran tous les trois. L'état chaud se déduit du multiplicateur au lieu d'être passé à côté : deux sources pour la même vérité finissent par se contredire, et c'est l'affichage qui mentirait.",
    streakGood: "Bonne réponse",
    streakMiss: "Ratée",
    choiceTitle: "Répondez, juste ou faux",
    choiceDescription:
      "L'interaction la plus fréquente d'un questionnaire, et celle que chaque application redessinait à coups de classes CSS. Pressable apporte déjà la forme, l'anneau de focus et le clavier, mais n'a pas d'état juste ou faux. Deux points à noter : l'état correct désigne **la** bonne réponse et non celle qu'on a cliquée — sans cette distinction, une erreur ne pourrait pas révéler ce qu'il fallait répondre. Et l'état n'est pas porté par la seule couleur : une marque cochée ou barrée apparaît, et elle est nommée, donc un daltonien ou quelqu'un qui écoute la page sait aussi ce qui vient d'être répondu. Le fond reste à 8 % de la teinte, la limite mesurée au-delà de laquelle le texte du thème perd son contraste — c'est la marque qui porte le signal, pas l'aplat.",
    choicePrompt: "Quel département porte le numéro 29 ?",
    choiceAgain: "Recommencer",
    countdownTitle: "Laissez filer les dix dernières secondes",
    countdownDescription:
      "L'horloge est celle de useCountdown : recalculée depuis une échéance absolue, elle ne dérive pas et survit à un onglet mis en arrière-plan. Sous le seuil, le temps bat — deux poussées puis un repos, sur une seconde — et emmène la couleur et la barre avec lui. Le battement disparaît en mouvement réduit, mais le rouge, l'icône pleine et la barre restent : l'urgence n'est jamais portée par la seule animation. Le format se décide sur la durée totale et non sur le temps restant, sans quoi un chrono de deux minutes passerait de 1:00 à 59 en cours de route, ce qui se lit comme un défaut d'affichage. Et ce qu'un lecteur d'écran entend est le vrai sujet : le dessin est masqué de l'arbre d'accessibilité et une seule annonce est faite, au passage du seuil — un aria-live sur un décompte rafraîchi dix fois par seconde couvrirait toute la page.",
    countdownRestart: "Relancer",
    countdownOver: "Temps écoulé",
    flashTitle: "Un anneau, deux durées, et un tremblement",
    flashDescription:
      "L'éclair est un anneau et non une ombre : la forme étant découpée en squircle, une ombre débordante serait rognée — un garde-fou de la librairie refuse d'ailleurs cette combinaison. Et ce n'est pas un fond teinté : au-delà de 8 % de teinte, le texte du thème perd son contraste, alors qu'un anneau ne passe pas sous le texte. La durée se donne à l'appel, donc la réussite s'efface vite quand l'erreur laisse le temps de lire la bonne réponse. L'erreur tremble en plus, sur 0,35 s — un décor, pas une information, donc il disparaît en mouvement réduit où l'anneau suffit. Et il ne se déclenche que sur flash, jamais sur tone : tone décrit un état qui dure, flash un événement qui vient de se produire. L'option onSettle de useTransientState dit quand la valeur est revenue d'elle-même au repos : sans elle, enchaîner sur la question suivante demandait un second setTimeout de la même durée posé à côté — deux minuteries pour un seul moment, qui divergent dès que la durée est donnée à l'appel. clear() ne la déclenche pas : ce retour-là est demandé, l'appelant en est déjà l'auteur.",
    flashGood: "Bonne réponse",
    flashBad: "Mauvaise réponse",
    flashPrompt: "Quel département porte le numéro 29 ?",
    shareTitle: "La grille, et ce qui part au presse-papier",
    shareDescription:
      "Les cases sont dessinées, alors que le presse-papier reçoit le texte fourni par le jeu — la librairie ne l'invente pas : ce qui se partage lui appartient. Une grille d'émojis se lit mal à l'écran et dépend des polices du système, mais c'est la seule forme qui survive à un collage dans une conversation. Si la copie échoue — origine non sécurisée, document sans le focus, permission refusée — le bouton le dit et explique comment s'en sortir, au lieu de laisser croire que le texte est parti.",
  },
  props: {
    livesSize: "Taille des cœurs.",
    livesAnimated:
      "Fond la couleur et fait battre le cœur qui s'éteint. Perdre une vie est l'évènement le plus marquant d'une partie : sans transition, il se réduit à un tracé qui change d'un rendu à l'autre et passe inaperçu quand le regard est ailleurs. Rien ne bat au premier affichage, ni quand on refait le plein.",
    livesAriaLabel:
      "Nom accessible explicite. Prend le pas sur le libellé traduit, qui annonce le compte en toutes lettres.",
    streakAriaLabel: "Nom accessible explicite. Prend le pas sur le libellé traduit.",
    shareCopyLabel: "Libellé du bouton de copie.",
    shareCopiedLabel: "Libellé affiché le temps que la copie soit vue.",
    shareFailedLabel:
      "Libellé affiché quand le presse-papier refuse la copie — un navigateur sans permission, une page servie sans HTTPS.",
    shareAriaLabel: "Nom accessible de la grille de résultat.",
    choiceChildren: "La réponse proposée, rendue telle quelle.",
    choiceOnClick: "Action au clic, à la touche Entrée et à la barre d'espace.",
    choiceFullWidth: "Étire la réponse sur toute la largeur disponible.",
    choicePadding: "Rembourrage intérieur, pris dans l'échelle d'espacement.",
    choiceAriaLabel: "Nom accessible explicite, si le contenu ne suffit pas.",
    livesValue: "Vies restantes. Bornée entre 0 et max.",
    livesMax:
      "Vies au départ, donc nombre de cases dessinées. Au-delà de la largeur disponible, les cœurs passent à la ligne.",
    icon: "Icône du registre. heart par défaut pour les vies, fire pour la série.",
    streakValue: "Longueur de la série en cours.",
    multiplier: "Multiplicateur atteint. Au-delà de 1, la série est dite chaude et se colore.",
    choiceState:
      "correct désigne la bonne réponse, choisie ou non, ce qui permet de la révéler ; incorrect désigne celle qui a été choisie à tort.",
    choiceDisabled: "Ferme la réponse une fois la question tranchée.",
    countdownDuration: "Durée totale, en millisecondes.",
    countdownRunning:
      "Fait courir l'horloge. À false, le temps restant est gelé à l'instant exact.",
    countdownUrgentBelow:
      "Seuil d'urgence, en secondes restantes. En dessous, le temps bat et passe au rouge. 0 désactive le battement.",
    countdownShowProgress: "Retire la barre pour ne garder que le temps.",
    countdownFormat:
      "La forme du temps affiché : clock pour 1:00, seconds pour 60. En auto, c'est la durée totale qui tranche, au-delà d'une minute — et jamais le temps restant, sans quoi un chrono de deux minutes passerait de 1:00 à 59 en cours de route, ce qui se lit comme un défaut d'affichage. Reste qu'un seuil est un bord : une durée d'exactement une minute tombe du côté horloge et affiche 1:00 puis 0:45, là où l'écran de règles a promis « 60 secondes ». Le préfixe 0: n'y dit alors rien, puisque ce chrono ne repassera jamais au-dessus de la minute.",
    flash: "success ou error, le temps d'être vu. À piloter avec useTransientState.",
    rows: "Une ligne par essai, une case par indice : hit, near ou miss.",
    text: "Le texte exact envoyé au presse-papier. La librairie ne le fabrique pas.",
    cellSize: "Côté d'une case, en unités CSS relatives.",
  },
};

const en = {
  intro:
    "The pieces of a round: lives, the streak and its multiplier, the answers, the timer, the instant-feedback flash on a card, and the shareable result grid. These are the library's first components that serve no portal — they serve games.",
  sections: {
    lives: "Lives",
    streak: "Streak",
    choice: "Answers",
    countdown: "The timer",
    flash: "The flash",
    share: "Sharing",
    api: "API",
  },
  demos: {
    livesTitle: "Lose one",
    livesDescription:
      "The drawing is decorative, the text is not: the count is announced in words to screen readers, because a row of hearts says nothing to someone who cannot see it. The icons are hidden from the accessibility tree, and the container carries the information.",
    livesLose: "Lose a life",
    livesRefill: "Refill",
    streakTitle: "Chain three right answers",
    streakDescription:
      "The multiplier rises every three. The hot state is derived from the multiplier rather than passed alongside it: two sources for the same truth end up contradicting each other, and it is the display that would lie.",
    streakGood: "Right answer",
    streakMiss: "Missed",
    choiceTitle: "Answer, right or wrong",
    choiceDescription:
      "The most frequent interaction of any quiz, and the one every application redrew with CSS classes. Pressable already brings the shape, the focus ring and the keyboard, but has no right-or-wrong state. Two things to note: the correct state marks **the** right answer rather than the one clicked — without that distinction, a mistake could not reveal what should have been answered. And the state is not carried by colour alone: a ticked or crossed mark appears, and it is named, so someone colour-blind or listening to the page also knows what was just answered. The background stays at 8% tint, the measured ceiling beyond which the theme's text loses its contrast — the mark carries the signal, not the wash.",
    choicePrompt: "Which department is number 29?",
    choiceAgain: "Start over",
    countdownTitle: "Let the last ten seconds run",
    countdownDescription:
      "The clock is useCountdown's: recomputed from an absolute deadline, it never drifts and survives a backgrounded tab. Below the threshold the time beats — two pushes then a rest, over one second — and takes the colour and the bar with it. The beat disappears under reduced motion, but the red, the solid icon and the bar remain: urgency is never carried by animation alone. The format is decided on the total duration rather than on the time left, otherwise a two-minute timer would go from 1:00 to 59 mid-run, which reads as a display glitch. And what a screen reader hears is the real subject: the drawing is hidden from the accessibility tree and a single announcement is made, when the threshold is crossed — an aria-live on a countdown refreshed ten times a second would drown out the whole page.",
    countdownRestart: "Restart",
    countdownOver: "Time up",
    flashTitle: "One ring, two durations, and a shake",
    flashDescription:
      "The flash is a ring, not a shadow: the shape being clipped to a squircle, an outward shadow would be cropped — a library guard actually refuses that combination. Nor is it a tinted background: beyond 8% tint the theme's text loses its contrast, whereas a ring never sits under the text. The duration is given at call time, so a success fades fast while an error leaves time to read the right answer. An error also shakes, over 0.35s — decoration, not information, so it disappears under reduced motion where the ring suffices. And it only fires on flash, never on tone: tone describes a lasting state, flash an event that just happened. The onSettle option of useTransientState tells when the value has returned to rest on its own: without it, moving on to the next question required a second setTimeout of the same duration alongside — two timers for a single moment, diverging as soon as the duration is given at call time. clear() does not fire it: that return is asked for, and the caller already authored it.",
    flashGood: "Right answer",
    flashBad: "Wrong answer",
    flashPrompt: "Which department is number 29?",
    shareTitle: "The grid, and what reaches the clipboard",
    shareDescription:
      "The cells are drawn, while the clipboard receives the text the game supplies — the library does not invent it: what gets shared belongs to the game. An emoji grid reads poorly on screen and depends on system fonts, but it is the only form that survives a paste into a conversation. If the copy fails — insecure origin, unfocused document, denied permission — the button says so and explains the way out, instead of letting you believe the text went through.",
  },
  props: {
    livesSize: "Size of the hearts.",
    livesAnimated:
      "Fades the colour and beats the heart that just went out. Losing a life is the most striking moment of a game: without a transition it comes down to a path changing from one render to the next, and goes unnoticed when the eye is elsewhere. Nothing beats on first paint, nor when lives are refilled.",
    livesAriaLabel:
      "Explicit accessible name. Takes precedence over the translated label, which spells the count out.",
    streakAriaLabel: "Explicit accessible name. Takes precedence over the translated label.",
    shareCopyLabel: "Label of the copy button.",
    shareCopiedLabel: "Label shown long enough for the copy to be noticed.",
    shareFailedLabel:
      "Label shown when the clipboard refuses the copy — a browser without permission, a page served without HTTPS.",
    shareAriaLabel: "Accessible name of the result grid.",
    choiceChildren: "The offered answer, rendered as is.",
    choiceOnClick: "Action on click, on Enter and on Space.",
    choiceFullWidth: "Stretches the answer across the available width.",
    choicePadding: "Inner padding, taken from the spacing scale.",
    choiceAriaLabel: "Explicit accessible name, when the content is not enough.",
    livesValue: "Remaining lives. Clamped between 0 and max.",
    livesMax:
      "Starting lives, therefore the number of cells drawn. Beyond the available width, the hearts wrap.",
    icon: "Registry icon. heart by default for lives, fire for the streak.",
    streakValue: "Length of the current streak.",
    multiplier: "Multiplier reached. Above 1 the streak is hot and takes colour.",
    choiceState:
      "correct marks the right answer, chosen or not, which is what reveals it; incorrect marks the one chosen by mistake.",
    choiceDisabled: "Closes the answer once the question is settled.",
    countdownDuration: "Total duration, in milliseconds.",
    countdownRunning: "Runs the clock. At false, the time left freezes at the exact instant.",
    countdownUrgentBelow:
      "Urgency threshold, in seconds left. Below it the time beats and turns red. 0 disables the beat.",
    countdownShowProgress: "Drops the bar to keep the time alone.",
    countdownFormat:
      "The shape of the displayed time: clock for 1:00, seconds for 60. In auto, the total duration decides, beyond one minute — never the remaining time, otherwise a two-minute clock would go from 1:00 to 59 mid-run, which reads as a rendering defect. Still, a threshold is an edge: a duration of exactly one minute falls on the clock side and shows 1:00 then 0:45, where the rules screen promised “60 seconds”. The 0: prefix then says nothing, since that clock will never rise above the minute again.",
    flash: "success or error, long enough to be seen. Drive it with useTransientState.",
    rows: "One row per guess, one cell per clue: hit, near or miss.",
    text: "The exact text sent to the clipboard. The library does not build it.",
    cellSize: "Side of a cell, in relative CSS units.",
  },
};

const texts = { fr, en };

export default function GameDoc() {
  const t = texts[useDocLocale()];

  const livesRows: PropRow[] = [
    { name: "value", type: "number", required: true, description: t.props.livesValue },
    { name: "max", type: "number", required: true, description: t.props.livesMax },
    { name: "icon", type: "CanopIconName", defaultValue: '"heart"', description: t.props.icon },
    { name: "size", type: "CanopIconSize", defaultValue: '"sm"', description: t.props.livesSize },
    { name: "animated", type: "boolean", defaultValue: "true", description: t.props.livesAnimated },
    { name: "ariaLabel", type: "string", description: t.props.livesAriaLabel },
  ];

  const streakRows: PropRow[] = [
    { name: "value", type: "number", required: true, description: t.props.streakValue },
    { name: "multiplier", type: "number", defaultValue: "1", description: t.props.multiplier },
    { name: "icon", type: "CanopIconName", defaultValue: '"fire"', description: t.props.icon },
    { name: "ariaLabel", type: "string", description: t.props.streakAriaLabel },
  ];

  const shareRows: PropRow[] = [
    {
      name: "rows",
      type: 'readonly ("hit" | "near" | "miss")[][]',
      required: true,
      description: t.props.rows,
    },
    { name: "text", type: "string", required: true, description: t.props.text },
    { name: "cellSize", type: "string", defaultValue: '"1.25rem"', description: t.props.cellSize },
    { name: "copyLabel", type: "string", description: t.props.shareCopyLabel },
    { name: "copiedLabel", type: "string", description: t.props.shareCopiedLabel },
    { name: "failedLabel", type: "string", description: t.props.shareFailedLabel },
    { name: "ariaLabel", type: "string", description: t.props.shareAriaLabel },
  ];

  const choiceRows: PropRow[] = [
    {
      name: "state",
      type: '"neutral" | "correct" | "incorrect"',
      defaultValue: '"neutral"',
      description: t.props.choiceState,
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: t.props.choiceDisabled,
    },
    { name: "children", type: "ReactNode", required: true, description: t.props.choiceChildren },
    { name: "onClick", type: "() => void", description: t.props.choiceOnClick },
    {
      name: "fullWidth",
      type: "boolean",
      defaultValue: "true",
      description: t.props.choiceFullWidth,
    },
    {
      name: "padding",
      type: "CanopPressableSpacing",
      defaultValue: '"md"',
      description: t.props.choicePadding,
    },
    { name: "ariaLabel", type: "string", description: t.props.choiceAriaLabel },
  ];

  const countdownRows: PropRow[] = [
    { name: "duration", type: "number", required: true, description: t.props.countdownDuration },
    {
      name: "running",
      type: "boolean",
      defaultValue: "true",
      description: t.props.countdownRunning,
    },
    {
      name: "urgentBelow",
      type: "number",
      defaultValue: "10",
      description: t.props.countdownUrgentBelow,
    },
    {
      name: "format",
      type: '"auto" | "clock" | "seconds"',
      defaultValue: '"auto"',
      description: t.props.countdownFormat,
    },
    {
      name: "showProgress",
      type: "boolean",
      defaultValue: "true",
      description: t.props.countdownShowProgress,
    },
  ];

  const cardRows: PropRow[] = [
    {
      name: "flash",
      type: '"success" | "error"',
      defaultValue: "—",
      description: t.props.flash,
    },
  ];

  return (
    <DocPage title="Game" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.lives}>
        <DemoCard
          title={t.demos.livesTitle}
          description={t.demos.livesDescription}
          code={livesCode}
          align="start"
        >
          <Vies labels={{ lose: t.demos.livesLose, refill: t.demos.livesRefill }} />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.streak}>
        <DemoCard
          title={t.demos.streakTitle}
          description={t.demos.streakDescription}
          code={streakCode}
          align="start"
        >
          <Serie labels={{ good: t.demos.streakGood, miss: t.demos.streakMiss }} />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.choice}>
        <DemoCard
          title={t.demos.choiceTitle}
          description={t.demos.choiceDescription}
          code={choiceCode}
          align="stretch"
        >
          <Questionnaire labels={{ prompt: t.demos.choicePrompt, again: t.demos.choiceAgain }} />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.countdown}>
        <DemoCard
          title={t.demos.countdownTitle}
          description={t.demos.countdownDescription}
          code={countdownCode}
          align="stretch"
        >
          <Chrono labels={{ restart: t.demos.countdownRestart, over: t.demos.countdownOver }} />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.flash}>
        <DemoCard
          title={t.demos.flashTitle}
          description={t.demos.flashDescription}
          code={flashCode}
          align="stretch"
        >
          <Eclair
            labels={{
              good: t.demos.flashGood,
              bad: t.demos.flashBad,
              prompt: t.demos.flashPrompt,
            }}
          />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.share}>
        <DemoCard
          title={t.demos.shareTitle}
          description={t.demos.shareDescription}
          code={shareCode}
          align="start"
        >
          <ShareResult rows={GRILLE} text={TEXTE_PARTAGE} />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.api}>
        <PropsTable title="<Lives />" rows={livesRows} />
        <PropsTable title="<Streak />" rows={streakRows} />
        <PropsTable title="<ShareResult />" rows={shareRows} />
        <PropsTable title="<Choice />" rows={choiceRows} />
        <PropsTable title="<Countdown />" rows={countdownRows} />
        <PropsTable title="<Card />" rows={cardRows} />
      </DocSection>
    </DocPage>
  );
}
