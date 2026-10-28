import { useState } from "react";

export interface UseNeonShowcaseResult {
  notifications: boolean;
  setNotifications: (value: boolean) => void;
  remember: boolean;
  setRemember: (value: boolean) => void;
}

export function useNeonShowcase(): UseNeonShowcaseResult {
  const [notifications, setNotifications] = useState(true);
  const [remember, setRemember] = useState(true);
  return { notifications, setNotifications, remember, setRemember };
}
