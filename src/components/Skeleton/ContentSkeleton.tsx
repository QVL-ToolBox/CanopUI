import Box from "@mui/material/Box";
import { useTranslation } from "../../i18n";
import { CardBodySkeleton } from "./CardBodySkeleton";
import { ListSkeleton } from "./ListSkeleton";
import { PageSkeleton } from "./PageSkeleton";

export type CanopContentSkeletonShape = "card" | "list" | "page";

export interface CanopContentSkeletonProps {
  shape: CanopContentSkeletonShape;
  ariaLabel?: string;
}

function ShapeOf({ shape }: { shape: CanopContentSkeletonShape }) {
  switch (shape) {
    case "card":
      return <CardBodySkeleton />;
    case "list":
      return <ListSkeleton />;
    case "page":
      return <PageSkeleton />;
  }
}

export function ContentSkeleton({ shape, ariaLabel }: CanopContentSkeletonProps) {
  const { t } = useTranslation();
  return (
    <Box
      role="progressbar"
      aria-busy
      aria-label={ariaLabel ?? t("canop.spinner.loading")}
      data-skeleton={shape}
      sx={{ width: "100%", alignSelf: "stretch", marginBlockEnd: "auto", textAlign: "left" }}
    >
      <ShapeOf shape={shape} />
    </Box>
  );
}
