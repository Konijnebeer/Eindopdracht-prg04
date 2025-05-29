import { Actor, Engine, Keys, Sprite, Timer, Vector } from "excalibur";
import { Resources } from "../resources.ts";
import { Player } from "./player.ts";
import { Fish } from "../fish.ts";
import { Game } from "../game.ts";

export class Dobber extends Actor {
  #sprite: Sprite;
  #player: Player;
  // vars for casting the line
  #strenght: number;
  #isMovingDown: boolean = true;
  #castElapsed: number = 0;
  // vars for catching a fish
  #catchingFish: Fish | null = null;
  #catchTimer: number = 0;
  #catchWindowDuration: number = 1000; // 1 second catch window

  constructor(
    strenght: number,
    playerX: number,
    playerY: number,
    player: Player,
  ) {
    super({
      width: 8,
      height: 8,
    });
    this.pos = new Vector(playerX, playerY);
    this.#strenght = strenght;
    this.#player = player;
  }

  onInitialize(engine: Engine) {
    this.#sprite = new Sprite({
      image: Resources.FishMap,
      sourceView: {
        x: 16 * 3,
        y: 16 * 3,
        width: 16,
        height: 16,
      },
    });
    this.graphics.use(this.#sprite);

    // Move down for 3 seconds
    this.vel = new Vector(0, this.#strenght);
    this.#isMovingDown = true;

    const stopTimer = new Timer({
      fcn: () => {
        this.vel = Vector.Zero;
        this.scale = new Vector(3, 3);
        this.#isMovingDown = false;
      },
      repeats: false,
      interval: 3000,
    });
    engine.add(stopTimer);
    stopTimer.start();

    // Collision handler
    this.on("collisionstart", (e) => {
      // Only trigger if not moving down and the other is a Fish
      if (!this.#isMovingDown && e.other.owner instanceof Fish) {
        this.onCatchFish(e.other.owner as Fish);
      } // Remove the dobber when it's fully reeled in
      if (!this.#isMovingDown && e.other.owner instanceof Player) {
        this.kill();
        console.log("reeledIn");
      }
    });
  }

  // Start the catch timer
  onCatchFish(fish: Fish) {
    fish.stopMoving();
    this.scale = new Vector(2.7, 2.7);
    this.#catchTimer = 0;
    this.#catchingFish = fish;
  }

  onPreUpdate(engine: Engine, delta: number) {
    // Throwing animation
    if (this.#isMovingDown) {
      this.#castElapsed += delta;
      // Calculate t (0 to 1 over 3 seconds)
      const t = Math.min(this.#castElapsed / 3000, 1);
      // Quadratic Bezier:
      const scaleValue = (1 - t) * (1 - t) * 1 + 2 * (1 - t) * t * 2 + t * t * 1;
      this.scale = new Vector(scaleValue * 3, scaleValue * 3);
    }

    // Reeling in towards player
    if (
      !this.#isMovingDown &&
      engine.input.keyboard.isHeld(this.#player.controls.rod)
    ) {
      const target = this.#player.pos;
      const direction = target.sub(this.pos).normalize();
      this.vel = direction.scale(60);
    } else if (!this.#isMovingDown) {
      this.vel = Vector.Zero;
    }

    // catching logic
    if (this.#catchingFish) {
      // Update catch timer
      this.#catchTimer += delta;
      const engine = this.scene?.engine as Game; // for type safety

      // Check for the catch key press to catch fish
      if (engine.input.keyboard.wasPressed(this.#player.controls.catch)) {
        // Fish caught
        engine.scoreUI.updateScore(
          this.#catchingFish.points,
          this.#catchingFish.name,
          this.#player.playerNumber,
        );

        this.#catchingFish.kill();
        this.kill();
        return;
      }

      // Check if catch window has passed
      if (this.#catchTimer >= this.#catchWindowDuration) {
        // Fish got away
        engine.scoreUI.fishGotAway(this.#player.playerNumber);
        this.#catchingFish.kill();
        this.kill();
      }
    }
  }
}
