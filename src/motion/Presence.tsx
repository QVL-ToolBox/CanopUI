import { AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { staggerChildren } from "./staggerChildren";

export interface PresenceProps {
  children: ReactNode;
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
