import { useCallback, useEffect, useId, useMemo, useState, type KeyboardEvent } from "react";
import type { CanopCommandItem } from "./commandPaletteTypes";

export interface CommandPaletteGroup {
  key: string;
  label?: string;
  startIndex: number;
  items: CanopCommandItem[];
}

export interface UseCommandPaletteControllerParams {
  open: boolean;
  items: CanopCommandItem[];
  onClose: () => void;
  onSelect?: (item: CanopCommandItem) => void;
}

export interface UseCommandPaletteControllerResult {
  query: string;
  setQuery: (value: string) => void;
  groups: CommandPaletteGroup[];
  filtered: CanopCommandItem[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  select: (item: CanopCommandItem) => void;
  optionId: (index: number) => string;
  activeDescendant: string | undefined;
}

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

function matches(item: CanopCommandItem, query: string): boolean {
  const haystack = normalize([item.label, item.group ?? "", ...(item.keywords ?? [])].join(" "));
  return haystack.includes(query);
}

export function useCommandPaletteController({
  open,
  items,
  onClose,
  onSelect,
}: UseCommandPaletteControllerParams): UseCommandPaletteControllerResult {
  const baseId = useId();
  const [query, setQueryState] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setQueryState("");
      setActiveIndex(0);
    }
  }, [open]);

  const groups = useMemo<CommandPaletteGroup[]>(() => {
    const normalized = normalize(query);
    const found = normalized ? items.filter((item) => matches(item, normalized)) : items;
    const order: { key: string; label?: string }[] = [];
    const buckets = new Map<string, CanopCommandItem[]>();
    for (const item of found) {
      const key = item.group ?? "";
      const bucket = buckets.get(key);
      if (bucket) {
        bucket.push(item);
      } else {
        buckets.set(key, [item]);
        order.push({ key, label: item.group });
      }
    }
    let cursor = 0;
    return order.map(({ key, label }) => {
      const groupItems = buckets.get(key) ?? [];
      const group: CommandPaletteGroup = { key, label, startIndex: cursor, items: groupItems };
      cursor += groupItems.length;
      return group;
    });
  }, [items, query]);

  const filtered = useMemo(() => groups.flatMap((group) => group.items), [groups]);

  useEffect(() => {
    if (activeIndex > 0 && activeIndex >= filtered.length) setActiveIndex(0);
  }, [filtered.length, activeIndex]);

  const setQuery = useCallback((value: string) => {
    setQueryState(value);
    setActiveIndex(0);
  }, []);

  const select = useCallback(
    (item: CanopCommandItem) => {
      item.onSelect?.();
      onSelect?.(item);
      onClose();
    },
    [onSelect, onClose],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (filtered.length === 0) return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((current) => (current + 1) % filtered.length);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((current) => (current - 1 + filtered.length) % filtered.length);
      } else if (event.key === "Enter") {
        event.preventDefault();
        const item = filtered[activeIndex];
        if (item) select(item);
      }
    },
    [filtered, activeIndex, select],
  );

  const optionId = useCallback((index: number) => `${baseId}-option-${index}`, [baseId]);

  const activeDescendant = filtered.length > 0 ? optionId(activeIndex) : undefined;

  return {
    query,
    setQuery,
    groups,
    filtered,
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    select,
    optionId,
    activeDescendant,
  };
}
