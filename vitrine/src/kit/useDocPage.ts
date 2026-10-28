import { useRef, type RefObject } from "react";
import { useBreakpointUp, type CanopBreadcrumbItem } from "@canop/ui";
import { useDocLocale } from "../i18n/useDocLocale";
import { docKitTexts } from "./docKitTexts";
import { useDocBreadcrumb } from "./useDocBreadcrumb";
import { useDocToc, type UseDocTocResult } from "./useDocToc";

export interface UseDocPageResult {
  articleRef: RefObject<HTMLElement | null>;
  breadcrumb: CanopBreadcrumbItem[];
  withToc: boolean;
  tocLabel: string;
  toc: UseDocTocResult;
}

export function useDocPage(title: string): UseDocPageResult {
  const locale = useDocLocale();
  const articleRef = useRef<HTMLElement | null>(null);
  const withToc = useBreakpointUp("lg");
  const breadcrumb = useDocBreadcrumb(title);
  const toc = useDocToc({ articleRef, enabled: withToc, revision: `${locale}:${title}` });

  return { articleRef, breadcrumb, withToc, tocLabel: docKitTexts[locale].onThisPage, toc };
}
