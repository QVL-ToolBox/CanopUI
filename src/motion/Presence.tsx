import { AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { staggerChildren } from "./staggerChildren";

export interface PresenceProps {
  /**
   * Des `PresenceItem` en enfants directs, chacun avec une `key` stable tirée
   * de la donnée (un id, jamais un index) : c'est la `key` qui dit qu'un
   * élément sort, et c'est l'enfant direct qui joue sa sortie.
   */
  children: ReactNode;
  /**
   * `"sync"` fait entrer et sortir en même temps ; `"wait"` attend la fin de
   * la sortie avant l'entrée, pour une permutation à un seul enfant (une liste
   * qui laisse place à un état vide).
   */
  mode?: "sync" | "wait";
  stagger?: number;
  appear?: boolean;
}

export function Presence({ children, mode = "sync", stagger = 0, appear = false }: PresenceProps) {
  return (
    <AnimatePresence mode={mode} initial={appear}>
      {staggerChildren(children, stagger)}
    </AnimatePresence>
  );
}
