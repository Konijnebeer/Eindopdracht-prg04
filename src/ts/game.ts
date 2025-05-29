import "../styles/style.css";
import { DisplayMode, Engine, Timer } from "excalibur";
import { ResourceLoader } from "./resources.ts";
import { Color } from "excalibur";
import { Fish } from "./fish.ts";
import { ScoreUI } from "./ui/ui-overlay.ts";
import { Player } from "./player/player.ts";
import { Background } from "./background.ts";

export class Game extends Engine {
  scoreUI: ScoreUI;

  constructor() {
    super({
      width: 800,
      height: 600,
      maxFps: 60,
      pixelArt: true,
      suppressHiDPIScaling: true,
      displayMode: DisplayMode.FitScreen,
    });

    this.backgroundColor = Color.fromHex("#5fb2e9");
    this.add(new Background)
    
    // Enable debug mode to show hitboxes
    // this.showDebug(true);
    this.scoreUI = new ScoreUI();
    this.add(this.scoreUI);
    if (!localStorage.getItem("highScore")) {
      localStorage.setItem("highScore", "0");
    }

    // Spawn 10 fish
    let fishCount = 0;
    const spawnTimer = new Timer({
      fcn: () => {
        if (fishCount < 10) {
          const fish = new Fish();
          this.add(fish);
          fishCount++;
        } else {
          spawnTimer.stop();
        }
      },
      interval: 1000,
      repeats: true,
    });

    this.add(spawnTimer);
    spawnTimer.start();

    // Add the players
    this.add(new Player(1));
    this.add(new Player(2));

    // Start game
    this.start(ResourceLoader).then(() => this.startGame());
  }

  startGame() {
    console.log("start de game!");
  }
}

new Game();
