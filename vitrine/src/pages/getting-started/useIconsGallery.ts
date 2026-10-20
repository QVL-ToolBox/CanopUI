import { useCallback, useMemo, useRef, useState } from "react";
import { icons, type CanopIconName, type CanopIconVariant } from "@canop/ui";

export interface UseIconsGalleryResult {
  search: string;
  setSearch: (value: string) => void;
  variant: CanopIconVariant;
  solid: boolean;
  setSolid: (value: boolean) => void;
  names: CanopIconName[];
  copiedName: CanopIconName | null;
  copyName: (name: CanopIconName) => void;
}

const allNames = Object.keys(icons) as CanopIconName[];

export function useIconsGallery(): UseIconsGalleryResult {
  const [search, setSearch] = useState("");
  const [solid, setSolid] = useState(false);
  const [copiedName, setCopiedName] = useState<CanopIconName | null>(null);
  const timerRef = useRef<number | null>(null);

  const names = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return allNames;
    return allNames.filter((name) => name.toLowerCase().includes(query));
  }, [search]);

  const copyName = useCallback((name: CanopIconName) => {
    void navigator.clipboard.writeText(`<Icon name="${name}" />`).then(() => {
      setCopiedName(name);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopiedName(null), 1600);
    });
  }, []);

  return {
    search,
    setSearch,
    variant: solid ? "solid" : "outline",
    solid,
    setSolid,
    names,
    copiedName,
    copyName,
  };
}
