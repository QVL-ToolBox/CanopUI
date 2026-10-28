import { Card, Heading, Navbar, Stack, type CanopNavbarItem } from "@canop/ui";
import { DemoScreen } from "../../../kit/DemoScreen";
import { useNavbarSubItemsDemo } from "./useNavbarSubItemsDemo";

const groupedItems: CanopNavbarItem[] = [
  { label: "Tableau de bord", href: "/dashboard", icon: "apps" },
  {
    label: "Catalogue",
    href: "/catalog",
    icon: "layout",
    children: [{ label: "Nouveautés", href: "/catalog/new" }],
    groups: [
      {
        label: "Saisie",
        items: [
          { label: "Button", href: "/catalog/button" },
          { label: "Input", href: "/catalog/input" },
        ],
      },
      {
        label: "Affichage",
        items: [
          { label: "Card", href: "/catalog/card" },
          { label: "DataTable", href: "/catalog/data-table" },
        ],
      },
    ],
  },
  { label: "Paramètres", href: "/settings", icon: "settings" },
];

export function NavbarGroupsDemo() {
  const { activeHref, navigate } = useNavbarSubItemsDemo("/catalog/card");

  return (
    <DemoScreen height="30rem">
      <Navbar
        height="100%"
        mainElement="div"
        items={groupedItems}
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
            Les sous-items sont rangés sous des intertitres, en barre latérale comme dans les
            sous-menus du rail et de la barre mobile.
          </Card>
        </Stack>
      </Navbar>
    </DemoScreen>
  );
}
