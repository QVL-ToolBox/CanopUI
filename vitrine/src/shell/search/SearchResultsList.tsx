import { CommandGroup, CommandList, CommandOption } from "@canop/ui";
import { HighlightedText } from "./HighlightedText";
import type { SearchResult, SearchResultGroup } from "./searchTypes";

const LIST_MAX_HEIGHT = "min(24rem, calc(100dvh - 11rem))";

export interface SearchResultsListProps {
  id: string;
  label: string;
  groups: SearchResultGroup[];
  activeIndex: number;
  optionId: (index: number) => string;
  onHighlight: (index: number) => void;
  onSelect: (result: SearchResult) => void;
}

export function SearchResultsList({
  id,
  label,
  groups,
  activeIndex,
  optionId,
  onHighlight,
  onSelect,
}: SearchResultsListProps) {
  return (
    <CommandList id={id} ariaLabel={label} maxHeight={LIST_MAX_HEIGHT}>
      {groups.map((group) => (
        <CommandGroup key={group.label} label={group.label}>
          {group.results.map((result, offset) => {
            const index = group.startIndex + offset;
            return (
              <CommandOption
                key={result.entry.path}
                id={optionId(index)}
                label={<HighlightedText text={result.entry.title} ranges={result.highlights} />}
                icon={result.entry.icon}
                meta={result.entry.group}
                active={index === activeIndex}
                onHighlight={() => onHighlight(index)}
                onSelect={() => onSelect(result)}
              />
            );
          })}
        </CommandGroup>
      ))}
    </CommandList>
  );
}
