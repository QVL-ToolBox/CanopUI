import { HalloweenFogBank } from "./HalloweenFogBank";
import { HalloweenGhost } from "./HalloweenGhost";
import { HalloweenHills } from "./HalloweenHills";
import type { HalloweenScene, HalloweenSide } from "./halloweenSceneTypes";
import { HalloweenSpiderWeb } from "./HalloweenSpiderWeb";
import { HalloweenTree } from "./HalloweenTree";

const TREE_SIDES: readonly HalloweenSide[] = ["left", "right"];

interface HalloweenMidgroundProps {
  scene: HalloweenScene;
  animated: boolean;
}

export function HalloweenMidground({ scene, animated }: HalloweenMidgroundProps) {
  return (
    <>
      <HalloweenHills />
      {TREE_SIDES.map((side) => (
        <HalloweenTree key={side} side={side} animated={animated} />
      ))}
      {scene.webs.map((spec) => (
        <HalloweenSpiderWeb key={spec.id} spec={spec} animated={animated} />
      ))}
      {scene.ghosts.mid.map((spec) => (
        <HalloweenGhost key={spec.id} spec={spec} animated={animated} />
      ))}
      <HalloweenFogBank depth="far" animated={animated} />
    </>
  );
}
