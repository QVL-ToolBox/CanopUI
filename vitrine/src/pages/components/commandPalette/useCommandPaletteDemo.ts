import { useCallback, useState } from "react";
import { useCommandPalette, type CanopCommandItem } from "@canop/ui";

export interface UseCommandPaletteDemoResult {
  open: boolean;
  toggle: () => void;
  close: () => void;
  selectedLabel: string | null;
  select: (item: CanopCommandItem) => void;
  dismissSelection: () => void;
}

export function useCommandPaletteDemo(): UseCommandPaletteDemoResult {
  const { open, toggle, close } = useCommandPalette({ shortcut: false });
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const select = useCallback(
    (item: CanopCommandItem) => {
      close();
      setSelectedLabel(item.label);
    },
    [close],
  );

  const dismissSelection = useCallback(() => setSelectedLabel(null), []);

  return { open, toggle, close, selectedLabel, select, dismissSelection };
}
