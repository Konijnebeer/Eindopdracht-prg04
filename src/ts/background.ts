import { Actor, Animation, range, SpriteSheet, Vector } from "excalibur";
import { Resources } from "./resources";

export class Background extends Actor {
  #sprite: Animation;
  constructor() {
    super({
      pos: new Vector(400, 300)
    }
    );
    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.Beach,
      grid: {
        rows: 1,
        columns: 4,
        spriteWidth: 273,
        spriteHeight: 205,
      },
    });

    this.#sprite = Animation.fromSpriteSheet(
      spriteSheet,
      range(0, 3),
      200,
    );
    this.graphics.use(this.#sprite);
    this.scale = new Vector(3, 3);
  }
}