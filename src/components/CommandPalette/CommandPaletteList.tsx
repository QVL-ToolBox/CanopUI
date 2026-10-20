import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { tokens } from "../../tokens";
import { overlineSx } from "../_shared/overlineSx";
import { CommandPaletteOption } from "./CommandPaletteOption";
import type { CanopCommandItem } from "./commandPaletteTypes";
import type { CommandPaletteGroup } from "./useCommandPaletteController";

export interface CommandPaletteListProps {
  id: string;
  groups: CommandPaletteGroup[];
  activeIndex: number;
  emptyLabel: string;
  optionId: (index: number) => string;
  onHighlight: (index: number) => void;
  onSelect: (item: CanopCommandItem) => void;
}

export function CommandPaletteList({
  id,
  groups,
  activeIndex,
  emptyLabel,
  optionId,
  onHighlight,
  onSelect,
}: CommandPaletteListProps) {
  if (groups.length === 0) {
    return (
      <Box role="status" id={id} sx={{ px: tokens.spacing.md, py: tokens.spacing.xl }}>
        <Typography
          variant="body2"
          align="center"
          sx={{
            color: "text.secondary",
          }}
        >
          {emptyLabel}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      role="listbox"
      id={id}
      sx={{
        maxHeight: "24rem",
        overflowY: "auto",
        px: tokens.spacing.xs,
        py: tokens.spacing.xs,
      }}
    >
      {groups.map((group) => (
        <Box key={group.key}>
          {group.label ? (
            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                px: tokens.spacing.md,
                pt: tokens.spacing.sm,
                pb: tokens.spacing["2xs"],
                ...overlineSx,
              }}
            >
              {group.label}
            </Typography>
          ) : null}
          {group.items.map((item, itemIndex) => {
            const index = group.startIndex + itemIndex;
            return (
              <CommandPaletteOption
                key={item.id}
                item={item}
                id={optionId(index)}
                active={index === activeIndex}
                onHighlight={() => onHighlight(index)}
                onSelect={() => onSelect(item)}
              />
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
