import { useCallback, useState } from "react";

export interface UseLiveDemoGateResult {
  active: boolean;
  toggle: () => void;
}

export function useLiveDemoGate(): UseLiveDemoGateResult {
  const [active, setActive] = useState(false);
  const toggle = useCallback(() => setActive((value) => !value), []);
  return { active, toggle };
}
