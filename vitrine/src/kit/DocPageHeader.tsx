import Box from "@mui/material/Box";
import {
  Breadcrumb,
  Heading,
  Stack,
  Text,
  avoidPageTopRight,
  type CanopBreadcrumbItem,
} from "@canop/ui";
import { CodeBlock } from "./CodeBlock";

export interface DocPageHeaderProps {
  title: string;
  intro: string;
  importCode?: string;
  breadcrumb: CanopBreadcrumbItem[];
}

const CLEAR_OF_PAGE_UTILITIES = avoidPageTopRight("0rem");

export function DocPageHeader({ title, intro, importCode, breadcrumb }: DocPageHeaderProps) {
  return (
    <Stack gap="lg">
      <Box sx={{ minWidth: 0, paddingRight: CLEAR_OF_PAGE_UTILITIES }}>
        <Stack gap="sm">
          {breadcrumb.length > 0 ? <Breadcrumb items={breadcrumb} /> : null}
          <Heading level={1} size={{ xs: 4, md: 3 }} gutterBottom={false}>
            {title}
          </Heading>
          <Text variant="lead" tone="muted">
            {intro}
          </Text>
        </Stack>
      </Box>
      {importCode ? <CodeBlock code={importCode} /> : null}
    </Stack>
  );
}
