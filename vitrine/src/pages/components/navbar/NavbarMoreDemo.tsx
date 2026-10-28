import { Card, Heading, Navbar, Stack, type CanopNavbarItem } from "@canop/ui";
import { DemoScreen } from "../../../kit/DemoScreen";
import { useNavbarSubItemsDemo } from "./useNavbarSubItemsDemo";

const manyItems: CanopNavbarItem[] = [
  { label: "Accueil", href: "/home", icon: "home" },
  { label: "Agenda", href: "/agenda", icon: "calendar" },
  { label: "Messages", href: "/messages", icon: "chat" },
  { label: "Fichiers", href: "/files", icon: "folder" },
  {
    label: "Équipe",
    href: "/team",
    icon: "contacts",
    children: [
      { label: "Membres", href: "/team/members" },
      { label: "Invitations", href: "/team/invitations" },
    ],
  },
  { label: "Rapports", href: "/reports", icon: "barChart" },
  { label: "Paramètres", href: "/settings", icon: "settings" },
];

export function NavbarMoreDemo() {
  const { activeHref, navigate } = useNavbarSubItemsDemo("/reports");

  return (
    <DemoScreen>
      <Navbar
        height="100%"
        mainElement="div"
        items={manyItems}
        title="Mon portail"
        titleLevel="text"
        activeHref={activeHref}
        onNavigate={navigate}
      >
        <Stack padding="lg" gap="md">
          <Heading level={4} size={3}>
            {activeHref}
          </Heading>
          <Card>
            En mobile, les entrées qui ne tiennent pas dans la barre basse passent sous le bouton
            Plus.
          </Card>
        </Stack>
      </Navbar>
    </DemoScreen>
  );
}
