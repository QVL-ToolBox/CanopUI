import { useCallback, useState } from "react";

export interface UseFocusPlaygroundResult {
  activations: number;
  activate: () => void;
  view: string;
  setView: (view: string) => void;
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
  accepted: boolean;
  setAccepted: (accepted: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  name: string;
  setName: (name: string) => void;
  fruit: string;
  setFruit: (fruit: string) => void;
}

export function useFocusPlayground(): UseFocusPlaygroundResult {
  const [activations, setActivations] = useState(0);
  const [view, setView] = useState("grid");
  const [notifications, setNotifications] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [volume, setVolume] = useState(40);
  const [name, setName] = useState("");
  const [fruit, setFruit] = useState("apple");

  const activate = useCallback(() => setActivations((count) => count + 1), []);

  return {
    activations,
    activate,
    view,
    setView,
    notifications,
    setNotifications,
    accepted,
    setAccepted,
    volume,
    setVolume,
    name,
    setName,
    fruit,
    setFruit,
  };
}
