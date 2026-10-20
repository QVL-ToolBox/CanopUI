import { useEffect, useRef, useState } from "react";

export type CanopRouteGuardState<TUser> =
  | { status: "loading" }
  | { status: "ok"; user: TUser }
  | { status: "forbidden" }
  | { status: "error" };

export interface UseRouteGuardParams<TUser> {
  fetchUser: () => Promise<TUser>;
  hasAccess: (user: TUser) => boolean;
  isUnauthorizedError: (error: unknown) => boolean;
  onUnauthorized: () => void;
}

type RouteGuardOutcome<TUser> =
  { status: "loading" } | { status: "loaded"; user: TUser } | { status: "error" };

interface RouteGuardErrorHandlers {
  isUnauthorizedError: (error: unknown) => boolean;
  onUnauthorized: () => void;
}

export function useRouteGuard<TUser>({
  fetchUser,
  hasAccess,
  isUnauthorizedError,
  onUnauthorized,
}: UseRouteGuardParams<TUser>): CanopRouteGuardState<TUser> {
  const [outcome, setOutcome] = useState<RouteGuardOutcome<TUser>>({ status: "loading" });
  const errorHandlersRef = useRef<RouteGuardErrorHandlers>({
    isUnauthorizedError,
    onUnauthorized,
  });

  useEffect(() => {
    errorHandlersRef.current = { isUnauthorizedError, onUnauthorized };
  });

  useEffect(() => {
    let active = true;
    setOutcome((current) => (current.status === "loading" ? current : { status: "loading" }));
    fetchUser()
      .then((user) => {
        if (!active) return;
        setOutcome({ status: "loaded", user });
      })
      .catch((error: unknown) => {
        if (!active) return;
        const handlers = errorHandlersRef.current;
        if (handlers.isUnauthorizedError(error)) {
          handlers.onUnauthorized();
          return;
        }
        setOutcome({ status: "error" });
      });
    return () => {
      active = false;
    };
  }, [fetchUser]);

  if (outcome.status !== "loaded") return outcome;
  return hasAccess(outcome.user) ? { status: "ok", user: outcome.user } : { status: "forbidden" };
}
