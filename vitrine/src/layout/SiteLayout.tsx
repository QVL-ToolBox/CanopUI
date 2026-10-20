import Box from "@mui/material/Box";
import { Suspense, type ReactNode } from "react";
import { Spinner, Stack } from "@canop/ui";
import { SiteHeader } from "./SiteHeader";
import { SiteSidebar } from "./SiteSidebar";

export interface SiteLayoutProps {
  activePath: string;
  withSidebar: boolean;
  children: ReactNode;
}

function LoadingFallback() {
  return (
    <Stack alignItems="center" justifyContent="center" padding="xl">
      <Spinner />
    </Stack>
  );
}

export function SiteLayout({ activePath, withSidebar, children }: SiteLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SiteHeader activePath={activePath} />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          width: "100%",
          maxWidth: "96rem",
          marginX: "auto",
        }}
      >
        {withSidebar ? <SiteSidebar activePath={activePath} /> : null}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            padding: withSidebar ? { xs: "1.5rem 1.25rem", md: "2.5rem 3rem" } : 0,
          }}
        >
          <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
        </Box>
      </Box>
    </Box>
  );
}
