import { Scene } from "phaser";

type Data = {
  winner: string;
};

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameover_text: Phaser.GameObjects.Text;

  constructor() {
    super("GameOver");
  }

  create({ winner }: Data) {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0xff0000);

    this.background = this.add
      .image(512, 384, "gameOver")
      .setDisplaySize(1024, 768);
    this.add.rectangle(512, 400, 1024, 900).setFillStyle(0, 100);

    this.gameover_text = this.add.text(512, 384, winner + " wins", {
      fontFamily: "main-font",
      fontSize: 64,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });
    this.gameover_text.setOrigin(0.5);

    this.add
      .text(512, 600, "PLAY AGAIN", {
        fontFamily: "main-font",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.scene.start("MainMenu"));
  }
}
