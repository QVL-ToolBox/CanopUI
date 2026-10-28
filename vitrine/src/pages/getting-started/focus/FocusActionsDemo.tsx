import { Button, IconActionButton, Link, Pressable } from "@canop/ui";
import { FocusDemoSurface } from "./FocusDemoSurface";

export interface FocusActionsLabels {
  group: string;
  primary: string;
  tonal: string;
  ghost: string;
  text: string;
  add: string;
  favorite: string;
  link: string;
  swatch: string;
}

export interface FocusActionsDemoProps {
  labels: FocusActionsLabels;
  onActivate: () => void;
}

export function FocusActionsDemo({ labels, onActivate }: FocusActionsDemoProps) {
  return (
    <FocusDemoSurface ariaLabel={labels.group}>
      <Button onClick={onActivate}>{labels.primary}</Button>
      <Button variant="tonal" onClick={onActivate}>
        {labels.tonal}
      </Button>
      <Button variant="ghost" onClick={onActivate}>
        {labels.ghost}
      </Button>
      <Button variant="text" onClick={onActivate}>
        {labels.text}
      </Button>
      <IconActionButton icon="plus" ariaLabel={labels.add} onClick={onActivate} />
      <IconActionButton
        icon="star"
        variant="accent"
        ariaLabel={labels.favorite}
        onClick={onActivate}
      />
      <Link href="#/docs/focus">{labels.link}</Link>
      <Pressable
        radius="circle"
        size="2.5rem"
        background="var(--canop-palette-primary-light)"
        ariaLabel={labels.swatch}
        onClick={onActivate}
      />
    </FocusDemoSurface>
  );
}
