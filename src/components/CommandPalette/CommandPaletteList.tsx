import { CommandEmpty } from "./CommandEmpty";
import { CommandGroup } from "./CommandGroup";
import { CommandList } from "./CommandList";
import { CommandOption } from "./CommandOption";
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
  if (groups.length === 0) return <CommandEmpty id={id}>{emptyLabel}</CommandEmpty>;

  return (
    <CommandList id={id}>
      {groups.map((group) => (
        <CommandGroup key={group.key} label={group.label}>
          {group.items.map((item, itemIndex) => {
            const index = group.startIndex + itemIndex;
            return (
              <CommandOption
                key={item.id}
                id={optionId(index)}
                label={item.label}
                icon={item.icon}
                meta={item.group}
                active={index === activeIndex}
                onHighlight={() => onHighlight(index)}
                onSelect={() => onSelect(item)}
              />
            );
          })}
        </CommandGroup>
      ))}
    </CommandList>
  );
}
