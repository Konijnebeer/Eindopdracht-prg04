import {
  Actor,
  Animation,
  Engine,
  Keys,
  range,
  SpriteSheet,
  Vector,
} from "excalibur";
import { Resources } from "../resources.ts";
import { Dobber } from "./dobber.ts";


type PlayerControls = {
  left: Keys;
  right: Keys;
  rod: Keys;
  catch: Keys;
}

const Controls: { player1: PlayerControls, player2: PlayerControls } = {
  player1: {
    left: Keys.A,
    right: Keys.D,
    rod: Keys.W,
    catch: Keys.S,
  },
  player2: {
    left: Keys.Left,
    right: Keys.Right,
    rod: Keys.Up,
    catch: Keys.Down,
  },
};

export class Player extends Actor {
  #isCharging: boolean;
  #reelStrength: number;
  #activeDobber: Dobber | null;
  #idleAnimation: Animation;
  playerNumber: number;
  controls: PlayerControls;

  constructor(
    playerNumber: number,
  ) {
    super({
      pos: new Vector(300 * playerNumber, 200),
      anchor: new Vector(0.7, 0.9),
      width: 16,
      height: 16,
    });
    this.playerNumber = playerNumber;
    this.controls = playerNumber === 1 ? Controls.player1 : Controls.player2;

    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.FisherMan,
      grid: {
        rows: 1,
        columns: 4,
        spriteWidth: 48,
        spriteHeight: 48,
      },
    });

    this.#idleAnimation = Animation.fromSpriteSheet(
      spriteSheet,
      range(0, 3),
      200,
    );

    this.graphics.use(this.#idleAnimation);
    this.scale = new Vector(3, 3);
  }

  onPreUpdate(engine: Engine): void {
    const input = engine.input;
    let xspeed = 0;
    let yspeed = 0;
    
    if (input.keyboard.isHeld(this.controls.left) && this.pos.x > 0) {
      xspeed = -1;
    }
    if (input.keyboard.isHeld(this.controls.right) && this.pos.x < 800) {
      xspeed = 1;
    }
    let movement = new Vector(xspeed, yspeed).normalize().scale(300);
    this.vel = movement;


    // Handle fishing rod cast
    // Start charging only if there is no active dobber and space is pressed
    if (input.keyboard.wasPressed(this.controls.rod) && !this.#activeDobber) {
      this.#isCharging = true;
      this.#reelStrength = 0;
    }

    // Increase strength while space is held
    if (input.keyboard.isHeld(this.controls.rod) && this.#isCharging) {
      this.#reelStrength += 1; // Increase based on time passed
      // max strenght
      if (this.#reelStrength > 130) {
        this.#reelStrength = 130;
      }
    }

    // Release the cast when space is released
    if (input.keyboard.wasReleased(this.controls.rod) && this.#isCharging) {
      // Create dobber with current strength
      if (this.#reelStrength < 20) { // atleast 20 to not cast it after just realing in
        return;
      }
      const dobber = new Dobber(
        this.#reelStrength,
        this.pos.x,
        this.pos.y,
        this,
      );
      engine.add(dobber)
      // this.addChild(dobber);
      this.#activeDobber = dobber; // Track the active dobber

      // Set activeDobber to null when dobber is killed
      dobber.on("kill", () => {
        if (this.#activeDobber === dobber) {
          this.#activeDobber = null;
        }
      });

      this.#isCharging = false;
    }
  }
}
