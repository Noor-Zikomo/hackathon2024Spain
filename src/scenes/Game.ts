import { Scene } from "phaser";

type Data = { player1Name: string; player2Name: string };

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  player1Name: string;
  player2Name: string;

  constructor() {
    super("Game");
  }

  init({ player1Name, player2Name }: Data) {
    this.player1Name = player1Name;
    this.player2Name = player2Name;
  }

  handleMap() {}

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);

    this.background = this.add.image(512, 384, "background");
    this.background.setAlpha(0.5);

    console.log(this.player1Name);
    console.log(this.player2Name);

    this.add
      .text(800, 600, "END", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.scene.start("GameOver"));

    this.handleMap();
  }
}
