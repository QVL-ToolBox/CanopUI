import { useCallback } from "react";
import { navigateTo } from "./navigation";

export interface UseLogoutParams {
  logout: () => Promise<unknown>;
  loginUrl: () => string;
}

export function useLogout({ logout, loginUrl }: UseLogoutParams): () => Promise<void> {
  return useCallback(async () => {
    try {
      await logout();
    } finally {
      navigateTo(loginUrl());
    }
  }, [logout, loginUrl]);
}
