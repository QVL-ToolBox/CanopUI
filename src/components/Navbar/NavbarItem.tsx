import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import { Icon } from "../Icon";
import { NAVBAR_LINK_INSET, NavbarLink } from "./NavbarLink";
import { NavbarSectionGroup } from "./NavbarSectionGroup";
import { isItemActive, navigateFromEvent, type CanopNavbarItem } from "./navigation";
import { useNavbarItem } from "./useNavbarItem";
import { useReducedMotion } from "../../motion";

export interface NavbarItemProps {
  item: CanopNavbarItem;
  activeHref?: string;
  onNavigate?: (href: string) => void;
}

export function NavbarItem({ item, activeHref, onNavigate }: NavbarItemProps) {
  const { sections, hasSubItems, active, childActive, expanded, subListId, handleParentClick } =
    useNavbarItem(item, activeHref, onNavigate);
  const reducedMotion = useReducedMotion();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
      }}
    >
      <NavbarLink
        href={item.href}
        label={item.label}
        icon={item.icon}
        active={active}
        showIndicator={active && !childActive}
        onClick={handleParentClick}
        expanded={hasSubItems ? expanded : undefined}
        controls={hasSubItems && expanded ? subListId : undefined}
        trailing={
          hasSubItems ? (
            <Box
              component="span"
              aria-hidden
              sx={{
                display: "inline-flex",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition:
                  "transform var(--canop-motion-duration-base) var(--canop-motion-ease-standard)",
              }}
            >
              <Icon name="caretDown" size="sm" />
            </Box>
          ) : undefined
        }
      />
      {hasSubItems && (
        <Collapse in={expanded} unmountOnExit timeout={reducedMotion ? 0 : undefined}>
          <Box
            id={subListId}
            role="group"
            aria-label={item.label}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              paddingLeft: "1rem",
            }}
          >
            {sections.map((section, index) => (
              <NavbarSectionGroup key={index} label={section.label} inset={NAVBAR_LINK_INSET}>
                {section.items.map((sub) => (
                  <NavbarLink
                    key={sub.href}
                    href={sub.href}
                    label={sub.label}
                    icon={sub.icon}
                    active={isItemActive(sub.href, activeHref)}
                    nested
                    onClick={(event) => navigateFromEvent(event, sub.href, onNavigate)}
                  />
                ))}
              </NavbarSectionGroup>
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}
