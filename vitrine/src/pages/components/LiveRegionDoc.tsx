import { useState } from "react";
import { Button, LiveRegion, Stack, Text, useLiveAnnouncer } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { LiveRegion, useLiveAnnouncer } from "@canop/ui";`;

const politeCode = `const [announcement, setAnnouncement] = useState("12 résultats");

<Button onClick={() => setAnnouncement("3 résultats")}>Changer de filtre</Button>
<LiveRegion message={announcement} />`;

const repeatCode = `const { announce, ...region } = useLiveAnnouncer();

<Button onClick={() => announce("Brouillon enregistré")}>Enregistrer</Button>
<LiveRegion {...region} />`;

const assertiveCode = `<LiveRegion politeness="assertive" message={error} />`;

const fr = {
  intro:
    "Région vivante invisible : chaque nouveau message est lu par les lecteurs d'écran, sans déplacer le focus. Polie par défaut, elle attend que l'utilisateur ait fini ce qu'il écoute ; assertive, elle l'interrompt. La région est posée vide dès le premier rendu, puis le message y est écrit un instant plus tard : c'est ce qui garantit qu'il soit annoncé, y compris au montage. Plusieurs annonces à moins de 100 ms d'intervalle n'en font qu'une : seule la dernière est lue.",
  sections: {
    polite: "Annonce polie",
    repeat: "Répéter un message identique",
    assertive: "Annonce assertive",
    api: "API",
  },
  demos: {
    politeTitle: "message",
    politeDescription:
      "Le remplacement direct d'une région de statut maison : on passe le texte, la région l'annonce à chaque changement.",
    toggleFilter: "Changer de filtre",
    manyResults: "12 résultats",
    fewResults: "3 résultats",
    repeatTitle: "useLiveAnnouncer",
    repeatDescription:
      "Un même texte répété — « Brouillon enregistré » à chaque sauvegarde — ne change rien au rendu, donc rien n'est annoncé. useLiveAnnouncer numérote chaque annonce : announcementId change à chaque appel, et la région relit le message même s'il est identique au précédent.",
    assertiveTitle: 'politeness="assertive"',
    assertiveDescription:
      "À réserver à ce qui ne peut pas attendre : une erreur bloquante, une session qui expire. La région prend alors le rôle alert.",
    save: "Enregistrer",
    saved: "Brouillon enregistré",
    fail: "Simuler une erreur",
    failed: "Échec de l'enregistrement, réessayez.",
    count: "Annonces faites :",
  },
  props: {
    message: "Texte à annoncer. Une chaîne vide vide la région sans rien annoncer.",
    politeness: "polite attend une pause de l'utilisateur, assertive l'interrompt (rôle alert).",
    announcementId:
      "Identifiant de l'annonce : le changer relit le message, même identique. Fourni par useLiveAnnouncer.",
  },
  hookRows: {
    message: "Dernier message annoncé, à passer à LiveRegion.",
    announcementId: "Numéro de l'annonce, incrémenté à chaque appel d'announce.",
    announce: "Annonce un message, qu'il soit nouveau ou identique au précédent.",
  },
  hookTitle: "useLiveAnnouncer()",
};

const en: typeof fr = {
  intro:
    "An invisible live region: every new message is read by screen readers, without moving focus. Polite by default, it waits until the user has finished what they are listening to; assertive, it interrupts them. The region is rendered empty on first paint, and the message is written into it a moment later: that is what guarantees it gets announced, on mount included. Several announcements less than 100 ms apart collapse into one: only the last is read.",
  sections: {
    polite: "Polite announcement",
    repeat: "Repeating an identical message",
    assertive: "Assertive announcement",
    api: "API",
  },
  demos: {
    politeTitle: "message",
    politeDescription:
      "The drop-in replacement for a hand-made status region: pass the text, the region announces it whenever it changes.",
    toggleFilter: "Change filter",
    manyResults: "12 results",
    fewResults: "3 results",
    repeatTitle: "useLiveAnnouncer",
    repeatDescription:
      "The same text repeated — “Draft saved” on every save — changes nothing in the render, so nothing gets announced. useLiveAnnouncer numbers each announcement: announcementId changes on every call, and the region reads the message again even when it matches the previous one.",
    assertiveTitle: 'politeness="assertive"',
    assertiveDescription:
      "Keep it for what cannot wait: a blocking error, an expiring session. The region then takes the alert role.",
    save: "Save",
    saved: "Draft saved",
    fail: "Simulate an error",
    failed: "Saving failed, please try again.",
    count: "Announcements made:",
  },
  props: {
    message: "Text to announce. An empty string clears the region without announcing anything.",
    politeness: "polite waits for a pause, assertive interrupts the user (alert role).",
    announcementId:
      "Identifier of the announcement: changing it reads the message again, even if identical. Provided by useLiveAnnouncer.",
  },
  hookRows: {
    message: "Last announced message, to pass to LiveRegion.",
    announcementId: "Number of the announcement, incremented on every announce call.",
    announce: "Announces a message, whether new or identical to the previous one.",
  },
  hookTitle: "useLiveAnnouncer()",
};

const texts = { fr, en };

type LiveRegionDocTexts = typeof fr;

function AnnouncerDemo({
  t,
  politeness,
  label,
  message,
}: {
  t: LiveRegionDocTexts;
  politeness: "polite" | "assertive";
  label: string;
  message: string;
}) {
  const { announce, ...region } = useLiveAnnouncer();

  return (
    <Stack gap="sm" alignItems="center">
      <Button
        variant={politeness === "assertive" ? "danger" : "primary"}
        onClick={() => announce(message)}
      >
        {label}
      </Button>
      <Text variant="caption" tone="muted">
        {t.demos.count} {region.announcementId}
      </Text>
      <LiveRegion politeness={politeness} {...region} />
    </Stack>
  );
}

function PoliteDemo({ t }: { t: LiveRegionDocTexts }) {
  const [narrowed, setNarrowed] = useState(false);
  const announcement = narrowed ? t.demos.fewResults : t.demos.manyResults;

  return (
    <Stack gap="sm" alignItems="center">
      <Button variant="primary" onClick={() => setNarrowed((value) => !value)}>
        {t.demos.toggleFilter}
      </Button>
      <Text variant="caption" tone="muted">
        {announcement}
      </Text>
      <LiveRegion message={announcement} />
    </Stack>
  );
}

export default function LiveRegionDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    { name: "message", type: "string", required: true, description: t.props.message },
    {
      name: "politeness",
      type: '"polite" | "assertive"',
      defaultValue: '"polite"',
      description: t.props.politeness,
    },
    { name: "announcementId", type: "number | string", description: t.props.announcementId },
  ];

  const hookRows: PropRow[] = [
    { name: "message", type: "string", description: t.hookRows.message },
    { name: "announcementId", type: "number", description: t.hookRows.announcementId },
    { name: "announce", type: "(message: string) => void", description: t.hookRows.announce },
  ];

  return (
    <DocPage title="LiveRegion" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.polite}>
        <DemoCard
          title={t.demos.politeTitle}
          description={t.demos.politeDescription}
          code={politeCode}
        >
          <PoliteDemo t={t} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.repeat}>
        <DemoCard
          title={t.demos.repeatTitle}
          description={t.demos.repeatDescription}
          code={repeatCode}
        >
          <AnnouncerDemo t={t} politeness="polite" label={t.demos.save} message={t.demos.saved} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.assertive}>
        <DemoCard
          title={t.demos.assertiveTitle}
          description={t.demos.assertiveDescription}
          code={assertiveCode}
        >
          <AnnouncerDemo
            t={t}
            politeness="assertive"
            label={t.demos.fail}
            message={t.demos.failed}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} title="LiveRegion" />
        <PropsTable rows={hookRows} title={t.hookTitle} />
      </DocSection>
    </DocPage>
  );
}
