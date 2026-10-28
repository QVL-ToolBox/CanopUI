import { useEffect, useState } from "react";
import { whenIdle } from "../../motion/whenIdle";

const IDLE_BUDGET = { timeout: 2000, fallbackDelay: 200 };

export function useIdleReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => whenIdle(() => setReady(true), IDLE_BUDGET), []);

  return ready;
}
