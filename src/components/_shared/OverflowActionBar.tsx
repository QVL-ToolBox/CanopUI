import Stack from "@mui/material/Stack";
import type { MouseEvent } from "react";
import { Button, type CanopButtonSize, type CanopButtonVariant } from "../Button";
import { Icon, type CanopIconName } from "../Icon";
import { IconActionButton } from "../IconActionButton";
import { Menu, MenuItem } from "../Menu";

export interface OverflowActionBarAction {
  id: string;
  label: string;
  icon?: CanopIconName;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  variant?: CanopButtonVariant;
}

export interface OverflowStateProps {
  compact: boolean;
  overflowOpen: boolean;
  overflowAnchor: HTMLElement | null;
  openOverflow: (event: MouseEvent<HTMLElement>) => void;
  closeOverflow: () => void;
}

export interface OverflowActionBarProps extends OverflowStateProps {
  visibleActions: OverflowActionBarAction[];
  overflowActions: OverflowActionBarAction[];
  actionVariant: CanopButtonVariant;
  actionSize: CanopButtonSize;
  moreActionsLabel: string;
}

export function OverflowActionBar({
  visibleActions,
  overflowActions,
  compact,
  overflowOpen,
  overflowAnchor,
  openOverflow,
  closeOverflow,
  actionVariant,
  actionSize,
  moreActionsLabel,
}: OverflowActionBarProps) {
  const runOverflowAction = (action: OverflowActionBarAction) => {
    closeOverflow();
    action.onClick();
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        alignItems: "center",
      }}
    >
      {visibleActions.map((action) =>
        compact && action.icon ? (
          <IconActionButton
            key={action.id}
            icon={action.icon}
            ariaLabel={action.label}
            variant={action.danger ? "danger" : "default"}
            disabled={action.disabled}
            onClick={action.onClick}
          />
        ) : (
          <Button
            key={action.id}
            variant={action.variant ?? (action.danger ? "danger" : actionVariant)}
            size={actionSize}
            disabled={action.disabled}
            startIcon={
              action.icon ? <Icon name={action.icon} variant="outline" size="sm" /> : undefined
            }
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ),
      )}

      {overflowActions.length > 0 && (
        <>
          <IconActionButton
            icon="more"
            ariaLabel={moreActionsLabel}
            variant="secondary"
            onClick={openOverflow}
          />
          <Menu
            open={overflowOpen}
            anchorEl={overflowAnchor}
            onClose={closeOverflow}
            ariaLabel={moreActionsLabel}
          >
            {overflowActions.map((action) => (
              <MenuItem
                key={action.id}
                label={action.label}
                disabled={action.disabled}
                danger={action.danger}
                icon={
                  action.icon ? (
                    <Icon name={action.icon} variant="outline" size="sm" color="inherit" />
                  ) : undefined
                }
                onClick={() => runOverflowAction(action)}
              />
            ))}
          </Menu>
        </>
      )}
    </Stack>
  );
}
