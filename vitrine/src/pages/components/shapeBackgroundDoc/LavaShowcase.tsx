import { Card, ShapeBackground, type CanopShapeBackgroundProps } from "@canop/ui";

export interface LavaShowcaseProps extends Pick<
  CanopShapeBackgroundProps,
  "color" | "density" | "intensity"
> {
  title: string;
  body: string;
}

export function LavaShowcase({ title, body, ...lava }: LavaShowcaseProps) {
  return (
    <ShapeBackground
      {...lava}
      animated
      minHeight="100%"
      sx={{ height: "100%" }}
      contentSx={{ maxWidth: "22rem" }}
    >
      <Card variant="frosted" title={title}>
        {body}
      </Card>
    </ShapeBackground>
  );
}
