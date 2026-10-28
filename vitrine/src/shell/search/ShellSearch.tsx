import Box from "@mui/material/Box";
import { CommandEmpty, LiveRegion } from "@canop/ui";
import { SearchField } from "./SearchField";
import { SearchResultsList } from "./SearchResultsList";
import { SearchResultsPanel } from "./SearchResultsPanel";
import { useShellSearch } from "./useShellSearch";

const SEARCH_MAX_WIDTH = "36rem";

export function ShellSearch() {
  const search = useShellSearch();

  return (
    <Box sx={{ position: "relative", width: "100%", maxWidth: SEARCH_MAX_WIDTH }}>
      <SearchField
        inputRef={search.inputRef}
        value={search.query}
        label={search.labels.field}
        placeholder={search.labels.placeholder}
        clearLabel={search.labels.clear}
        shortcutLabel={search.shortcutLabel}
        listboxId={search.listboxId}
        expanded={search.expanded}
        activeDescendant={search.activeDescendant}
        onChange={search.changeQuery}
        onClear={search.clear}
        onFocus={search.open}
        onBlur={search.close}
        onKeyDown={search.handleKeyDown}
        keepFocus={search.keepFocus}
      />
      {search.panelOpen ? (
        <SearchResultsPanel onMouseDown={search.keepFocus}>
          {search.expanded ? (
            <SearchResultsList
              id={search.listboxId}
              label={search.labels.results}
              groups={search.groups}
              activeIndex={search.activeIndex}
              optionId={search.optionId}
              onHighlight={search.highlight}
              onSelect={search.select}
            />
          ) : (
            <CommandEmpty announce={false}>{search.labels.empty}</CommandEmpty>
          )}
        </SearchResultsPanel>
      ) : null}
      <LiveRegion message={search.announcement} />
    </Box>
  );
}
