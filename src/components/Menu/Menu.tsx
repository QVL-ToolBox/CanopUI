import MuiMenu from "@mui/material/Menu";
import { squircleSurface } from "../../squircle";
import type { ReactNode } from "react";
import { Icon, type CanopIconName } from "../Icon";
import { SkeletonScope } from "../Skeleton/SkeletonScope";
import { MenuItem } from "./MenuItem";

export interface CanopMenuPosition {
  top: number;
  left: number;
}

export interface CanopMenuItemModel {
  /** Cle stable. A defaut, le libelle sert de cle. */
  key?: string;
  label: string;
  icon?: CanopIconName;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export interface CanopMenuProps {
  open: boolean;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
  position?: CanopMenuPosition;
  ariaLabel?: string;
  onItemClick?: () => void;
  /**
   * Les entrees du menu, decrites plutot que composees.
   *
   * Chaque entree ferme le menu avant d'agir. C'est la forme que les
   * applications reconstruisaient chacune de son cote, en oubliant tantot la
   * fermeture, tantot l'ordre entre fermer et agir.
   *
   * Pour un menu qui contient autre chose que des entrees -- un en-tete, un
   * separateur, un champ -- passer `children`.
   */
  items?: CanopMenuItemModel[];
  children?: ReactNode;
}

export function Menu({
  open,
  onClose,
  anchorEl,
  position,
  ariaLabel,
  onItemClick,
  items,
  children,
}: CanopMenuProps) {
  const usePosition = !anchorEl && Boolean(position);

  return (
    <SkeletonScope surface={null}>
      <MuiMenu
        open={open}
        onClose={onClose}
        anchorEl={anchorEl ?? undefined}
        anchorReference={usePosition ? "anchorPosition" : "anchorEl"}
        anchorPosition={position ? { top: position.top, left: position.left } : undefined}
        elevation={0}
        slotProps={{
          list: { role: "menu", "aria-label": ariaLabel, onClick: onItemClick },
          paper: {
            sx: squircleSurface({
              radius: "var(--canop-radius-sm)",
              background: "var(--canop-palette-surface-overlay)",
              shadow: "var(--canop-drop-shadow-e2)",
            }),
          },
        }}
      >
        {items?.map((item) => (
          <MenuItem
            key={item.key ?? item.label}
            label={item.label}
            icon={item.icon ? <Icon name={item.icon} size="sm" /> : undefined}
            disabled={item.disabled}
            danger={item.danger}
            onClick={function closeBeforeActingSoAnchorStillExists() {
              onClose();
              item.onClick?.();
            }}
          />
        ))}
        {children}
      </MuiMenu>
    </SkeletonScope>
  );
}
