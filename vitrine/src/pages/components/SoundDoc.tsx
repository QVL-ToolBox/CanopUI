import { useState } from "react";
import {
  Button,
  CanopSoundProvider,
  canopSoundNames,
  Slider,
  SoundToggle,
  Stack,
  StatusChip,
  Text,
  useCanopSound,
  type CanopSoundName,
  type CanopSoundOutcome,
} from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { CanopSoundProvider, useCanopSound, SoundToggle } from "@canop/ui";`;

const providerCode = `<CanopSoundProvider>
  <App />
</CanopSoundProvider>`;

const playCode = `const { play } = useCanopSound();

<Button onClick={() => play("correct")}>Bonne réponse</Button>`;

const volumeCode = `const { volume, setVolume, muted } = useCanopSound();

<Slider value={volume} onChange={setVolume} min={0} max={1} step={0.05} />
<SoundToggle />`;

const fallbackCode = `<CanopSoundProvider sources={{ correct: "/sfx/correct.mp3" }}>
  <App />
</CanopSoundProvider>`;

const outcomeTone: Record<CanopSoundOutcome, "success" | "warning" | "error" | "info"> = {
  file: "success",
  synth: "info",
  muted: "warning",
  unavailable: "error",
};

function Clavier({ labels, hint }: { labels: Record<CanopSoundName, string>; hint: string }) {
  const { play } = useCanopSound();
  const [dernier, setDernier] = useState<{
    name: CanopSoundName;
    outcome: CanopSoundOutcome;
  } | null>(null);

  return (
    <Stack gap="md" alignItems="start">
      <Stack direction="row" gap="sm" wrap>
        {canopSoundNames.map((name) => (
          <Button
            key={name}
            variant={name === "wrong" ? "secondary" : "primary"}
            size="small"
            onClick={() => setDernier({ name, outcome: play(name) })}
          >
            {labels[name]}
          </Button>
        ))}
      </Stack>
      <Stack direction="row" gap="sm" alignItems="center">
        <SoundToggle />
        {dernier ? (
          <StatusChip
            tone={outcomeTone[dernier.outcome]}
            label={`${dernier.name} → ${dernier.outcome}`}
          />
        ) : (
          <Text variant="body-sm" tone="muted">
            {hint}
          </Text>
        )}
      </Stack>
    </Stack>
  );
}

function Volume({ label }: { label: string }) {
  const { volume, setVolume, play } = useCanopSound();

  return (
    <Stack gap="md" alignItems="stretch">
      <Slider
        value={volume}
        onChange={setVolume}
        min={0}
        max={1}
        step={0.05}
        label={label}
        showValue
        format={(value) => `${Math.round(value * 100)} %`}
      />
      <Stack direction="row" gap="sm">
        <Button size="small" onClick={() => play("correct")}>
          correct
        </Button>
        <Button size="small" variant="secondary" onClick={() => play("finish")}>
          finish
        </Button>
      </Stack>
    </Stack>
  );
}

function Repli({ note }: { note: string }) {
  const { play } = useCanopSound();
  const [outcome, setOutcome] = useState<CanopSoundOutcome | null>(null);

  return (
    <Stack gap="md" alignItems="start">
      <Text variant="body-sm" tone="muted">
        {note}
      </Text>
      <Stack direction="row" gap="sm" alignItems="center">
        <Button size="small" onClick={() => setOutcome(play("correct"))}>
          correct
        </Button>
        {outcome && <StatusChip tone={outcomeTone[outcome]} label={outcome} />}
      </Stack>
    </Stack>
  );
}

const fr = {
  intro:
    "Le son fait partie du design system. Un écran demande « correct », jamais une fréquence : le timbre de la bonne réponse se change ici, une fois, et non dans chaque écran. Les sons sont synthétisés à la volée — aucun fichier à télécharger, rien à charger hors-ligne, aucune licence à traîner — et des fichiers peuvent les remplacer un par un.",
  sections: {
    provider: "Le provider",
    catalogue: "Le catalogue",
    volume: "Volume et coupure",
    files: "Fichiers et repli",
    api: "API",
  },
  labels: {
    click: "click",
    start: "start",
    correct: "correct",
    wrong: "wrong",
    finish: "finish",
  } as Record<CanopSoundName, string>,
  demos: {
    providerTitle: "Un seul état sonore pour toute l'application",
    providerDescription:
      "La coupure et le volume vivent dans le provider, et sont retenus d'une visite à l'autre. Deux boutons de coupure posés sur deux écrans affichent donc toujours la même vérité — c'est le défaut que ce provider fait disparaître.",
    catalogueHint: "Cliquez un son pour voir ce qui en sort.",
    catalogueTitle: "Les cinq sons",
    catalogueDescription:
      "Cliquez : le son sort, et la pastille dit ce qui en est réellement sorti. synth pour la synthèse, file pour un fichier, muted quand le son est coupé, unavailable quand le navigateur n'offre pas de Web Audio. Un son qui ne sort pas est invisible, donc indébogable : l'issue est retournée, pas journalisée.",
    volumeTitle: "Volume",
    volumeLabel: "Volume général",
    volumeDescription:
      "Le volume multiplie celui de chaque note. Il n'existe aucune media query « moins de son » — prefers-reduced-motion ne parle que d'animation — donc le réglage est explicite, persisté, et rien ne joue avant un geste de l'utilisateur.",
    filesTitle: "Un fichier absent ne rend pas l'application muette",
    filesDescription:
      "Cette démonstration déclare un fichier qui n'existe pas. Le son sort quand même, par la synthèse, et l'issue affichée le dit. Le téléchargement condamné n'est tenté qu'une fois.",
    filesNote:
      'sources={{ correct: "/sfx/absent.mp3" }} — le fichier renvoie 404, la synthèse reprend la main.',
  },
  props: {
    toggleVariant:
      "Habillage du bouton, celui de IconActionButton : secondary pose un fond plein au logo blanc, default un bouton discret.",
    toggleSize: "Largeur et hauteur du bouton, en unités CSS relatives.",
    toggleIconSize: "Taille de l'icône dans le bouton.",
    defaultMuted: "Silence au premier lancement, avant tout choix de l'utilisateur.",
    defaultVolume: "Volume général au premier lancement, de 0 à 1.",
    storageKey: "Clé de persistance du réglage, ou null pour ne rien retenir.",
    sources: "Fichiers audio par son, avec repli sur la synthèse en cas d'échec.",
    recipes: "Recettes synthétisées personnalisées, par son.",
    play: "Joue un son du catalogue et retourne ce qui en est sorti.",
    muted: "État de coupure, partagé par tous les consommateurs.",
    volume: "Volume général courant, de 0 à 1.",
    unlock:
      "Réveille le contexte audio depuis un geste de l'utilisateur. Rarement utile : jouer un son le fait déjà.",
  },
};

const en = {
  intro:
    'Sound is part of the design system. A screen asks for "correct", never for a frequency: the timbre of a right answer changes here, once, instead of in every screen. Sounds are synthesized on the fly — no file to download, nothing to fetch offline, no licence to carry — and files can replace them one by one.',
  sections: {
    provider: "The provider",
    catalogue: "The catalogue",
    volume: "Volume and mute",
    files: "Files and fallback",
    api: "API",
  },
  labels: {
    click: "click",
    start: "start",
    correct: "correct",
    wrong: "wrong",
    finish: "finish",
  } as Record<CanopSoundName, string>,
  demos: {
    providerTitle: "One sound state for the whole application",
    providerDescription:
      "Mute and volume live in the provider, and are remembered across visits. Two mute buttons on two screens therefore always show the same truth — the very defect this provider removes.",
    catalogueHint: "Click a sound to see what comes out of it.",
    catalogueTitle: "The five sounds",
    catalogueDescription:
      "Click: the sound plays, and the chip says what actually came out. synth for synthesis, file for a file, muted when sound is off, unavailable when the browser offers no Web Audio. A sound that does not play is invisible, therefore undebuggable: the outcome is returned, not logged.",
    volumeTitle: "Volume",
    volumeLabel: "Master volume",
    volumeDescription:
      'Volume multiplies each note\'s own level. There is no "reduced sound" media query — prefers-reduced-motion only speaks of animation — so the setting is explicit, persisted, and nothing plays before a user gesture.',
    filesTitle: "A missing file does not mute the application",
    filesDescription:
      "This demo declares a file that does not exist. The sound still plays, through synthesis, and the outcome says so. The doomed download is attempted only once.",
    filesNote:
      'sources={{ correct: "/sfx/absent.mp3" }} — the file returns 404, synthesis takes over.',
  },
  props: {
    toggleVariant:
      "Look of the button, taken from IconActionButton: secondary lays a solid ground under a white logo, default a discreet button.",
    toggleSize: "Width and height of the button, in relative CSS units.",
    toggleIconSize: "Size of the icon inside the button.",
    defaultMuted: "Silence on first launch, before any user choice.",
    defaultVolume: "Master volume on first launch, from 0 to 1.",
    storageKey: "Storage key for the setting, or null to remember nothing.",
    sources: "Audio files per sound, falling back to synthesis on failure.",
    recipes: "Custom synthesized recipes, per sound.",
    play: "Plays a catalogue sound and returns what came out of it.",
    muted: "Mute state, shared by every consumer.",
    volume: "Current master volume, from 0 to 1.",
    unlock:
      "Wakes the audio context from a user gesture. Rarely needed: playing a sound already does it.",
  },
};

const texts = { fr, en };

export default function SoundDoc() {
  const t = texts[useDocLocale()];

  const toggleRows: PropRow[] = [
    {
      name: "variant",
      type: '"default" | "danger" | "secondary" | "accent"',
      defaultValue: '"secondary"',
      description: t.props.toggleVariant,
    },
    { name: "size", type: "string", defaultValue: '"2.5rem"', description: t.props.toggleSize },
    {
      name: "iconSize",
      type: "CanopIconSize",
      defaultValue: '"md"',
      description: t.props.toggleIconSize,
    },
  ];

  const providerRows: PropRow[] = [
    {
      name: "defaultMuted",
      type: "boolean",
      defaultValue: "false",
      description: t.props.defaultMuted,
    },
    {
      name: "defaultVolume",
      type: "number",
      defaultValue: "1",
      description: t.props.defaultVolume,
    },
    {
      name: "storageKey",
      type: "string | null",
      defaultValue: '"canop-sound"',
      description: t.props.storageKey,
    },
    {
      name: "sources",
      type: "Partial<Record<CanopSoundName, string>>",
      defaultValue: "—",
      description: t.props.sources,
    },
    {
      name: "recipes",
      type: "Partial<Record<CanopSoundName, CanopSoundRecipe>>",
      defaultValue: "—",
      description: t.props.recipes,
    },
  ];

  const hookRows: PropRow[] = [
    {
      name: "play",
      type: '(name: CanopSoundName) => "file" | "synth" | "muted" | "unavailable"',
      defaultValue: "—",
      description: t.props.play,
    },
    { name: "muted", type: "boolean", defaultValue: "—", description: t.props.muted },
    {
      name: "setMuted / toggleMuted",
      type: "(next: boolean) => void / () => void",
      defaultValue: "—",
      description: t.props.muted,
    },
    { name: "volume", type: "number", defaultValue: "—", description: t.props.volume },
    {
      name: "setVolume",
      type: "(next: number) => void",
      defaultValue: "—",
      description: t.props.volume,
    },
    { name: "unlock", type: "() => void", defaultValue: "—", description: t.props.unlock },
  ];

  return (
    <DocPage title="Sound" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.provider}>
        <DemoCard
          title={t.demos.providerTitle}
          description={t.demos.providerDescription}
          code={providerCode}
          align="start"
        >
          <CanopSoundProvider>
            <Stack direction="row" gap="md" alignItems="center">
              <SoundToggle />
              <SoundToggle variant="default" />
            </Stack>
          </CanopSoundProvider>
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.catalogue}>
        <DemoCard
          title={t.demos.catalogueTitle}
          description={t.demos.catalogueDescription}
          code={playCode}
          align="start"
        >
          <CanopSoundProvider>
            <Clavier labels={t.labels} hint={t.demos.catalogueHint} />
          </CanopSoundProvider>
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.volume}>
        <DemoCard
          title={t.demos.volumeTitle}
          description={t.demos.volumeDescription}
          code={volumeCode}
          align="stretch"
        >
          <CanopSoundProvider>
            <Volume label={t.demos.volumeLabel} />
          </CanopSoundProvider>
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.files}>
        <DemoCard
          title={t.demos.filesTitle}
          description={t.demos.filesDescription}
          code={fallbackCode}
          align="start"
        >
          <CanopSoundProvider storageKey={null} sources={{ correct: "/sfx/absent.mp3" }}>
            <Repli note={t.demos.filesNote} />
          </CanopSoundProvider>
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.api}>
        <PropsTable title="<SoundToggle />" rows={toggleRows} />
        <PropsTable title="<CanopSoundProvider />" rows={providerRows} />
        <PropsTable title="useCanopSound()" rows={hookRows} />
      </DocSection>
    </DocPage>
  );
}
