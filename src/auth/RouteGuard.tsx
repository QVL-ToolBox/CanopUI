import type { ReactNode } from "react";
import { Spinner } from "../components/Spinner";
import { Feedback } from "../components/Feedback";
import { CurrentUserProvider } from "./CurrentUserProvider";
import { useRouteGuard, type UseRouteGuardParams } from "./useRouteGuard";

export interface CanopRouteGuardProps<TUser> extends UseRouteGuardParams<TUser> {
  loadingLabel: string;
  errorLabel: string;
  renderForbidden: () => ReactNode;
  renderAuthorized: () => ReactNode;
}

export function RouteGuard<TUser>({
  fetchUser,
  hasAccess,
  isUnauthorizedError,
  onUnauthorized,
  loadingLabel,
  errorLabel,
  renderForbidden,
  renderAuthorized,
}: CanopRouteGuardProps<TUser>) {
  const state = useRouteGuard<TUser>({
    fetchUser,
    hasAccess,
    isUnauthorizedError,
    onUnauthorized,
  });

  if (state.status === "loading") {
    return <Spinner fullPage ariaLabel={loadingLabel} />;
  }
  if (state.status === "error") {
    return <Feedback severity="error">{errorLabel}</Feedback>;
  }
  if (state.status === "forbidden") {
    return <>{renderForbidden()}</>;
  }
  return <CurrentUserProvider value={state.user}>{renderAuthorized()}</CurrentUserProvider>;
}
