import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
} from "react";
import { useDocLocale } from "../../i18n/useDocLocale";
import { navigateTo } from "../../router/routes";
import { shellTexts } from "../shellTexts";
import { searchShortcutLabel } from "./searchShortcut";
import type { SearchResult, SearchResultGroup } from "./searchTypes";
import { useActiveResult, type ResultStep } from "./useActiveResult";
import { useSearchAnnouncement } from "./useSearchAnnouncement";
import { useSearchResults } from "./useSearchResults";
import { useSearchShortcut } from "./useSearchShortcut";

export interface ShellSearchLabels {
  field: string;
  placeholder: string;
  clear: string;
  results: string;
  empty: string;
}

export interface UseShellSearchResult {
  labels: ShellSearchLabels;
  shortcutLabel: string;
  inputRef: RefObject<HTMLInputElement | null>;
  query: string;
  announcement: string;
  groups: SearchResultGroup[];
  panelOpen: boolean;
  expanded: boolean;
  activeIndex: number;
  listboxId: string;
  activeDescendant: string | undefined;
  optionId: (index: number) => string;
  changeQuery: (value: string) => void;
  clear: () => void;
  highlight: (index: number) => void;
  select: (result: SearchResult) => void;
  open: () => void;
  close: () => void;
  keepFocus: (event: MouseEvent) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export function useShellSearch(): UseShellSearchResult {
  const t = shellTexts[useDocLocale()];
  const baseId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState(false);
  const { groups, results } = useSearchResults(query);
  const { activeIndex, setActiveIndex, move } = useActiveResult(results.length);
  const announcement = useSearchAnnouncement(query, results.length);
  const shortcutLabel = useMemo(searchShortcutLabel, []);
  useSearchShortcut(inputRef);

  const hasQuery = query.trim() !== "";
  const panelOpen = opened && hasQuery;
  const expanded = panelOpen && results.length > 0;
  const optionId = useCallback((index: number) => `${baseId}-option-${index}`, [baseId]);

  const changeQuery = useCallback(
    (value: string) => {
      setQuery(value);
      setActiveIndex(0);
      setOpened(true);
    },
    [setActiveIndex],
  );

  const clear = useCallback(() => {
    changeQuery("");
    inputRef.current?.focus();
  }, [changeQuery]);

  const select = useCallback(
    (result: SearchResult) => {
      navigateTo(result.entry.path);
      setQuery("");
      setActiveIndex(0);
      setOpened(false);
      inputRef.current?.blur();
    },
    [setActiveIndex],
  );

  const open = useCallback(() => setOpened(true), []);
  const close = useCallback(() => setOpened(false), []);
  const keepFocus = useCallback((event: MouseEvent) => event.preventDefault(), []);

  const dismiss = () => {
    if (panelOpen) setOpened(false);
    else if (hasQuery) changeQuery("");
    else inputRef.current?.blur();
  };

  const browse = (step: ResultStep) => {
    if (panelOpen) move(step);
    else setOpened(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    const activeResult = expanded ? results[activeIndex] : undefined;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      browse(event.key === "ArrowDown" ? 1 : -1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      dismiss();
    } else if (event.key === "Enter" && activeResult) {
      event.preventDefault();
      select(activeResult);
    }
  };

  return {
    labels: {
      field: t.searchLabel,
      placeholder: t.searchPlaceholder,
      clear: t.searchClear,
      results: t.searchResults,
      empty: t.searchEmpty(query.trim()),
    },
    shortcutLabel,
    inputRef,
    query,
    announcement,
    groups,
    panelOpen,
    expanded,
    activeIndex,
    listboxId: `${baseId}-listbox`,
    activeDescendant: expanded ? optionId(activeIndex) : undefined,
    optionId,
    changeQuery,
    clear,
    highlight: setActiveIndex,
    select,
    open,
    close,
    keepFocus,
    handleKeyDown,
  };
}
