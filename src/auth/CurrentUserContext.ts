import { createContext, useContext } from "react";

export const CurrentUserContext = createContext<unknown>(null);

export function useCurrentUser<TUser>(): TUser {
  const user = useContext(CurrentUserContext);
  if (user === null || user === undefined) {
    throw new Error("useCurrentUser doit etre utilise sous CurrentUserProvider");
  }
  return user as TUser;
}
