import { Card, Heading, Navbar, Stack, type CanopNavbarItem } from "@canop/ui";
import { DemoScreen } from "../../../kit/DemoScreen";
import { useNavbarSubItemsDemo } from "./useNavbarSubItemsDemo";

const subItems: CanopNavbarItem[] = [
  { label: "Tableau de bord", href: "/dashboard", icon: "apps" },
  {
    label: "QVL-Studio",
    href: "/studio",
    icon: "apps",
    children: [
      { label: "CanopUI", href: "/studio/canopui", icon: "folder" },
      { label: "PipeBoard", href: "/studio/pipeboard", icon: "folder" },
    ],
  },
  { label: "Paramètres", href: "/settings", icon: "settings" },
];

export function NavbarSubItemsDemo() {
  const { activeHref, navigate } = useNavbarSubItemsDemo("/studio/canopui");

  return (
    <DemoScreen>
      <Navbar
        height="100%"
        mainElement="div"
        items={subItems}
        title="Mon portail"
        titleLevel="text"
        activeHref={activeHref}
        onNavigate={navigate}
        userName="Martin Queval"
      >
        <Stack padding="lg" gap="md">
          <Heading level={4} size={3}>
            {activeHref}
          </Heading>
          <Card>
            Cliquez sur une section pour la déplier ou la replier. La section active s&apos;ouvre
            par défaut.
          </Card>
        </Stack>
      </Navbar>
    </DemoScreen>
  );
}
