import { useEffect, useState } from "react";
import { networkConstraint, readNetworkConnection } from "./canopyNetwork";
import type { CanopyConstraint } from "./canopyQuality";

export function useNetworkConstraint(): CanopyConstraint | undefined {
  const [constraint, setConstraint] = useState(() => networkConstraint());

  useEffect(() => {
    const connection = readNetworkConnection();
    if (!connection) return;
    const onChange = () => setConstraint(networkConstraint(connection));
    connection.addEventListener("change", onChange);
    return () => connection.removeEventListener("change", onChange);
  }, []);

  return constraint;
}
