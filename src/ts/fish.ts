import {
  Actor,
  Color,
  KillEvent,
  Random,
  randomIntInRange,
  Sprite,
  Vector,
} from "excalibur";
import { FishData, fishList } from "./utils.ts";

export class Fish extends Actor {
  #fishData: FishData;
  points: number;
  name: string;
  #sprite: Sprite;
  #shadow: Sprite;

  constructor() {
    super({
      width: 4,
      height: 4,
    });

    const rand = new Random();

    // Weighted random pick based on chance
    const weightedList: FishData[] = [];
    for (const fish of fishList) {
      for (let i = 0; i < fish.chance; i++) {
        weightedList.push(fish);
      }
    }
    this.#fishData = rand.pickOne(weightedList);
    this.points = this.#fishData.points;
    this.name = this.#fishData.name;

    this.#sprite = this.#fishData.sprite;
    this.#shadow = this.#fishData.sprite.clone();
    this.#shadow.tint = new Color(0, 0, 0, 1);

    this.graphics.use(this.#shadow);
    this.scale = new Vector(3, 3);
    this.pos = new Vector(
      randomIntInRange(900, 1500),
      randomIntInRange(300, 600),
    );
    this.vel = new Vector(
      randomIntInRange(-10, -50),
      0,
    );
    this.events.on("exitviewport", (e) => this.#fishLeft(e));
    this.events.on("kill", (e) => this.#afterDeath(e));
  }
  // teleports fish to the right when exiting the screen
  #fishLeft(e) {
    e.target.pos = new Vector(
      randomIntInRange(800, 1000),
      randomIntInRange(300, 600),
    );
    this.vel = new Vector(
      randomIntInRange(-10, -50),
      0,
    );
  }
  // resets the fish after a catch
  #afterDeath(e: KillEvent) {
    this.pos = new Vector(
      randomIntInRange(800, 1000),
      randomIntInRange(300, 600),
    );
    this.vel = new Vector(
      randomIntInRange(-10, -50),
      0,
    );
    this.graphics.use(this.#shadow);
    this.scene?.engine.add(this);
  }
  
  // stops the fish and reveals the sprite
  stopMoving() {
    this.graphics.use(this.#sprite);
    this.vel = Vector.Zero;
  }
}