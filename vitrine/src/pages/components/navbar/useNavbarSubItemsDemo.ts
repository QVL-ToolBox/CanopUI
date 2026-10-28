import { useState } from "react";

export interface UseNavbarSubItemsDemoResult {
  activeHref: string;
  navigate: (href: string) => void;
}

export function useNavbarSubItemsDemo(initialHref: string): UseNavbarSubItemsDemoResult {
  const [activeHref, navigate] = useState(initialHref);
  return { activeHref, navigate };
}
