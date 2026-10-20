import { useCallback, useEffect, useRef, useState } from "react";

export interface UseHeroDemoResult {
  email: string;
  setEmail: (value: string) => void;
  notifications: boolean;
  setNotifications: (value: boolean) => void;
  progress: number;
  sending: boolean;
  sent: boolean;
  send: () => void;
}

export function useHeroDemo(): UseHeroDemoResult {
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [progress, setProgress] = useState(0);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    },
    [],
  );

  const send = useCallback(() => {
    setSending(true);
    setSent(false);
    setProgress(0);
    timerRef.current = window.setInterval(() => {
      setProgress((value) => {
        const next = value + 12;
        if (next >= 100) {
          if (timerRef.current !== null) window.clearInterval(timerRef.current);
          setSending(false);
          setSent(true);
          return 100;
        }
        return next;
      });
    }, 120);
  }, []);

  return { email, setEmail, notifications, setNotifications, progress, sending, sent, send };
}
