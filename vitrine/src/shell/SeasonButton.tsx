import { IconActionButton } from "@canop/ui";
import { useSeasonToggle } from "./useSeasonToggle";

export function SeasonButton() {
  const { active, label, toggle } = useSeasonToggle();

  return (
    <IconActionButton
      icon="pumpkin"
      variant={active ? "accent" : "secondary"}
      ariaLabel={label}
      tooltip
      onClick={toggle}
    />
  );
}
