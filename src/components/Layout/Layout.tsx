import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Card } from "../Card";
import { ShapeBackground } from "../ShapeBackground";
import { LayoutBrand } from "./LayoutBrand";
import { LayoutUtilities } from "./LayoutUtilities";
import { useLayout } from "./useLayout";

const HERO_INTENSITY = 1.05;

export interface CanopLayoutProps {
  brand?: string;
  logo?: ReactNode;
  header?: ReactNode;
  maxWidth?: string;
  animatedShapes?: boolean;
  showUtilities?: boolean;
  children: ReactNode;
}

export function Layout({
  brand = "CustHome",
  logo,
  header,
  maxWidth = "23.75rem",
  animatedShapes = false,
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
      <ShapeBackground
        component="main"
        variant="hero"
        intensity={HERO_INTENSITY}
        animated={animatedShapes}
      >
        {header !== undefined ? (
          header
        ) : (
          <LayoutBrand brand={brand} logo={logo} entry={brandEntry} />
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
