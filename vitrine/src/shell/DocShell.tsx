import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import {
  PageContent,
  PageScaffold,
  withoutFocusRing,
  type CanopPageContentMaxWidth,
} from "@canop/ui";
import { ActivePathContext } from "../router/ActivePathContext";
import { SeasonButton } from "./SeasonButton";
import { ShellSearchBar } from "./search/ShellSearchBar";
import { useDocShell } from "./useDocShell";
import { usePageHeadingFocus } from "./usePageHeadingFocus";

export interface DocShellProps {
  activePath: string;
  contentWidth: CanopPageContentMaxWidth;
  children: ReactNode;
}

export function DocShell({ activePath, contentWidth, children }: DocShellProps) {
  const shell = useDocShell(activePath);
  const contentRef = usePageHeadingFocus(activePath);

  return (
    <PageScaffold
      items={shell.navbarItems}
      activeHref={shell.activeHref}
      navbarTitle={shell.texts.brand}
      navbarTitleLevel="text"
      background="shapes"
      backgroundTone="accent"
      actionsPlacement="floating"
      headerActions={<SeasonButton />}
    >
      <ShellSearchBar />
      <PageContent key={activePath} maxWidth={contentWidth} skeleton={false}>
        <ActivePathContext.Provider value={activePath}>
          <Box ref={contentRef} sx={{ display: "contents", "& h1": withoutFocusRing }}>
            {children}
          </Box>
        </ActivePathContext.Provider>
      </PageContent>
    </PageScaffold>
  );
}
