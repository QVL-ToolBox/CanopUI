import { useCallback, useState } from "react";
import { useCopyToClipboard } from "@canop/ui";

export interface UseDemoCardResult {
  showCode: boolean;
  toggleCode: () => void;
  copied: boolean;
  copy: () => void;
}

export function useDemoCard(code: string): UseDemoCardResult {
  const [showCode, setShowCode] = useState(false);
  const { copied, copy } = useCopyToClipboard(code.trim());
  const toggleCode = useCallback(() => setShowCode((value) => !value), []);
  return { showCode, toggleCode, copied, copy };
}
