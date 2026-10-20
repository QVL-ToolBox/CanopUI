import ButtonBase from "@mui/material/ButtonBase";
import { squircleSurface } from "../../squircle";
import type { MouseEvent } from "react";
import { useTranslation } from "../../i18n";
import { focusRingSx } from "../_shared/focusRing";
import { Icon } from "../Icon";
import { Menu, MenuItem } from "../Menu";
import type { CanopBreadcrumbItem } from "./breadcrumbTypes";

export interface BreadcrumbCollapseProps {
  items: CanopBreadcrumbItem[];
  open: boolean;
  anchor: HTMLElement | null;
  onOpen: (event: MouseEvent<HTMLElement>) => void;
  onClose: () => void;
}

export function BreadcrumbCollapse({
  items,
  open,
  anchor,
  onOpen,
  onClose,
}: BreadcrumbCollapseProps) {
  const { t } = useTranslation();

  const selectItem = (item: CanopBreadcrumbItem) => {
    onClose();
    item.onClick?.();
  };

  return (
    <>
      <ButtonBase
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("canop.breadcrumb.expand")}
        onClick={onOpen}
        sx={{
          minWidth: "2rem",
          height: "1.75rem",
          ...squircleSurface({ radius: "var(--canop-radius-sm)", background: "transparent" }),
          borderRadius: "var(--canop-radius-sm)",
          color: "text.secondary",
          transition: "color var(--canop-motion-duration-fast) var(--canop-motion-ease-standard)",
          "&:hover": { color: "primary.main" },
          "&:focus-visible": focusRingSx,
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        }}
      >
        <Icon name="more" variant="outline" size="sm" color="inherit" />
      </ButtonBase>

      <Menu
        open={open}
        anchorEl={anchor}
        onClose={onClose}
        ariaLabel={t("canop.breadcrumb.expand")}
      >
        {items.map((item) => (
          <MenuItem
            key={item.id}
            label={item.label}
            icon={<Icon name={item.icon ?? "folder"} variant="outline" size="sm" color="inherit" />}
            onClick={() => selectItem(item)}
          />
        ))}
      </Menu>
    </>
  );
}
