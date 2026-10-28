export type CanopShapeVariant = "hero" | "ambient" | "edge";

export interface ShapeLayout {
  minHeight: string;
  justifyContent: "center" | "flex-start";
  framePadding: string | number;
  contentPadding: string | number;
}

const centeredLayout: ShapeLayout = {
  minHeight: "100vh",
  justifyContent: "center",
  framePadding: "1rem",
  contentPadding: 0,
};

export const shapeLayouts: Record<CanopShapeVariant, ShapeLayout> = {
  hero: centeredLayout,
  ambient: centeredLayout,
  edge: {
    minHeight: "auto",
    justifyContent: "flex-start",
    framePadding: 0,
    contentPadding: "1rem",
  },
};
