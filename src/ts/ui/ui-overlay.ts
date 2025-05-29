import { Actor, Color, Font, FontUnit, Label, Vector } from "excalibur";

export class ScoreUI extends Actor {
  #highscore: number = parseInt(localStorage.getItem("highScore") || "0");
  #highscoreLabel: Label;
  #scorePlayer1: number = 0;
  #scorePlayer2: number = 0;
  #scoreLabelPlayer1: Label;
  #scoreLabelPlayer2: Label;

  constructor() {
    super({ x: 10, y: 10 });
    this.#scoreLabelPlayer1 = new Label({
      text: "Player 2 Score: 0",
      pos: Vector.Zero,
      font: new Font({
        family: "My Font",
        size: 20,
        unit: FontUnit.Px,
        color: Color.Black,
      }),
    });
    this.addChild(this.#scoreLabelPlayer1);
    this.#scoreLabelPlayer2 = new Label({
      text: "Player 2 Score: 0",
      pos: new Vector(0, 20),
      font: new Font({
        family: "My Font",
        size: 20,
        unit: FontUnit.Px,
        color: Color.Black,
      }),
    });
    this.addChild(this.#scoreLabelPlayer2);
    this.#highscoreLabel = new Label({
      text: `Highscore: ${this.#highscore}`,
      pos: new Vector(0, 40),
      font: new Font({
        family: "My Font",
        size: 20,
        unit: FontUnit.Px,
        color: Color.Black,
      }),
    });
    this.addChild(this.#highscoreLabel);
  }
  // Update the score based on the player and the points given
  updateScore(newScore: number, name: string, player: number) {
    if (player == 1) {
      this.#scorePlayer1 += newScore;
      if( this.#scorePlayer1 > this.#highscore){
        localStorage.setItem("highScore", this.#scorePlayer1.toString())
        this.#highscore = this.#scorePlayer1
        this.#highscoreLabel.text = `Highscore: ${this.#highscore}`
      }
      this.#scoreLabelPlayer1.text =
      `Player 1 Score: ${this.#scorePlayer1} - Catched A: ${name}`;
    } else {
      this.#scorePlayer2 += newScore;
      if( this.#scorePlayer2 > this.#highscore){
        localStorage.setItem("highScore", this.#scorePlayer2.toString())
        this.#highscore = this.#scorePlayer2
        this.#highscoreLabel.text = `Highscore: ${this.#highscore}`
      }
      this.#scoreLabelPlayer2.text =
        `Player 2 Score: ${this.#scorePlayer2} - Catched A: ${name}`;
    }
  }
  // Show when a fish has gotten away based on the player
  fishGotAway(player: number) {
    if (player == 1) {
      this.#scoreLabelPlayer1.text =
      `Player 1 Score: ${this.#scorePlayer1} - Fish Got Away, Oh No!`;
    } else {
      this.#scoreLabelPlayer2.text =
      `Player 1 Score: ${this.#scorePlayer2} - Fish Got Away, Oh No!`;
      
    }
  }
}
