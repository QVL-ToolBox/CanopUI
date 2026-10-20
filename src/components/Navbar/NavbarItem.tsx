import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import { useId, useState, type MouseEvent } from "react";
import { Icon } from "../Icon";
import { NavbarLink } from "./NavbarLink";
import { isItemActive, navigateFromEvent, type CanopNavbarItem } from "./navigation";
import { useReducedMotion } from "../../motion";

export interface NavbarItemProps {
  item: CanopNavbarItem;
  activeHref?: string;
  onNavigate?: (href: string) => void;
}

export function NavbarItem({ item, activeHref, onNavigate }: NavbarItemProps) {
  const subItems = item.children ?? [];
  const hasSubItems = subItems.length > 0;
  const subListId = useId();
  const childActive = subItems.some((sub) => isItemActive(sub.href, activeHref));
  const active = isItemActive(item.href, activeHref) || childActive;
  const reducedMotion = useReducedMotion();

  const [open, setOpen] = useState(active);
  const [syncedActive, setSyncedActive] = useState(active);
  if (active !== syncedActive) {
    setSyncedActive(active);
    setOpen(active);
  }

  const expanded = hasSubItems && open;

  function handleParentClick(event: MouseEvent) {
    navigateFromEvent(event, item.href, onNavigate);
    if (hasSubItems) {
      setOpen((value) => !value);
    }
  }

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
            {subItems.map((sub) => (
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
          </Box>
        </Collapse>
      )}
    </Box>
  );
}
