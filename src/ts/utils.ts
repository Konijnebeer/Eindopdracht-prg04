import { Sprite } from "excalibur";
import { Resources } from "./resources.ts";

export type FishData = {
  name: string;
  sprite: Sprite;
  points: number;
  chance: number;
};

// Data Objects for the diffrent types of fish
export const fishList: FishData[] = [
  {
    name: "Clownfish",
    sprite: new Sprite({
      image: Resources.FishMap,
      sourceView: {
        x: 16 * 1,
        y: 16 * 0,
        width: 16,
        height: 16,
      },
    }),
    points: 1,
    chance: 4,
  },
  {
    name: "Flounder",
    sprite: new Sprite({
      image: Resources.FishMap,
      sourceView: {
        x: 16 * 2,
        y: 16 * 0,
        width: 16,
        height: 16,
      },
    }),
    points: 2,
    chance: 2,
  },
  {
    name: "Trashbag",
    sprite: new Sprite({
      image: Resources.FishMap,
      sourceView: {
        x: 16 * 3,
        y: 16 * 2,
        width: 16,
        height: 16,
      },
    }),
    points: -2,
    chance: 1,
  },
];