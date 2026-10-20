import { useCallback, useState } from "react";

export interface UseBentoShowcaseResult {
  round: number;
  replay: () => void;
  alertsShown: boolean;
  toggleAlerts: () => void;
}

export function useBentoShowcase(): UseBentoShowcaseResult {
  const [round, setRound] = useState(0);
  const [alertsShown, setAlertsShown] = useState(true);

  const replay = useCallback(() => setRound((current) => current + 1), []);
  const toggleAlerts = useCallback(() => setAlertsShown((shown) => !shown), []);

  return { round, replay, alertsShown, toggleAlerts };
}
