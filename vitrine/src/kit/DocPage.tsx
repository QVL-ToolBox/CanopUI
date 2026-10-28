import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { DocPageHeader } from "./DocPageHeader";
import { DocToc } from "./DocToc";
import { useDocPage } from "./useDocPage";

export interface DocPageProps {
  title: string;
  intro: string;
  importCode?: string;
  children: ReactNode;
}

const READING_WIDTH = "52rem";
const TOC_WIDTH = "13rem";
const PAGE_WIDTH = "68rem";

export function DocPage({ title, intro, importCode, children }: DocPageProps) {
  const { articleRef, breadcrumb, withToc, tocLabel, toc } = useDocPage(title);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: withToc ? `minmax(0, 1fr) ${TOC_WIDTH}` : "minmax(0, 1fr)",
        columnGap: "3rem",
        alignItems: "start",
        minWidth: 0,
        width: "100%",
        maxWidth: PAGE_WIDTH,
        marginInline: "auto",
      }}
    >
      <Box
        ref={articleRef}
        component="article"
        sx={{
          minWidth: 0,
          width: "100%",
          maxWidth: READING_WIDTH,
          display: "flex",
          flexDirection: "column",
          gap: { xs: "2.5rem", md: "3.5rem" },
          "& [data-doc-section]": { scrollMarginTop: "1.5rem" },
        }}
      >
        <DocPageHeader
          title={title}
          intro={intro}
          importCode={importCode}
          breadcrumb={breadcrumb}
        />
        {children}
      </Box>
      {withToc ? (
        <DocToc
          label={tocLabel}
          entries={toc.entries}
          activeId={toc.activeId}
          onSelect={toc.scrollToSection}
        />
      ) : null}
    </Box>
  );
}
