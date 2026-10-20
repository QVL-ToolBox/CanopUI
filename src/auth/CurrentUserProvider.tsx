import type { ReactNode } from "react";
import { CurrentUserContext } from "./CurrentUserContext";

export interface CanopCurrentUserProviderProps<TUser> {
  value: TUser;
  children: ReactNode;
}

export function CurrentUserProvider<TUser>({
  value,
  children,
}: CanopCurrentUserProviderProps<TUser>) {
  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}
