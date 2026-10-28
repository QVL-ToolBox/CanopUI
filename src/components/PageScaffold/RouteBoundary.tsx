import { Suspense, type ReactNode } from "react";
import { RouteSkeleton } from "./RouteSkeleton";

interface RouteBoundaryProps {
  enabled: boolean;
  children: ReactNode;
}

export function RouteBoundary({ enabled, children }: RouteBoundaryProps) {
  if (!enabled) return children;
  return <Suspense fallback={<RouteSkeleton />}>{children}</Suspense>;
}
