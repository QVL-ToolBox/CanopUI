import type { ReactNode } from "react";
import { RouteGuard } from "./RouteGuard";
import type { UseRouteGuardParams } from "./useRouteGuard";

export type CanopGuardLabel = string | (() => string);

export interface CanopCreateRouteGuardConfig<TUser> extends UseRouteGuardParams<TUser> {
  loadingLabel: CanopGuardLabel;
  errorLabel: CanopGuardLabel;
  renderForbidden: () => ReactNode;
  renderAuthorized?: () => ReactNode;
}

function resolveLabelDuringRender(label: CanopGuardLabel): string {
  return typeof label === "function" ? label() : label;
}

export function createRouteGuard<TUser>({
  loadingLabel,
  errorLabel,
  renderAuthorized,
  ...config
}: CanopCreateRouteGuardConfig<TUser>) {
  return function GuardedRoute({ children }: { children?: ReactNode }) {
    return (
      <RouteGuard<TUser>
        {...config}
        loadingLabel={resolveLabelDuringRender(loadingLabel)}
        errorLabel={resolveLabelDuringRender(errorLabel)}
        renderAuthorized={renderAuthorized ?? (() => children)}
      />
    );
  };
}
