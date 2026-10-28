import { useEffect, useState } from "react";

export interface HashRoute {
  path: string;
  segments: string[];
}

function parseHash(): HashRoute {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const segments = raw.split("?")[0].split("/").filter(Boolean);
  return { path: `/${segments.join("/")}`, segments };
}

export function useHashRoute(): HashRoute {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return route;
}
