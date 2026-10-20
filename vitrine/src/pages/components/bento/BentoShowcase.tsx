import { BentoGrid, BentoTile, Button, Card, Presence, Stack, Text } from "@canop/ui";
import { useDocLocale } from "../../../i18n/useDocLocale";
import { BentoCounterCard } from "./BentoCounterCard";
import { useBentoShowcase } from "./useBentoShowcase";

const labels = {
  fr: {
    grid: "Accueil du Cockpit",
    replay: "Rejouer l'entrée",
    showAlerts: "Afficher les alertes",
    hideAlerts: "Masquer les alertes",
    chess: {
      title: "Échecs",
      subtitle: "Parties par correspondance",
      value: "3",
      caption: "parties attendent votre coup",
    },
    approvals: {
      title: "Approbations",
      subtitle: "Demandes en attente",
      value: "4",
      caption: "à valider cette semaine",
    },
    reviews: {
      title: "Reviews",
      subtitle: "Pull requests",
      value: "7",
      caption: "vous sont assignées",
    },
    alerts: {
      title: "2 alertes",
      body: "La pipeline CanopUI a échoué sur dev, et le certificat de npm.qvl-project.com expire dans 9 jours.",
    },
  },
  en: {
    grid: "Cockpit home",
    replay: "Replay entrance",
    showAlerts: "Show alerts",
    hideAlerts: "Hide alerts",
    chess: {
      title: "Chess",
      subtitle: "Correspondence games",
      value: "3",
      caption: "games await your move",
    },
    approvals: {
      title: "Approvals",
      subtitle: "Pending requests",
      value: "4",
      caption: "to approve this week",
    },
    reviews: {
      title: "Reviews",
      subtitle: "Pull requests",
      value: "7",
      caption: "assigned to you",
    },
    alerts: {
      title: "2 alerts",
      body: "The CanopUI pipeline failed on dev, and the npm.qvl-project.com certificate expires in 9 days.",
    },
  },
};

const STAGGER_SECONDS = 0.06;

export function BentoShowcase() {
  const { round, replay, alertsShown, toggleAlerts } = useBentoShowcase();
  const t = labels[useDocLocale()];

  return (
    <Stack gap="md">
      <Stack direction="row" gap="sm" wrap>
        <Button variant="secondary" size="small" onClick={replay}>
          {t.replay}
        </Button>
        <Button variant="tonal" size="small" onClick={toggleAlerts}>
          {alertsShown ? t.hideAlerts : t.showAlerts}
        </Button>
      </Stack>
      <BentoGrid
        key={round}
        columns={{ sm: 2, md: 3 }}
        rowHeight="9rem"
        role="region"
        ariaLabel={t.grid}
      >
        <Presence stagger={STAGGER_SECONDS} appear>
          <BentoTile key="chess" span={2} rowSpan={{ md: 2 }} layout>
            <BentoCounterCard {...t.chess} />
          </BentoTile>
          <BentoTile key="approvals" layout>
            <BentoCounterCard {...t.approvals} />
          </BentoTile>
          <BentoTile key="reviews" layout>
            <BentoCounterCard {...t.reviews} />
          </BentoTile>
          {alertsShown ? (
            <BentoTile key="alerts" span={3} layout>
              <Card tone="warning" fill title={t.alerts.title}>
                <Text>{t.alerts.body}</Text>
              </Card>
            </BentoTile>
          ) : null}
        </Presence>
      </BentoGrid>
    </Stack>
  );
}
