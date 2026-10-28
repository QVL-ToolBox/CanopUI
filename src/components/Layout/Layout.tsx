import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Card } from "../Card";
import { ShapeBackground } from "../ShapeBackground";
import type { CanopBackgroundTone } from "../_shared/backgroundTone";
import type { CanopMainElement } from "../_shared/mainElement";
import type { CanopTitleLevel } from "../_shared/titleLevel";
import { LayoutBrand } from "./LayoutBrand";
import { LayoutUtilities } from "./LayoutUtilities";
import { useLayout } from "./useLayout";

export interface CanopLayoutProps {
  brand?: string;
  brandLevel?: CanopTitleLevel;
  logo?: ReactNode;
  header?: ReactNode;
  maxWidth?: string;
  animatedShapes?: boolean;
  backgroundTone?: CanopBackgroundTone;
  mainElement?: CanopMainElement;
  showUtilities?: boolean;
  children: ReactNode;
}

export function Layout({
  brand = "CustHome",
  brandLevel = 1,
  logo,
  header,
  maxWidth = "23.75rem",
  animatedShapes = false,
  backgroundTone = "primary",
  mainElement = "main",
  showUtilities = true,
  children,
}: CanopLayoutProps) {
  const { brandEntry, cardEntry, utilitiesEntry } = useLayout();

  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <ShapeBackground component={mainElement} animated={animatedShapes} color={backgroundTone}>
        {header !== undefined ? (
          header
        ) : (
          <LayoutBrand brand={brand} level={brandLevel} logo={logo} entry={brandEntry} />
        )}
        <motion.div
          style={{ width: "100%", maxWidth }}
          initial={cardEntry.initial}
          animate={cardEntry.animate}
          transition={cardEntry.transition}
        >
          <Card variant="floating">{children}</Card>
        </motion.div>
      </ShapeBackground>
      {showUtilities ? <LayoutUtilities entry={utilitiesEntry} /> : null}
    </Box>
  );
}
