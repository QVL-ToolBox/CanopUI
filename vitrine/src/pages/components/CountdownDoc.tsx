import { useEffect, useState } from "react";
import { Button, Countdown, ProgressBar, Stack, StatusChip, Text, useCountdown } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Countdown, useCountdown } from "@canop/ui";`;

const composantCode = `<Countdown duration={45_000} urgentBelow={10} onEnd={terminer} />`;

const usageCode = `const { seconds, progress, ended, restart } = useCountdown({
  duration: 60_000,
  running: phase === "play",
  onEnd: () => setPhase("done"),
});`;

const driftCode = `// Ce que le hook remplace : un tick qui retire une seconde.
const [left, setLeft] = useState(duration);
useEffect(() => {
  if (!running || left <= 0) return;
  const id = setTimeout(() => setLeft((value) => value - 1000), 1000);
  return () => clearTimeout(id);
}, [running, left]);`;

function Chrono({ labels }: { labels: { start: string; pause: string; restart: string } }) {
  const [running, setRunning] = useState(false);
  const { seconds, remaining, progress, ended, restart } = useCountdown({
    duration: 60_000,
    running,
    onEnd: () => setRunning(false),
  });

  return (
    <Stack gap="md" alignItems="stretch">
      <Stack direction="row" gap="md" alignItems="center" wrap>
        <Text variant="metric" tabularNums slashedZero>
          {seconds}s
        </Text>
        <Text variant="body-sm" tone="muted" tabularNums>
          {remaining} ms
        </Text>
        {ended && <StatusChip tone="warning" label="ended" />}
      </Stack>
      <ProgressBar value={Math.round(progress * 100)} color={ended ? "error" : "primary"} />
      <Stack direction="row" gap="sm" wrap>
        <Button size="small" disabled={ended} onClick={() => setRunning((value) => !value)}>
          {running ? labels.pause : labels.start}
        </Button>
        <Button
          size="small"
          variant="secondary"
          onClick={() => {
            restart();
            setRunning(true);
          }}
        >
          {labels.restart}
        </Button>
      </Stack>
    </Stack>
  );
}

/**
 * L'implementation que le hook remplace : elle retire une seconde par tick, et
 * accumule donc le retard de chaque rendu. Elle n'est ici que pour la
 * comparaison -- ne pas s'en inspirer.
 */
function useNaifCountdown(duration: number, running: boolean): number {
  const [left, setLeft] = useState(duration);
  useEffect(() => {
    if (!running || left <= 0) return;
    const id = window.setTimeout(() => setLeft((value) => Math.max(0, value - 1000)), 1000);
    return () => window.clearTimeout(id);
  }, [running, left]);
  return left;
}

function Comparaison({ labels }: { labels: { start: string; pause: string; gap: string } }) {
  const [running, setRunning] = useState(false);
  const { remaining } = useCountdown({ duration: 120_000, running, interval: 250 });
  const naif = useNaifCountdown(120_000, running);
  const ecart = naif - remaining;

  return (
    <Stack gap="md" alignItems="start">
      <Stack direction="row" gap="lg" alignItems="center" wrap>
        <Stack gap="xs">
          <Text variant="overline" tone="muted">
            useCountdown
          </Text>
          <Text variant="metric" tabularNums slashedZero>
            {(remaining / 1000).toFixed(1)}s
          </Text>
        </Stack>
        <Stack gap="xs">
          <Text variant="overline" tone="muted">
            tick naïf
          </Text>
          <Text variant="metric" tabularNums slashedZero>
            {(naif / 1000).toFixed(1)}s
          </Text>
        </Stack>
        <StatusChip
          tone={ecart > 1_000 ? "error" : ecart > 200 ? "warning" : "neutral"}
          label={`${labels.gap} ${ecart} ms`}
        />
      </Stack>
      <Button size="small" onClick={() => setRunning((value) => !value)}>
        {running ? labels.pause : labels.start}
      </Button>
    </Stack>
  );
}

const fr = {
  intro:
    "Un compte à rebours qui ne dérive pas. Le temps restant est recalculé depuis une échéance absolue, il n'est jamais décrémenté : soixante secondes affichées font soixante secondes réelles, quelle que soit la charge de la page, et le réveil d'un onglet mis en arrière-plan montre le temps réellement écoulé.",
  sections: {
    usage: "Utilisation",
    drift: "La dérive, en direct",
    composant: "Le composant",
    api: "API",
  },
  demos: {
    composantTitle: "Countdown, l'affichage tout fait",
    composantDescription:
      "Le hook est une brique qu'on pilote, le composant un affichage qu'on pose : chiffres en chasse fixe, barre de progression, et passage au rouge sous le seuil d'urgence. C'est la seule différence de comportement entre les deux — le composant part en marche, le hook part à l'arrêt.",
    usageTitle: "Une minute, à l'échelle réelle",
    usageDescription:
      "Lancez, laissez tourner, et comparez à votre montre. Les chiffres sont en chasse fixe, donc la largeur ne bouge pas d'une seconde à l'autre. La progression est celle du hook, pas un second calcul.",
    driftTitle: "Le hook contre un tick qui décrémente",
    driftDescription:
      "Les deux chronomètres partent de deux minutes en même temps. Celui de gauche recalcule depuis son échéance, celui de droite retire une seconde par tick — la forme qu'on trouve dans presque tous les jeux écrits à la main. L'écart s'ouvre tout seul, et il s'ouvre beaucoup plus vite si vous passez cet onglet en arrière-plan quelques secondes avant de revenir : le navigateur y bride les minuteries, et le tick naïf perd tout ce qu'il n'a pas compté. Mettre en pause fige par ailleurs le temps restant à l'instant exact, et non au dernier rafraîchissement — un gel arrondi offrirait jusqu'à un intervalle de temps de jeu gratuit.",
    gap: "écart",
    start: "Démarrer",
    pause: "Pause",
    restart: "Reprendre à zéro",
  },
  props: {
    compDuration: "Durée totale, en millisecondes.",
    compRunning:
      "Fait courir l'horloge. Repasser à false gèle le temps restant, à l'instant exact et non au dernier rafraîchissement. Le composant part en marche, là où le hook part à l'arrêt.",
    compOnEnd: "Appelé une seule fois, quand le temps est épuisé.",
    urgentBelow:
      "Seuil d'urgence, en secondes restantes : en dessous, le temps bat, passe au rouge et emmène la barre avec lui. 0 désactive le battement et laisse un décompte neutre.",
    format:
      "La forme du temps affiché : clock pour 1:00, seconds pour 60. Par défaut c'est la durée totale qui tranche, au-delà d'une minute — sans quoi un écran de règles promettant « 60 secondes » afficherait 1:00 puis 0:45, dont le préfixe 0: ne dit rien.",
    color: "Couleur de la barre hors urgence.",
    showProgress: "Retire la barre pour ne garder que le temps.",
    icon: "Icône posée devant le temps.",
    animated: "Anime la barre de progression.",
    ariaLabel: "Nom accessible explicite. Prend le pas sur le libellé traduit.",
    duration: "Durée totale, en millisecondes.",
    running: "Fait courir l'horloge. Repasser à false gèle le temps restant.",
    interval: "Fréquence de rafraîchissement de l'affichage, en millisecondes.",
    onEnd: "Appelé une seule fois, quand le temps est épuisé.",
    remaining: "Temps restant, en millisecondes. Jamais négatif.",
    seconds: "Temps restant arrondi à la seconde supérieure, pour l'affichage.",
    elapsed: "Temps écoulé, en millisecondes.",
    progress: "Part écoulée, de 0 à 1.",
    ended: "Vrai dès que le temps est épuisé.",
    restart: "Repart de la durée pleine, et réarme l'annonce de fin.",
  },
};

const en = {
  intro:
    "A countdown that does not drift. Remaining time is recomputed from an absolute deadline, never decremented: sixty displayed seconds are sixty real seconds whatever the page load, and waking a backgrounded tab shows the time that actually passed.",
  sections: {
    usage: "Usage",
    drift: "Drift, live",
    composant: "The component",
    api: "API",
  },
  demos: {
    composantTitle: "Countdown, the display already built",
    composantDescription:
      "The hook is a brick you drive, the component a display you drop in: tabular digits, a progress bar, and a switch to red below the urgency threshold. That is the only behavioural difference between the two — the component starts running, the hook starts stopped.",
    usageTitle: "One minute, at real scale",
    usageDescription:
      "Start it, let it run, and compare with your watch. Digits are tabular, so the width does not shift from one second to the next. The progress comes from the hook, not from a second computation.",
    driftTitle: "The hook against a decrementing tick",
    driftDescription:
      "Both clocks start from two minutes at the same time. The left one recomputes from its deadline, the right one subtracts a second per tick — the shape found in almost every hand-written game. The gap opens on its own, and it opens far faster if you send this tab to the background for a few seconds before coming back: browsers throttle timers there, and the naive tick loses everything it did not count. Pausing also freezes remaining time at the exact instant rather than at the last refresh — a rounded freeze would hand out up to one interval of free play time.",
    gap: "gap",
    start: "Start",
    pause: "Pause",
    restart: "Restart",
  },
  props: {
    compDuration: "Total duration, in milliseconds.",
    compRunning:
      "Runs the clock. Setting it back to false freezes remaining time at the exact instant rather than at the last refresh. The component starts running, where the hook starts stopped.",
    compOnEnd: "Called exactly once, when time runs out.",
    urgentBelow:
      "Urgency threshold, in remaining seconds: below it, the time beats, turns red and takes the bar with it. 0 disables the beat and leaves a neutral count.",
    format:
      "The shape of the displayed time: clock for 1:00, seconds for 60. By default the total duration decides, past one minute — otherwise a rules screen promising “60 seconds” would show 1:00 then 0:45, whose 0: prefix says nothing.",
    color: "Colour of the bar outside urgency.",
    showProgress: "Drops the bar to keep only the time.",
    icon: "Icon placed before the time.",
    animated: "Animates the progress bar.",
    ariaLabel: "Explicit accessible name. Takes precedence over the translated label.",
    duration: "Total duration, in milliseconds.",
    running: "Runs the clock. Setting it back to false freezes remaining time.",
    interval: "Display refresh rate, in milliseconds.",
    onEnd: "Called exactly once, when time runs out.",
    remaining: "Remaining time, in milliseconds. Never negative.",
    seconds: "Remaining time rounded up to the second, for display.",
    elapsed: "Elapsed time, in milliseconds.",
    progress: "Elapsed share, from 0 to 1.",
    ended: "True as soon as time has run out.",
    restart: "Starts again from the full duration, and rearms the end callback.",
  },
};

const texts = { fr, en };

export default function CountdownDoc() {
  const t = texts[useDocLocale()];

  const composantRows: PropRow[] = [
    { name: "duration", type: "number", required: true, description: t.props.compDuration },
    { name: "running", type: "boolean", defaultValue: "true", description: t.props.compRunning },
    { name: "onEnd", type: "() => void", description: t.props.compOnEnd },
    { name: "urgentBelow", type: "number", defaultValue: "10", description: t.props.urgentBelow },
    {
      name: "format",
      type: '"auto" | "clock" | "seconds"',
      defaultValue: '"auto"',
      description: t.props.format,
    },
    {
      name: "color",
      type: "CanopProgressBarColor",
      defaultValue: '"primary"',
      description: t.props.color,
    },
    {
      name: "showProgress",
      type: "boolean",
      defaultValue: "true",
      description: t.props.showProgress,
    },
    {
      name: "icon",
      type: "CanopIconName",
      defaultValue: '"timer"',
      description: t.props.icon,
    },
    { name: "animated", type: "boolean", defaultValue: "true", description: t.props.animated },
    { name: "ariaLabel", type: "string", description: t.props.ariaLabel },
  ];

  const optionRows: PropRow[] = [
    { name: "duration", type: "number", required: true, description: t.props.duration },
    { name: "running", type: "boolean", defaultValue: "false", description: t.props.running },
    { name: "interval", type: "number", defaultValue: "100", description: t.props.interval },
    { name: "onEnd", type: "() => void", defaultValue: "—", description: t.props.onEnd },
  ];

  const resultRows: PropRow[] = [
    { name: "remaining", type: "number", description: t.props.remaining },
    { name: "seconds", type: "number", description: t.props.seconds },
    { name: "elapsed", type: "number", description: t.props.elapsed },
    { name: "progress", type: "number", description: t.props.progress },
    { name: "ended", type: "boolean", description: t.props.ended },
    { name: "restart", type: "() => void", description: t.props.restart },
  ];

  return (
    <DocPage title="Countdown" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.usageTitle}
          description={t.demos.usageDescription}
          code={usageCode}
          align="stretch"
        >
          <Chrono
            labels={{
              start: t.demos.start,
              pause: t.demos.pause,
              restart: t.demos.restart,
            }}
          />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.drift}>
        <DemoCard
          title={t.demos.driftTitle}
          description={t.demos.driftDescription}
          code={driftCode}
          align="start"
        >
          <Comparaison labels={{ start: t.demos.start, pause: t.demos.pause, gap: t.demos.gap }} />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.composant}>
        <DemoCard
          title={t.demos.composantTitle}
          description={t.demos.composantDescription}
          code={composantCode}
          align="stretch"
        >
          <Countdown duration={45_000} urgentBelow={10} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable title="<Countdown />" rows={composantRows} />
        <PropsTable title="UseCountdownOptions" rows={optionRows} />
        <PropsTable title="UseCountdownResult" rows={resultRows} />
      </DocSection>
    </DocPage>
  );
}
